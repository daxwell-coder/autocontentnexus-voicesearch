import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'false'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { contentId, action = 'optimize' } = await req.json();

    if (!contentId) {
      throw new Error('Content ID is required');
    }

    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

    if (!supabaseUrl || !serviceRoleKey || !geminiApiKey) {
      throw new Error('Required configuration missing');
    }

    // Get SEO Optimization Agent configuration
    const agentResponse = await fetch(`${supabaseUrl}/rest/v1/agents?name=eq.SEO Optimization Agent`, {
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey
      }
    });

    const agents = await agentResponse.json();
    if (!agents.length) {
      throw new Error('SEO Optimization Agent not found');
    }

    const agent = agents[0];
    const config = agent.config;

    // Get content item to optimize
    const contentResponse = await fetch(`${supabaseUrl}/rest/v1/content_items?id=eq.${contentId}`, {
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey
      }
    });

    const contentItems = await contentResponse.json();
    if (!contentItems.length) {
      throw new Error('Content item not found');
    }

    const contentItem = contentItems[0];
    const { title, content_body, content_type, seo_data } = contentItem;
    const targetNiche = seo_data?.target_niche || 'general';

    // Generate SEO optimization using OpenAI
    const seoPrompt = `Analyze and optimize the following content for SEO:

Title: ${title}
Niche: ${targetNiche}
Content Type: ${content_type}

Content:
${content_body}

Provide SEO optimization including:
1. Optimized meta title (50-60 characters)
2. Meta description (150-160 characters)
3. Focus keywords (3-5 primary keywords)
4. Header structure recommendations
5. Internal linking suggestions
6. Image alt text suggestions
7. Schema markup recommendations

Return the response as JSON with the following structure:
{
  "meta_title": "optimized title",
  "meta_description": "optimized description",
  "focus_keywords": ["keyword1", "keyword2", "keyword3"],
  "headers": {
    "h1": "main heading",
    "h2": ["subheading1", "subheading2"],
    "h3": ["sub-subheading1"]
  },
  "internal_links": ["suggestion1", "suggestion2"],
  "image_alt_texts": ["alt text 1", "alt text 2"],
  "schema_markup": "Article",
  "seo_score": 85,
  "recommendations": ["rec1", "rec2"]
}`;

    const seoResponse = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: seoPrompt }]
        }]
      })
    });

    const seoData = await seoResponse.json();
    
    if (!seoResponse.ok) {
      throw new Error(`Gemini SEO API error: ${seoData.error?.message || 'Unknown error'}`);
    }

    const seoResponseText = seoData.candidates?.[0]?.content?.parts?.[0]?.text;

    let seoOptimizations;
    try {
      seoOptimizations = JSON.parse(seoResponseText);
    } catch {
      // Fallback if JSON parsing fails
      seoOptimizations = {
        meta_title: title.substring(0, 60),
        meta_description: `Learn about ${targetNiche} with expert insights and practical tips.`,
        focus_keywords: [targetNiche.toLowerCase()],
        seo_score: 75,
        recommendations: ['Content optimized by AI'],
        raw_optimization: seoResponseText
      };
    }

    // Calculate keyword density
    const wordCount = content_body.split(' ').length;
    const keywordDensity = seoOptimizations.focus_keywords ? 
      seoOptimizations.focus_keywords.reduce((total, keyword) => {
        const keywordCount = (content_body.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
        return total + (keywordCount / wordCount);
      }, 0) : 0;

    // Update content item with SEO data
    const updatedSeoData = {
      ...seo_data,
      ...seoOptimizations,
      keyword_density: keywordDensity,
      optimized_at: new Date().toISOString(),
      optimization_agent: 'SEO Optimization Agent',
      target_score: config.target_score_threshold || 85
    };

    await fetch(`${supabaseUrl}/rest/v1/content_items?id=eq.${contentId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        seo_data: updatedSeoData
      })
    });

    // Update agent last run time
    await fetch(`${supabaseUrl}/rest/v1/agents?id=eq.${agent.id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        last_run: new Date().toISOString()
      })
    });

    return new Response(JSON.stringify({
      success: true,
      data: {
        content_id: contentId,
        seo_optimizations: seoOptimizations,
        keyword_density: keywordDensity,
        optimization_timestamp: new Date().toISOString()
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('SEO Optimization Agent error:', error);
    
    const errorResponse = {
      error: {
        code: 'SEO_OPTIMIZATION_FAILED',
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