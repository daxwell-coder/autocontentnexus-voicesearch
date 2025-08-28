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
      text,
      voice_style,
      speed,
      format,
      premium_features
    } = requestBody;

    if (!text) {
      throw new Error('Text is required for audio generation');
    }

    if (text.length > 10000) {
      throw new Error('Text exceeds maximum length of 10,000 characters');
    }

    // Map voice styles to Minimax voice IDs
    const voiceMapping = {
      'professional': 'female-shaonv',
      'friendly': 'female-tianmei', 
      'authoritative': 'male-qn-qingse',
      'casual': 'female-yujie',
      'educational': 'male-qn-jingying',
      'narrative': 'female-qn-daxuesheng',
      'celebrity': 'voice-premium-001',
      'broadcast': 'voice-premium-002',
      'documentary': 'voice-premium-003',
      'podcast': 'voice-premium-004'
    };

    const voiceId = voiceMapping[voice_style] || voiceMapping.professional;
    
    // Call Minimax TTS API
    const minimaxResponse = await fetch('https://api.minimax.io/v1/t2a_v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${minimaxApiKey}`,
        'MM-API-Source': 'Minimax-EdgeFunction'
      },
      body: JSON.stringify({
        model: 'speech-02-hd',
        text: text,
        voice_setting: {
          voice_id: voiceId,
          speed: speed || 1.0,
          vol: 1.0,
          pitch: 0,
          emotion: premium_features?.emotion_control || 'happy'
        },
        audio_setting: {
          sample_rate: premium_features?.professional_grade ? 48000 : 32000,
          bitrate: premium_features?.professional_grade ? 256000 : 128000,
          format: format || 'mp3',
          channel: 1
        },
        output_format: 'url'
      })
    });

    if (!minimaxResponse.ok) {
      const errorText = await minimaxResponse.text();
      console.error('Minimax TTS API error:', errorText);
      throw new Error(`Minimax TTS API error: ${minimaxResponse.status}`);
    }

    const minimaxData = await minimaxResponse.json();
    
    if (!minimaxData.data || !minimaxData.data.audio_url) {
      throw new Error('Invalid response from Minimax TTS API');
    }

    const audioUrl = minimaxData.data.audio_url;
    const duration = minimaxData.data.duration || Math.ceil(text.length / 150); // Estimate duration
    
    // Return structured response
    return new Response(JSON.stringify({
      data: {
        audio: {
          url: audioUrl,
          text: text,
          voice_style: voice_style || 'professional',
          voice_name: `Minimax ${voice_style || 'Professional'}`,
          speed: speed || 1.0,
          format: format || 'mp3',
          duration: duration,
          ai_provider: 'minimax',
          premium: true,
          features_used: premium_features || {},
          metadata: {
            text_length: text.length,
            voice_id: voiceId,
            generated_at: new Date().toISOString()
          }
        }
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Audio generation error:', error);
    
    const errorResponse = {
      error: {
        code: 'AUDIO_GENERATION_FAILED',
        message: error.message
      }
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});