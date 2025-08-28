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
        const { text, voice_style = 'default', speed = 1.0, format = 'mp3' } = await req.json();

        console.log('Audio generation request:', { text: text?.substring(0, 100) + '...', voice_style, speed, format });

        // Validate required parameters
        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            throw new Error('Valid text content is required for audio generation');
        }

        if (text.trim().length > 5000) {
            throw new Error('Text content is too long. Maximum 5000 characters allowed.');
        }

        // Validate speed parameter
        if (typeof speed !== 'number' || speed < 0.5 || speed > 2.0) {
            throw new Error('Speed must be a number between 0.5 and 2.0');
        }

        // Validate format parameter
        const validFormats = ['mp3', 'wav', 'ogg'];
        if (!validFormats.includes(format)) {
            throw new Error('Invalid format. Must be one of: ' + validFormats.join(', '));
        }

        // Get user from auth header if provided
        let userId = null;
        const authHeader = req.headers.get('authorization');
        if (authHeader) {
            try {
                const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
                const supabaseUrl = Deno.env.get('SUPABASE_URL');
                
                const token = authHeader.replace('Bearer ', '');
                const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'apikey': serviceRoleKey || ''
                    }
                });
                
                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    userId = userData.id;
                    console.log('User identified:', userId);
                }
            } catch (error) {
                console.log('Could not get user from token:', error.message);
            }
        }

        // Generate audio - Placeholder implementation
        // TODO: Replace with actual Minimax audio_kit toolkit call once integration is configured
        console.log('Generating audio with Minimax toolkit (placeholder mode)');
        
        // Map voice styles to descriptive names
        const voiceStyleMap = {
            'professional': 'Professional Voice',
            'friendly': 'Friendly Voice',
            'authoritative': 'Authoritative Voice',
            'casual': 'Casual Voice',
            'educational': 'Educational Voice',
            'narrative': 'Narrative Voice',
            'default': 'Default Voice'
        };
        
        const selectedVoiceName = voiceStyleMap[voice_style as keyof typeof voiceStyleMap] || 'Default Voice';
        
        // Simulate audio generation duration (roughly 150 words per minute for speech)
        const wordCount = text.split(' ').length;
        const estimatedDurationSeconds = Math.round((wordCount / 150) * 60 / speed);
        
        // Create placeholder response that maintains the expected API structure
        const generatedAudio = {
            url: `https://www.soundjay.com/misc/sounds/bell-ringing-05.wav`, // Placeholder audio URL
            audio_url: `https://www.soundjay.com/misc/sounds/bell-ringing-05.wav`,
            duration: estimatedDurationSeconds,
            format: format,
            file_size: Math.round(estimatedDurationSeconds * 32000), // Approximate file size
            text: text,
            voice_style: voice_style,
            voice_name: selectedVoiceName,
            speed: speed
        };

        console.log('Audio generated successfully (placeholder)');

        // Log generation activity (optional)
        if (userId) {
            try {
                const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
                const supabaseUrl = Deno.env.get('SUPABASE_URL');
                
                if (serviceRoleKey && supabaseUrl) {
                    await fetch(`${supabaseUrl}/rest/v1/ai_generation_logs`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${serviceRoleKey}`,
                            'apikey': serviceRoleKey,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            user_id: userId,
                            content_type: 'audio',
                            prompt: text.substring(0, 200),
                            style: voice_style,
                            parameters: { speed, format, voice_style },
                            created_at: new Date().toISOString()
                        })
                    });
                }
            } catch (logError) {
                console.log('Failed to log generation activity:', logError.message);
            }
        }

        const result = {
            data: {
                audio: {
                    url: generatedAudio.url,
                    audio_url: generatedAudio.audio_url,
                    duration: generatedAudio.duration,
                    text: text,
                    voice_style: voice_style,
                    voice_name: selectedVoiceName,
                    speed: speed,
                    format: format,
                    file_size: generatedAudio.file_size,
                    word_count: wordCount,
                    estimated_duration: estimatedDurationSeconds,
                    generated_at: new Date().toISOString(),
                    note: 'Generated using Minimax AI (placeholder mode for development)'
                },
                success: true
            }
        };

        console.log('Audio generation completed successfully');

        return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Audio generation error:', error);

        const errorResponse = {
            error: {
                code: 'AUDIO_GENERATION_FAILED',
                message: error.message,
                timestamp: new Date().toISOString()
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
