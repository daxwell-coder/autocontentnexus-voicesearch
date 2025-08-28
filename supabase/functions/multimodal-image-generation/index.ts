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
        const { prompt, style, size = '1024x1024', quality = 'standard' } = await req.json();

        console.log('Image generation request:', { prompt, style, size, quality });

        // Validate required parameters
        if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
            throw new Error('Valid image prompt is required');
        }

        // Validate size parameter
        const validSizes = ['512x512', '1024x1024', '1024x768', '768x1024'];
        if (!validSizes.includes(size)) {
            throw new Error('Invalid size. Must be one of: ' + validSizes.join(', '));
        }

        // Validate quality parameter
        const validQualities = ['standard', 'hd'];
        if (!validQualities.includes(quality)) {
            throw new Error('Invalid quality. Must be one of: ' + validQualities.join(', '));
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

        // Prepare prompt with style enhancements
        let enhancedPrompt = prompt.trim();
        
        if (style && style !== 'default') {
            const stylePrompts = {
                'photorealistic': 'photorealistic, highly detailed, professional photography, 8k resolution',
                'digital-art': 'digital art, concept art, detailed illustration, trending on artstation',
                'watercolor': 'watercolor painting, soft brushstrokes, artistic, traditional medium',
                'oil-painting': 'oil painting, classical art style, rich colors, textured canvas',
                'sketch': 'pencil sketch, hand-drawn, artistic line work, monochrome',
                'cartoon': 'cartoon style, animated, colorful, stylized illustration',
                'abstract': 'abstract art, geometric shapes, modern art, creative composition',
                'minimalist': 'minimalist design, clean lines, simple composition, modern aesthetic'
            };
            
            const styleEnhancement = stylePrompts[style as keyof typeof stylePrompts];
            if (styleEnhancement) {
                enhancedPrompt = `${enhancedPrompt}, ${styleEnhancement}`;
            }
        }

        console.log('Enhanced prompt:', enhancedPrompt);

        // Generate image - Placeholder implementation
        // TODO: Replace with actual Minimax image_gen toolkit call once integration is configured
        console.log('Generating image with Minimax toolkit (placeholder mode)');
        
        // Create placeholder response that maintains the expected API structure
        const dimensions = size.split('x');
        const width = dimensions[0];
        const height = dimensions[1];
        
        const generatedImage = {
            url: `https://picsum.photos/${width}/${height}?random=${Date.now()}`,
            image_url: `https://picsum.photos/${width}/${height}?random=${Date.now()}`,
            width: parseInt(width),
            height: parseInt(height),
            format: 'jpg',
            prompt: enhancedPrompt,
            style: style || 'default',
            quality: quality
        };

        console.log('Image generated successfully (placeholder)');

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
                            content_type: 'image',
                            prompt: prompt,
                            style: style || 'default',
                            parameters: { size, quality },
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
                image: {
                    url: generatedImage.url,
                    image_url: generatedImage.image_url,
                    prompt: prompt,
                    enhanced_prompt: enhancedPrompt,
                    style: style || 'default',
                    size: size,
                    quality: quality,
                    width: generatedImage.width,
                    height: generatedImage.height,
                    format: generatedImage.format,
                    generated_at: new Date().toISOString(),
                    note: 'Generated using Minimax AI (placeholder mode for development)'
                },
                success: true
            }
        };

        console.log('Image generation completed successfully');

        return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Image generation error:', error);

        const errorResponse = {
            error: {
                code: 'IMAGE_GENERATION_FAILED',
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
