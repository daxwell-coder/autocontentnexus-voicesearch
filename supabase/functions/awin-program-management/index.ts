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
        const { action, program_id } = requestData;

        console.log('AWIN Program Management action:', action, 'program_id:', program_id);

        switch (action) {
            case 'get_programs': {
                // Fetch programs from database using correct column names
                const response = await fetch(
                    `${supabaseUrl}/rest/v1/awin_programs?select=*&order=niche_relevance_score.desc&is_active=eq.true`,
                    {
                        headers: {
                            'Authorization': `Bearer ${serviceRoleKey}`,
                            'apikey': serviceRoleKey
                        }
                    }
                );

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Database query failed: ${errorText}`);
                }

                let programs = await response.json();

                // If no programs exist, seed with sample data
                if (programs.length === 0) {
                    console.log('No programs found, seeding with sample data...');
                    programs = await seedAwinPrograms(supabaseUrl, serviceRoleKey);
                }

                // Transform programs to match frontend interface
                const transformedPrograms = programs.map((program: any) => ({
                    id: program.id,
                    program_id: program.program_id,
                    name: program.program_name || 'Unknown Program',
                    merchant: program.merchant_name || 'Unknown Merchant',
                    description: program.description || '',
                    status: mapApplicationStatus(program.application_status, program.status),
                    relevance: Math.round((program.niche_relevance_score || 0) * 100),
                    region: program.primary_region_name || 'Unknown',
                    sector: program.primary_sector || 'General',
                    logo_url: program.logo_url,
                    website_url: program.display_url,
                    click_through_url: program.click_through_url,
                    commission_rate: parseFloat(program.commission_rate) || 0,
                    currency_code: program.currency_code || 'USD',
                    niches: extractNiches(program)
                }));

                // Calculate summary stats
                const summary = {
                    total: transformedPrograms.length,
                    discovered: transformedPrograms.filter((p: any) => p.status === 'not_applied').length,
                    applied: transformedPrograms.filter((p: any) => p.status === 'pending').length,
                    joined: transformedPrograms.filter((p: any) => p.status === 'approved').length
                };

                return new Response(JSON.stringify({
                    success: true,
                    data: {
                        programs: transformedPrograms,
                        summary: summary,
                        last_updated: new Date().toISOString()
                    }
                }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }

            case 'apply_to_program': {
                if (!program_id) {
                    throw new Error('program_id is required');
                }

                // Update the program status to 'pending'
                const updateResponse = await fetch(
                    `${supabaseUrl}/rest/v1/awin_programs?program_id=eq.${program_id}`,
                    {
                        method: 'PATCH',
                        headers: {
                            'Authorization': `Bearer ${serviceRoleKey}`,
                            'apikey': serviceRoleKey,
                            'Content-Type': 'application/json',
                            'Prefer': 'return=representation'
                        },
                        body: JSON.stringify({
                            application_status: 'pending',
                            last_applied_date: new Date().toISOString().split('T')[0], // Date only
                            updated_at: new Date().toISOString()
                        })
                    }
                );

                if (!updateResponse.ok) {
                    const errorText = await updateResponse.text();
                    throw new Error(`Failed to update program status: ${errorText}`);
                }

                const updatedProgram = await updateResponse.json();

                if (!updatedProgram || updatedProgram.length === 0) {
                    throw new Error('Program not found or no changes made');
                }

                // Transform the response to match frontend expectations
                const transformedProgram = {
                    id: updatedProgram[0].id,
                    program_id: updatedProgram[0].program_id,
                    name: updatedProgram[0].program_name,
                    merchant: updatedProgram[0].merchant_name,
                    status: 'pending',
                    application_status: updatedProgram[0].application_status
                };

                return new Response(JSON.stringify({
                    success: true,
                    data: {
                        program: transformedProgram,
                        message: `Successfully applied to ${updatedProgram[0].program_name || 'program'}`
                    }
                }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }

            case 'reject_program': {
                if (!program_id) {
                    throw new Error('program_id is required');
                }

                // Update the program status to 'rejected'
                const updateResponse = await fetch(
                    `${supabaseUrl}/rest/v1/awin_programs?program_id=eq.${program_id}`,
                    {
                        method: 'PATCH',
                        headers: {
                            'Authorization': `Bearer ${serviceRoleKey}`,
                            'apikey': serviceRoleKey,
                            'Content-Type': 'application/json',
                            'Prefer': 'return=representation'
                        },
                        body: JSON.stringify({
                            application_status: 'rejected',
                            rejection_reason: 'Manually rejected by user',
                            updated_at: new Date().toISOString()
                        })
                    }
                );

                if (!updateResponse.ok) {
                    const errorText = await updateResponse.text();
                    throw new Error(`Failed to update program status: ${errorText}`);
                }

                const updatedProgram = await updateResponse.json();

                if (!updatedProgram || updatedProgram.length === 0) {
                    throw new Error('Program not found or no changes made');
                }

                // Transform the response to match frontend expectations
                const transformedProgram = {
                    id: updatedProgram[0].id,
                    program_id: updatedProgram[0].program_id,
                    name: updatedProgram[0].program_name,
                    merchant: updatedProgram[0].merchant_name,
                    status: 'rejected',
                    application_status: updatedProgram[0].application_status
                };

                return new Response(JSON.stringify({
                    success: true,
                    data: {
                        program: transformedProgram,
                        message: `Successfully rejected ${updatedProgram[0].program_name || 'program'}`
                    }
                }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }

            default:
                throw new Error(`Invalid action: ${action}`);
        }

    } catch (error) {
        console.error('AWIN program management error:', error);

        const errorResponse = {
            success: false,
            error: {
                code: 'AWIN_PROGRAM_ERROR',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});

// Helper function to map database application status to frontend status
function mapApplicationStatus(applicationStatus: string, generalStatus: string): string {
    if (applicationStatus) {
        switch (applicationStatus.toLowerCase()) {
            case 'pending':
            case 'applied':
                return 'pending';
            case 'approved':
            case 'accepted':
            case 'joined':
                return 'approved';
            case 'rejected':
            case 'declined':
                return 'rejected';
            case 'not_applied':
            case 'available':
            default:
                return 'not_applied';
        }
    }
    
    // Fallback to general status
    if (generalStatus) {
        return generalStatus.toLowerCase().replace(/[^a-z_]/, '') || 'not_applied';
    }
    
    return 'not_applied';
}

// Helper function to extract niches from the program data
function extractNiches(program: any): string[] {
    const niches = [];
    
    if (program.renewable_energy_match) niches.push('Renewable Energy');
    if (program.sustainable_living_match) niches.push('Sustainable Living');
    if (program.energy_efficiency_match) niches.push('Energy Efficiency');
    if (program.electric_vehicle_match) niches.push('Electric Vehicles');
    if (program.green_building_match) niches.push('Green Building');
    if (program.water_conservation_match) niches.push('Water Conservation');
    
    // If no specific niches, use the primary sector
    if (niches.length === 0 && program.primary_sector) {
        niches.push(program.primary_sector);
    }
    
    return niches.length > 0 ? niches : ['General'];
}

// Helper function to seed sample AWIN programs (using correct column names)
async function seedAwinPrograms(supabaseUrl: string, serviceRoleKey: string) {
    const samplePrograms = [
        {
            program_id: 1001,
            program_name: 'EcoFlow Solar Generator Program',
            merchant_name: 'EcoFlow',
            description: 'Partner with EcoFlow to promote portable solar power solutions and backup generators for sustainable energy independence.',
            application_status: 'not_applied',
            niche_relevance_score: 0.95,
            primary_region_name: 'Global',
            primary_sector: 'Renewable Energy',
            commission_rate: '8.5',
            currency_code: 'USD',
            renewable_energy_match: true,
            sustainable_living_match: true,
            is_active: true,
            priority_score: 95
        },
        {
            program_id: 1002,
            program_name: 'Tesla Solar Roof Affiliate',
            merchant_name: 'Tesla Energy',
            description: 'Promote Tesla\'s integrated solar roof tiles and Powerwall home battery systems for residential renewable energy.',
            application_status: 'not_applied',
            niche_relevance_score: 0.92,
            primary_region_name: 'North America',
            primary_sector: 'Renewable Energy',
            commission_rate: '5.0',
            currency_code: 'USD',
            renewable_energy_match: true,
            electric_vehicle_match: true,
            is_active: true,
            priority_score: 92
        },
        {
            program_id: 1003,
            program_name: 'Patagonia Sustainable Apparel',
            merchant_name: 'Patagonia',
            description: 'Partner with Patagonia to promote environmentally responsible outdoor clothing and gear made from recycled materials.',
            application_status: 'not_applied',
            niche_relevance_score: 0.88,
            primary_region_name: 'Global',
            primary_sector: 'Sustainable Fashion',
            commission_rate: '4.0',
            currency_code: 'USD',
            sustainable_living_match: true,
            is_active: true,
            priority_score: 88
        },
        {
            program_id: 1004,
            program_name: 'Bluetti Power Station Program',
            merchant_name: 'Bluetti',
            description: 'Promote portable power stations and solar panels for outdoor adventures and emergency preparedness.',
            application_status: 'pending',
            niche_relevance_score: 0.89,
            primary_region_name: 'Global',
            primary_sector: 'Renewable Energy',
            commission_rate: '7.0',
            currency_code: 'USD',
            renewable_energy_match: true,
            energy_efficiency_match: true,
            is_active: true,
            priority_score: 89
        },
        {
            program_id: 1005,
            program_name: 'Seventh Generation Eco Products',
            merchant_name: 'Seventh Generation',
            description: 'Promote plant-based household cleaning products, personal care items, and baby products made with sustainable ingredients.',
            application_status: 'approved',
            niche_relevance_score: 0.82,
            primary_region_name: 'North America',
            primary_sector: 'Sustainable Living',
            commission_rate: '6.5',
            currency_code: 'USD',
            sustainable_living_match: true,
            is_active: true,
            priority_score: 82,
            join_date: '2024-01-15'
        },
        {
            program_id: 1006,
            program_name: 'Goal Zero Solar Equipment',
            merchant_name: 'Goal Zero',
            description: 'Partner with Goal Zero to sell portable solar panels, power banks, and solar generators for outdoor and emergency use.',
            application_status: 'not_applied',
            niche_relevance_score: 0.86,
            primary_region_name: 'Global',
            primary_sector: 'Renewable Energy',
            commission_rate: '8.0',
            currency_code: 'USD',
            renewable_energy_match: true,
            energy_efficiency_match: true,
            is_active: true,
            priority_score: 86
        }
    ];

    const insertResponse = await fetch(`${supabaseUrl}/rest/v1/awin_programs`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        },
        body: JSON.stringify(samplePrograms)
    });

    if (!insertResponse.ok) {
        const errorText = await insertResponse.text();
        console.error('Failed to seed programs:', errorText);
        return [];
    }

    const insertedPrograms = await insertResponse.json();
    
    // Transform the inserted programs to match the expected format
    return insertedPrograms.map((program: any) => ({
        id: program.id,
        program_id: program.program_id,
        name: program.program_name,
        merchant: program.merchant_name,
        description: program.description,
        status: mapApplicationStatus(program.application_status, program.status),
        relevance: Math.round((program.niche_relevance_score || 0) * 100),
        region: program.primary_region_name,
        sector: program.primary_sector,
        logo_url: program.logo_url,
        commission_rate: parseFloat(program.commission_rate) || 0,
        currency_code: program.currency_code,
        niches: extractNiches(program)
    }));
}
