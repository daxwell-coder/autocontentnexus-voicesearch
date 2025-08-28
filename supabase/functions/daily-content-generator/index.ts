const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'false'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const startTime = Date.now();
  console.log('Daily Content Generator started at:', new Date().toISOString());

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Supabase configuration missing');
    }

    console.log('Environment variables loaded successfully');

    // Get Content Creation Agent configuration
    const agentResponse = await fetch(`${supabaseUrl}/rest/v1/agents?name=eq.Content Creation Agent`, {
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey,
        'Content-Type': 'application/json'
      }
    });

    if (!agentResponse.ok) {
      throw new Error(`Failed to fetch agent config: ${agentResponse.status}`);
    }

    const agents = await agentResponse.json();
    if (!agents.length) {
      throw new Error('Content Creation Agent not found');
    }

    const agent = agents[0];
    const config = agent.config;
    const targetNiches = config.target_niches || ['Product Reviews', 'Renewable Energy', 'Sustainable Living', 'Zero Waste'];
    const articlesPerDay = config.articles_per_day || 3;

    console.log(`Agent found. Target: ${articlesPerDay} articles across niches: ${targetNiches.join(', ')}`);

    const generationResults = [];

    // Generate one article at a time to avoid timeouts
    for (let i = 0; i < articlesPerDay; i++) {
      try {
        // Select a random niche for each article
        const selectedNiche = targetNiches[Math.floor(Math.random() * targetNiches.length)];

        console.log(`Generating article ${i + 1}/${articlesPerDay} for niche: ${selectedNiche}`);

        // Call the content creation agent directly (more reliable than orchestrator chain)
        const generationResponse = await fetch(`${supabaseUrl}/functions/v1/content-creation-agent`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            action: 'generate',
            niche: selectedNiche,
            contentType: 'article',
            approvalRequired: true
          })
        });

        const generationResult = await generationResponse.json();
        
        if (generationResult.success) {
          const contentId = generationResult.data.content_id;
          
          // Run SEO optimization on the generated content
          try {
            const seoResponse = await fetch(`${supabaseUrl}/functions/v1/seo-optimization-agent`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                contentId: contentId,
                action: 'optimize'
              })
            });
            
            const seoResult = await seoResponse.json();
            console.log(`SEO optimization ${seoResult.success ? 'completed' : 'failed'} for article ${contentId}`);
          } catch (seoError) {
            console.error(`SEO optimization failed for article ${contentId}:`, seoError.message);
          }

          generationResults.push({
            article_number: i + 1,
            niche: selectedNiche,
            content_id: contentId,
            title: generationResult.data.title,
            word_count: generationResult.data.word_count,
            status: 'success',
            timestamp: new Date().toISOString()
          });
          console.log(`Article ${i + 1} generated successfully: ${contentId}`);
        } else {
          const errorMessage = generationResult.error?.message || 'Unknown error';
          generationResults.push({
            article_number: i + 1,
            niche: selectedNiche,
            status: 'failed',
            error: errorMessage,
            timestamp: new Date().toISOString()
          });
          console.error(`Article ${i + 1} generation failed:`, errorMessage);
        }

      } catch (error) {
        console.error(`Error generating article ${i + 1}:`, error.message);
        generationResults.push({
          article_number: i + 1,
          niche: 'unknown',
          status: 'failed',
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }

    // Log the daily generation session
    const successCount = generationResults.filter(r => r.status === 'success').length;
    const failureCount = generationResults.filter(r => r.status === 'failed').length;

    try {
      await fetch(`${supabaseUrl}/rest/v1/agent_activities`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          agent_id: agent.id,
          activity_type: 'daily_content_generation',
          activity_data: {
            target_articles: articlesPerDay,
            generated_articles: successCount,
            failed_articles: failureCount,
            results: generationResults,
            execution_time_ms: Date.now() - startTime
          },
          activity_status: 'completed'
        })
      });
      console.log('Activity logged successfully');
    } catch (loggingError) {
      console.error('Failed to log daily generation activity:', loggingError.message);
    }

    // Update agent's last run time
    try {
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
      console.log('Agent last run time updated');
    } catch (updateError) {
      console.error('Failed to update agent last run time:', updateError.message);
    }

    const executionTime = Date.now() - startTime;
    console.log(`Daily content generation completed in ${executionTime}ms. Success: ${successCount}, Failed: ${failureCount}`);

    return new Response(JSON.stringify({
      success: true,
      data: {
        daily_generation_completed: true,
        target_articles: articlesPerDay,
        successful_generations: successCount,
        failed_generations: failureCount,
        generation_results: generationResults,
        execution_time_ms: executionTime,
        completion_timestamp: new Date().toISOString()
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    const executionTime = Date.now() - startTime;
    console.error('Daily Content Generator error:', error.message);
    console.error('Stack trace:', error.stack);
    
    const errorResponse = {
      error: {
        code: 'DAILY_CONTENT_GENERATION_FAILED',
        message: error.message,
        execution_time_ms: executionTime,
        timestamp: new Date().toISOString()
      }
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
