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
    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'execute';

    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Supabase configuration missing');
    }

    switch (action) {
      case 'generate_content':
        // Orchestrate content generation workflow
        const { niche, contentType = 'article', runSeoOptimization = true } = await req.json();

        // Step 1: Create content using Content Creation Agent
        const contentCreationResponse = await fetch(`${supabaseUrl}/functions/v1/content-creation-agent`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            niche,
            contentType,
            approvalRequired: true
          })
        });

        const contentResult = await contentCreationResponse.json();
        
        if (!contentResult.success) {
          throw new Error(`Content creation failed: ${contentResult.error?.message}`);
        }

        const contentId = contentResult.data.content_id;

        // Step 2: Run SEO optimization if requested
        let seoResult = null;
        if (runSeoOptimization) {
          const seoResponse = await fetch(`${supabaseUrl}/functions/v1/seo-optimization-agent`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${serviceRoleKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              contentId,
              action: 'optimize'
            })
          });

          seoResult = await seoResponse.json();
        }

        // Add task to queue for tracking
        const taskResponse = await fetch(`${supabaseUrl}/rest/v1/agent_task_queue`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({
            agent_id: 7, // Agent Orchestrator ID
            task_type: 'content_generation_workflow',
            task_payload: {
              content_id: contentId,
              niche,
              content_type: contentType,
              seo_optimized: runSeoOptimization,
              workflow_steps: ['content_creation', 'seo_optimization', 'approval_pending']
            },
            status: 'completed',
            started_at: new Date().toISOString(),
            completed_at: new Date().toISOString()
          })
        });

        const task = await taskResponse.json();

        return new Response(JSON.stringify({
          success: true,
          data: {
            content_id: contentId,
            content_details: contentResult.data,
            seo_optimization: seoResult?.success ? seoResult.data : null,
            task_id: task[0].id,
            workflow_status: 'completed',
            next_step: 'manual_approval_required'
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'status':
        // Get orchestrator system status
        const agentStatusResponse = await fetch(
          `${supabaseUrl}/rest/v1/agents?select=*`,
          {
            headers: {
              'Authorization': `Bearer ${serviceRoleKey}`,
              'apikey': serviceRoleKey
            }
          }
        );

        const agents = await agentStatusResponse.json();

        // Get pending tasks
        const taskQueueResponse = await fetch(
          `${supabaseUrl}/rest/v1/agent_task_queue?status=neq.completed&select=*`,
          {
            headers: {
              'Authorization': `Bearer ${serviceRoleKey}`,
              'apikey': serviceRoleKey
            }
          }
        );

        const pendingTasks = await taskQueueResponse.json();

        // Get recent content generation sessions
        const sessionsResponse = await fetch(
          `${supabaseUrl}/rest/v1/content_generation_sessions?select=*&order=created_at.desc&limit=5`,
          {
            headers: {
              'Authorization': `Bearer ${serviceRoleKey}`,
              'apikey': serviceRoleKey
            }
          }
        );

        const recentSessions = await sessionsResponse.json();

        const systemStatus = {
          total_agents: agents.length,
          active_agents: agents.filter(agent => agent.status === 'active').length,
          pending_tasks: pendingTasks.length,
          recent_generations: recentSessions.length,
          last_activity: new Date().toISOString(),
          system_health: 'operational'
        };

        return new Response(JSON.stringify({
          success: true,
          data: systemStatus
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'trigger_weekly_content':
        // Trigger weekly content generation as per configuration
        const contentAgentResponse = await fetch(
          `${supabaseUrl}/rest/v1/agents?name=eq.Content Creation Agent`,
          {
            headers: {
              'Authorization': `Bearer ${serviceRoleKey}`,
              'apikey': serviceRoleKey
            }
          }
        );

        const contentAgents = await contentAgentResponse.json();
        if (!contentAgents.length) {
          throw new Error('Content Creation Agent not found');
        }

        const contentAgent = contentAgents[0];
        const config = contentAgent.config;
        const targetNiches = config.target_niches || [];
        
        if (targetNiches.length === 0) {
          throw new Error('No target niches configured');
        }

        // Select random niche for weekly content
        const selectedNiche = targetNiches[Math.floor(Math.random() * targetNiches.length)];

        // Trigger content generation
        const weeklyContentResponse = await fetch(`${supabaseUrl}/functions/v1/agent-task-orchestrator?action=generate_content`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            niche: selectedNiche,
            contentType: 'article',
            runSeoOptimization: true
          })
        });

        const weeklyResult = await weeklyContentResponse.json();

        return new Response(JSON.stringify({
          success: true,
          data: {
            message: 'Weekly content generation triggered',
            selected_niche: selectedNiche,
            generation_result: weeklyResult.data
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      default:
        throw new Error(`Invalid action: ${action}`);
    }

  } catch (error) {
    console.error('Agent Task Orchestrator error:', error);
    
    const errorResponse = {
      error: {
        code: 'ORCHESTRATOR_ERROR',
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