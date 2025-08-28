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
        const { 
            topic, 
            content_type = 'article', 
            ai_provider = 'gemini', 
            target_audience = 'general', 
            tone = 'professional', 
            word_count = 1000, 
            seo_keywords = [], 
            sustainability_focus = true,
            include_images = false
        } = await req.json();

        console.log('Enhanced text generation request:', { topic, content_type, ai_provider, target_audience, tone, word_count });

        // Validate required parameters
        if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
            throw new Error('Valid topic is required for content generation');
        }

        // Validate word count
        if (typeof word_count !== 'number' || word_count < 100 || word_count > 15000) {
            throw new Error('Word count must be between 100 and 15000');
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

        // Build enhanced prompt based on parameters
        let prompt = buildEnhancedPrompt({
            topic,
            content_type,
            target_audience,
            tone,
            word_count,
            seo_keywords: Array.isArray(seo_keywords) ? seo_keywords : [],
            sustainability_focus,
            include_images
        });

        console.log('Generated prompt length:', prompt.length);

        // Use the appropriate API based on ai_provider
        let generatedContent;
        
        if (ai_provider === 'gemini') {
            const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
            if (!geminiApiKey) {
                throw new Error('Gemini API key not configured');
            }
            generatedContent = await generateWithGemini(prompt, geminiApiKey);
        } else if (ai_provider === 'claude') {
            const claudeApiKey = Deno.env.get('CLAUDE_API_KEY');
            if (!claudeApiKey) {
                throw new Error('Claude API key not configured');
            }
            generatedContent = await generateWithClaude(prompt, claudeApiKey);
        } else if (ai_provider === 'openai') {
            const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
            if (!openaiApiKey) {
                throw new Error('OpenAI API key not configured');
            }
            generatedContent = await generateWithOpenAI(prompt, openaiApiKey);
        } else {
            throw new Error('Invalid AI provider. Must be one of: gemini, claude, openai');
        }

        console.log('Content generated successfully, length:', generatedContent.length);

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
                            content_type: 'text',
                            prompt: topic,
                            style: `${content_type}_${tone}`,
                            parameters: { ai_provider, word_count, target_audience, seo_keywords },
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
                content: {
                    text: generatedContent,
                    topic: topic,
                    content_type: content_type,
                    ai_provider: ai_provider,
                    target_audience: target_audience,
                    tone: tone,
                    word_count: generatedContent.split(' ').length,
                    seo_keywords: seo_keywords,
                    sustainability_focus: sustainability_focus,
                    include_images: include_images,
                    generated_at: new Date().toISOString()
                },
                success: true
            }
        };

        console.log('Text generation completed successfully');

        return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Text generation error:', error);

        const errorResponse = {
            error: {
                code: 'TEXT_GENERATION_FAILED',
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

// Helper function to build enhanced prompts
function buildEnhancedPrompt(params: any): string {
    const {
        topic,
        content_type,
        target_audience,
        tone,
        word_count,
        seo_keywords,
        sustainability_focus,
        include_images
    } = params;

    let prompt = `Create a ${content_type} about "${topic}"\n\n`;

    // Add content type specific instructions
    const contentTypeInstructions = {
        'article': 'Write an informative, well-structured article with clear headings, subheadings, and comprehensive coverage of the topic.',
        'blog-post': 'Write an engaging blog post with a conversational tone, personal insights, and actionable takeaways for readers.',
        'product-review': 'Write a detailed product review with pros and cons, technical specifications, user experience insights, and a final recommendation.'
    };

    prompt += contentTypeInstructions[content_type as keyof typeof contentTypeInstructions] || contentTypeInstructions.article;
    prompt += '\n\n';

    // Add audience targeting
    prompt += `Target Audience: ${target_audience}\n`;
    prompt += `Tone: ${tone}\n`;
    prompt += `Target Word Count: Approximately ${word_count} words\n\n`;

    // Add SEO keywords if provided
    if (seo_keywords && seo_keywords.length > 0) {
        prompt += `SEO Keywords to naturally incorporate: ${seo_keywords.join(', ')}\n\n`;
    }

    // Add sustainability focus
    if (sustainability_focus) {
        prompt += 'Important: Include eco-friendly insights, sustainable practices, and environmental considerations throughout the content.\n\n';
    }

    // Add image placeholders if requested
    if (include_images) {
        prompt += 'Include [IMAGE: description] placeholders where relevant images would enhance the content.\n\n';
    }

    // Add structure guidelines
    prompt += 'Structure Guidelines:\n';
    prompt += '- Start with an engaging introduction\n';
    prompt += '- Use clear headings and subheadings\n';
    prompt += '- Include bullet points or numbered lists where appropriate\n';
    prompt += '- End with a strong conclusion\n';
    prompt += '- Ensure content is actionable and valuable to readers\n\n';

    prompt += 'Generate the content now:';

    return prompt;
}

// AI Provider Integration Functions
async function generateWithGemini(prompt: string, apiKey: string): Promise<string> {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: prompt }]
            }]
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API error: ${errorText}`);
    }

    const data = await response.json();
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response from Gemini API');
    }

    return data.candidates[0].content.parts[0].text;
}

async function generateWithClaude(prompt: string, apiKey: string): Promise<string> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: 'claude-3-sonnet-20240229',
            max_tokens: 4000,
            messages: [{
                role: 'user',
                content: prompt
            }]
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Claude API error: ${errorText}`);
    }

    const data = await response.json();
    if (!data.content || !data.content[0] || !data.content[0].text) {
        throw new Error('Invalid response from Claude API');
    }

    return data.content[0].text;
}

async function generateWithOpenAI(prompt: string, apiKey: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-4-turbo-preview',
            messages: [{
                role: 'user',
                content: prompt
            }],
            max_tokens: 4000,
            temperature: 0.7
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI API error: ${errorText}`);
    }

    const data = await response.json();
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response from OpenAI API');
    }

    return data.choices[0].message.content;
}
