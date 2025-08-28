Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'false'
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        // Get environment variables
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

        if (!supabaseUrl || !serviceRoleKey) {
            throw new Error('Supabase configuration missing');
        }

        const requestData = await req.json();
        const { action, selected_programs, user_credentials, user_profile } = requestData;

        console.log('Automated Application Assistant action:', action);

        switch (action) {
            case 'start_automation': {
                if (!selected_programs || selected_programs.length === 0) {
                    throw new Error('No programs selected for automation');
                }

                if (!user_credentials || !user_credentials.awin_email || !user_credentials.awin_password) {
                    throw new Error('AWIN credentials required for automation');
                }

                // Validate selected programs exist and are in 'not_applied' status
                const programIds = selected_programs.map((p: any) => p.program_id).join(',');
                const programsResponse = await fetch(
                    `${supabaseUrl}/rest/v1/awin_programs?program_id=in.(${programIds})&select=*`,
                    {
                        headers: {
                            'Authorization': `Bearer ${serviceRoleKey}`,
                            'apikey': serviceRoleKey
                        }
                    }
                );

                if (!programsResponse.ok) {
                    throw new Error('Failed to validate selected programs');
                }

                const programs = await programsResponse.json();
                const validPrograms = programs.filter((p: any) => 
                    p.application_status === 'not_applied' && p.is_active === true
                );

                if (validPrograms.length === 0) {
                    throw new Error('No valid programs available for automation');
                }

                // Create automation session record
                const sessionData = {
                    user_id: requestData.user_id || 'anonymous',
                    session_id: crypto.randomUUID(),
                    status: 'pending',
                    total_programs: validPrograms.length,
                    completed_programs: 0,
                    failed_programs: 0,
                    selected_program_ids: validPrograms.map((p: any) => p.program_id),
                    automation_config: {
                        credentials_provided: true,
                        profile_data: user_profile || {},
                        automation_mode: 'semi_automatic',
                        created_at: new Date().toISOString()
                    },
                    started_at: new Date().toISOString()
                };

                // Save automation session to database
                const sessionResponse = await fetch(`${supabaseUrl}/rest/v1/automation_sessions`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation'
                    },
                    body: JSON.stringify(sessionData)
                });

                if (!sessionResponse.ok) {
                    // Table might not exist, create it dynamically
                    console.log('Creating automation_sessions table...');
                    await createAutomationSessionsTable(supabaseUrl, serviceRoleKey);
                    
                    // Retry session creation
                    const retryResponse = await fetch(`${supabaseUrl}/rest/v1/automation_sessions`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${serviceRoleKey}`,
                            'apikey': serviceRoleKey,
                            'Content-Type': 'application/json',
                            'Prefer': 'return=representation'
                        },
                        body: JSON.stringify(sessionData)
                    });
                    
                    if (!retryResponse.ok) {
                        const errorText = await retryResponse.text();
                        throw new Error(`Failed to create automation session: ${errorText}`);
                    }
                }

                const session = await sessionResponse.json();

                // Call the real browser automation service
                const automationServiceUrl = Deno.env.get('AUTOMATION_SERVICE_URL') || 'http://localhost:3001';
                
                try {
                    const automationResponse = await fetch(`${automationServiceUrl}/automation/awin-applications`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            credentials: {
                                email: user_credentials.awin_email,
                                password: user_credentials.awin_password
                            },
                            programs: validPrograms.map((p: any) => ({
                                program_id: p.program_id,
                                name: p.program_name,
                                merchant: p.merchant_name,
                                sector: p.primary_sector,
                                niches: extractNiches(p)
                            })),
                            userProfile: user_profile,
                            sessionId: sessionData.session_id
                        })
                    });

                    if (!automationResponse.ok) {
                        const errorData = await automationResponse.json();
                        throw new Error(errorData.error?.message || 'Automation service failed');
                    }

                    const automationResult = await automationResponse.json();
                    
                    if (!automationResult.success) {
                        throw new Error(automationResult.error?.message || 'Browser automation failed');
                    }

                    // Update program statuses based on automation results
                    const results = automationResult.data.results || [];
                    for (const result of results) {
                        let newStatus = 'not_applied';
                        if (result.status === 'submitted') {
                            newStatus = 'pending';
                        } else if (result.status === 'already_applied') {
                            newStatus = 'pending';
                        } else if (result.status === 'error') {
                            newStatus = 'not_applied'; // Keep as not applied if there was an error
                        }

                        // Update program status
                        await fetch(
                            `${supabaseUrl}/rest/v1/awin_programs?program_id=eq.${result.program_id}`,
                            {
                                method: 'PATCH',
                                headers: {
                                    'Authorization': `Bearer ${serviceRoleKey}`,
                                    'apikey': serviceRoleKey,
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    application_status: newStatus,
                                    last_applied_date: newStatus === 'pending' ? new Date().toISOString().split('T')[0] : undefined,
                                    updated_at: new Date().toISOString()
                                })
                            }
                        );
                    }

                    // Update session status
                    await fetch(
                        `${supabaseUrl}/rest/v1/automation_sessions?session_id=eq.${sessionData.session_id}`,
                        {
                            method: 'PATCH',
                            headers: {
                                'Authorization': `Bearer ${serviceRoleKey}`,
                                'apikey': serviceRoleKey,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                status: 'completed',
                                completed_programs: automationResult.data.successful || 0,
                                failed_programs: automationResult.data.errors || 0,
                                completed_at: new Date().toISOString(),
                                updated_at: new Date().toISOString()
                            })
                        }
                    );

                    return new Response(JSON.stringify({
                        success: true,
                        data: {
                            session_id: sessionData.session_id,
                            status: 'automation_completed',
                            total_programs: validPrograms.length,
                            results: automationResult.data.results,
                            successful_applications: automationResult.data.successful || 0,
                            failed_applications: automationResult.data.errors || 0,
                            message: `Automation completed. ${automationResult.data.successful || 0} applications submitted successfully.`
                        }
                    }), {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                    });

                } catch (automationError) {
                    console.error('Browser automation error:', automationError);
                    
                    // Update session status to failed
                    await fetch(
                        `${supabaseUrl}/rest/v1/automation_sessions?session_id=eq.${sessionData.session_id}`,
                        {
                            method: 'PATCH',
                            headers: {
                                'Authorization': `Bearer ${serviceRoleKey}`,
                                'apikey': serviceRoleKey,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                status: 'failed',
                                updated_at: new Date().toISOString()
                            })
                        }
                    );
                    
                    throw new Error(`Browser automation failed: ${automationError.message}`);
                }
            }

            case 'update_progress': {
                const { session_id, program_id, status, result } = requestData;
                
                if (!session_id || !program_id || !status) {
                    throw new Error('session_id, program_id, and status are required');
                }

                // Update program status in awin_programs table
                const updateResponse = await fetch(
                    `${supabaseUrl}/rest/v1/awin_programs?program_id=eq.${program_id}`,
                    {
                        method: 'PATCH',
                        headers: {
                            'Authorization': `Bearer ${serviceRoleKey}`,
                            'apikey': serviceRoleKey,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            application_status: status,
                            last_applied_date: status === 'pending' ? new Date().toISOString().split('T')[0] : undefined,
                            updated_at: new Date().toISOString()
                        })
                    }
                );

                if (!updateResponse.ok) {
                    throw new Error('Failed to update program status');
                }

                // Update automation session progress
                const sessionUpdateResponse = await fetch(
                    `${supabaseUrl}/rest/v1/automation_sessions?session_id=eq.${session_id}`,
                    {
                        method: 'PATCH',
                        headers: {
                            'Authorization': `Bearer ${serviceRoleKey}`,
                            'apikey': serviceRoleKey,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            completed_programs: `completed_programs + 1`,
                            failed_programs: status === 'rejected' ? `failed_programs + 1` : undefined,
                            updated_at: new Date().toISOString()
                        })
                    }
                );

                return new Response(JSON.stringify({
                    success: true,
                    data: {
                        program_id,
                        new_status: status,
                        message: `Program ${program_id} status updated to ${status}`
                    }
                }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }

            case 'get_session_status': {
                const { session_id } = requestData;
                
                if (!session_id) {
                    throw new Error('session_id is required');
                }

                const sessionResponse = await fetch(
                    `${supabaseUrl}/rest/v1/automation_sessions?session_id=eq.${session_id}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${serviceRoleKey}`,
                            'apikey': serviceRoleKey
                        }
                    }
                );

                if (!sessionResponse.ok) {
                    throw new Error('Failed to fetch session status');
                }

                const sessions = await sessionResponse.json();
                if (sessions.length === 0) {
                    throw new Error('Session not found');
                }

                const session = sessions[0];
                const progress_percentage = session.total_programs > 0 
                    ? Math.round((session.completed_programs / session.total_programs) * 100)
                    : 0;

                return new Response(JSON.stringify({
                    success: true,
                    data: {
                        session_id: session.session_id,
                        status: session.status,
                        progress_percentage,
                        total_programs: session.total_programs,
                        completed_programs: session.completed_programs,
                        failed_programs: session.failed_programs,
                        started_at: session.started_at,
                        updated_at: session.updated_at
                    }
                }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }

            default:
                throw new Error(`Invalid action: ${action}`);
        }

    } catch (error) {
        console.error('Automated Application Assistant error:', error);

        const errorResponse = {
            success: false,
            error: {
                code: 'AUTOMATION_ERROR',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});

// Helper function to create automation_sessions table if it doesn't exist
async function createAutomationSessionsTable(supabaseUrl: string, serviceRoleKey: string) {
    const createTableSQL = `
        CREATE TABLE IF NOT EXISTS automation_sessions (
            id SERIAL PRIMARY KEY,
            user_id TEXT NOT NULL,
            session_id UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
            status TEXT NOT NULL DEFAULT 'pending',
            total_programs INTEGER NOT NULL DEFAULT 0,
            completed_programs INTEGER NOT NULL DEFAULT 0,
            failed_programs INTEGER NOT NULL DEFAULT 0,
            selected_program_ids INTEGER[] NOT NULL DEFAULT '{}',
            automation_config JSONB NOT NULL DEFAULT '{}',
            started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
            completed_at TIMESTAMP WITH TIME ZONE,
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
        );

        -- Create indexes for performance
        CREATE INDEX IF NOT EXISTS idx_automation_sessions_user_id ON automation_sessions(user_id);
        CREATE INDEX IF NOT EXISTS idx_automation_sessions_session_id ON automation_sessions(session_id);
        CREATE INDEX IF NOT EXISTS idx_automation_sessions_status ON automation_sessions(status);
    `;

    try {
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: createTableSQL })
        });

        if (!response.ok) {
            console.warn('Could not create automation_sessions table via RPC, table may already exist');
        }
    } catch (err) {
        console.warn('Error creating automation_sessions table:', err);
    }
}
