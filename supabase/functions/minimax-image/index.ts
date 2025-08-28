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
      prompt,
      style,
      size,
      quality,
      premium_features
    } = requestBody;

    if (!prompt) {
      throw new Error('Prompt is required for image generation');
    }

    // Build enhanced prompt based on style and premium features
    let enhancedPrompt = prompt;
    
    if (style && style !== 'photorealistic') {
      enhancedPrompt += `, ${style} style`;
    }
    
    if (premium_features) {
      if (premium_features.enhanced_details) {
        enhancedPrompt += ', ultra-fine details and textures, professional quality';
      }
      if (premium_features.professional_grade) {
        enhancedPrompt += ', commercial-ready, perfect composition and lighting';
      }
      if (premium_features.brand_consistency) {
        enhancedPrompt += ', consistent visual style, brand-appropriate';
      }
    }

    // Parse size dimensions
    const [width, height] = (size || '1024x1024').split('x').map(Number);
    
    // Call Minimax image generation API
    const minimaxResponse = await fetch('https://api.minimax.io/v1/image_generation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${minimaxApiKey}`,
        'MM-API-Source': 'Minimax-EdgeFunction'
      },
      body: JSON.stringify({
        model: 'image-01',
        prompt: enhancedPrompt,
        aspect_ratio: size.includes('x') ? size.replace('x', ':') : '1:1',
        n: 1,
        prompt_optimizer: premium_features?.enhanced_details || false
      })
    });

    if (!minimaxResponse.ok) {
      const errorText = await minimaxResponse.text();
      console.error('Minimax Image API error:', errorText);
      throw new Error(`Minimax Image API error: ${minimaxResponse.status}`);
    }

    const minimaxData = await minimaxResponse.json();
    
    if (!minimaxData.data || !minimaxData.data[0]) {
      throw new Error('Invalid response from Minimax Image API');
    }

    const imageUrl = minimaxData.data[0].url;
    
    // Return structured response
    return new Response(JSON.stringify({
      data: {
        image: {
          url: imageUrl,
          prompt: prompt,
          enhanced_prompt: enhancedPrompt,
          style: style || 'photorealistic',
          size: size || '1024x1024',
          quality: quality || 'standard',
          ai_provider: 'minimax',
          premium: true,
          features_used: premium_features || {},
          metadata: {
            width,
            height,
            generated_at: new Date().toISOString()
          }
        }
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Image generation error:', error);
    
    const errorResponse = {
      error: {
        code: 'IMAGE_GENERATION_FAILED',
        message: error.message
      }
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});