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
    // Get API credentials from environment
    const minimaxApiKey = Deno.env.get('MINIMAX_API_KEY');
    const minimaxGroupId = Deno.env.get('MINIMAX_GROUP_ID');

    if (!minimaxApiKey || !minimaxGroupId) {
      throw new Error('Minimax API credentials not configured');
    }

    // Parse request body
    const requestBody = await req.json();
    const {
      topic,
      content_type,
      target_audience,
      tone,
      word_count,
      seo_keywords,
      sustainability_focus,
      include_images,
      premium_features
    } = requestBody;

    if (!topic) {
      throw new Error('Topic is required');
    }

    // Build comprehensive prompt for premium text generation
    let prompt = `Write a comprehensive ${content_type || 'article'} about "${topic}".`;
    
    if (target_audience) {
      prompt += ` Target audience: ${target_audience}.`;
    }
    
    if (tone) {
      prompt += ` Use a ${tone} tone throughout.`;
    }
    
    if (word_count) {
      prompt += ` Aim for approximately ${word_count} words.`;
    }
    
    if (seo_keywords && seo_keywords.length > 0) {
      prompt += ` Include these SEO keywords naturally: ${seo_keywords.join(', ')}.`;
    }
    
    if (sustainability_focus) {
      prompt += ` Focus on eco-friendly and sustainable aspects where relevant.`;
    }
    
    if (include_images) {
      prompt += ` Include image placeholders with descriptive alt text.`;
    }

    // Add premium features if enabled
    if (premium_features) {
      if (premium_features.advanced_reasoning) {
        prompt += ` Use sophisticated analytical reasoning with cause-and-effect analysis.`;
      }
      if (premium_features.multi_language) {
        prompt += ` Consider multi-cultural perspectives and global context.`;
      }
    }

    prompt += ` Structure the content with clear headings, subheadings, and make it engaging and informative.`;

    // Call Minimax API
    const minimaxResponse = await fetch('https://api.minimax.chat/v1/text/chatcompletion_v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${minimaxApiKey}`
      },
      body: JSON.stringify({
        model: 'abab6.5-chat',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        stream: false,
        temperature: 0.7,
        top_p: 0.95,
        max_tokens: Math.min(word_count * 2 || 4000, 8000),
        group_id: minimaxGroupId
      })
    });

    if (!minimaxResponse.ok) {
      const errorText = await minimaxResponse.text();
      console.error('Minimax API error:', errorText);
      throw new Error(`Minimax API error: ${minimaxResponse.status}`);
    }

    const minimaxData = await minimaxResponse.json();
    
    if (!minimaxData.choices || !minimaxData.choices[0]) {
      throw new Error('Invalid response from Minimax API');
    }

    const generatedText = minimaxData.choices[0].message.content;
    
    // Calculate actual word count
    const actualWordCount = generatedText.split(/\s+/).length;

    // Return structured response
    return new Response(JSON.stringify({
      data: {
        content: {
          text: generatedText,
          word_count: actualWordCount,
          content_type: content_type || 'article',
          ai_provider: 'minimax',
          premium: true,
          features_used: premium_features || {},
          metadata: {
            topic,
            target_audience,
            tone,
            requested_word_count: word_count,
            seo_keywords,
            sustainability_focus,
            generated_at: new Date().toISOString()
          }
        }
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Text generation error:', error);
    
    const errorResponse = {
      error: {
        code: 'TEXT_GENERATION_FAILED',
        message: error.message
      }
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});