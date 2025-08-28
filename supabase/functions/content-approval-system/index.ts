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
    const action = url.searchParams.get('action') || 'list';

    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Supabase configuration missing');
    }

    // Get user from auth header if available
    let userId = null;
    const authHeader = req.headers.get('authorization');
    if (authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '');
        const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'apikey': serviceRoleKey
          }
        });
        if (userResponse.ok) {
          const userData = await userResponse.json();
          userId = userData.id;
        }
      } catch (error) {
        console.log('Could not get user from token:', error.message);
      }
    }

    switch (action) {
      case 'list':
        // Get all pending approvals with content details
        const pendingResponse = await fetch(
          `${supabaseUrl}/rest/v1/content_approval_workflow?status=eq.pending_approval&select=*`,
          {
            headers: {
              'Authorization': `Bearer ${serviceRoleKey}`,
              'apikey': serviceRoleKey
            }
          }
        );

        const pendingApprovals = await pendingResponse.json();

        // Get content details for each approval
        const approvalsWithContent = await Promise.all(
          pendingApprovals.map(async (approval) => {
            const contentResponse = await fetch(
              `${supabaseUrl}/rest/v1/content_items?id=eq.${approval.content_item_id}`,
              {
                headers: {
                  'Authorization': `Bearer ${serviceRoleKey}`,
                  'apikey': serviceRoleKey
                }
              }
            );
            const contentItems = await contentResponse.json();
            const contentItem = contentItems[0] || {};

            return {
              ...approval,
              content: {
                id: contentItem.id,
                title: contentItem.title,
                content_type: contentItem.content_type,
                status: contentItem.status,
                author: contentItem.author,
                created_at: contentItem.created_at,
                word_count: contentItem.engagement_metrics?.word_count || 0,
                target_niche: contentItem.seo_data?.target_niche || 'unknown'
              }
            };
          })
        );

        return new Response(JSON.stringify({
          success: true,
          data: approvalsWithContent
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'approve':
        const approveBody = await req.json();
        const { workflowId, reviewNotes = '' } = approveBody;

        if (!workflowId) {
          throw new Error('Workflow ID is required for approval');
        }

        // Get the workflow item
        const workflowResponse = await fetch(
          `${supabaseUrl}/rest/v1/content_approval_workflow?id=eq.${workflowId}`,
          {
            headers: {
              'Authorization': `Bearer ${serviceRoleKey}`,
              'apikey': serviceRoleKey
            }
          }
        );

        const workflows = await workflowResponse.json();
        if (!workflows.length) {
          throw new Error('Workflow item not found');
        }

        const workflow = workflows[0];

        // Update workflow status to approved
        await fetch(`${supabaseUrl}/rest/v1/content_approval_workflow?id=eq.${workflowId}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status: 'approved',
            approved_by: userId,
            approved_at: new Date().toISOString(),
            review_notes: reviewNotes,
            actual_completion: new Date().toISOString()
          })
        });

        // Update content item status to published (not just approved)
        await fetch(`${supabaseUrl}/rest/v1/content_items?id=eq.${workflow.content_item_id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status: 'published',
            published_at: new Date().toISOString()
          })
        });

        return new Response(JSON.stringify({
          success: true,
          data: {
            workflow_id: workflowId,
            content_id: workflow.content_item_id,
            status: 'approved',
            content_status: 'published',
            approved_at: new Date().toISOString()
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'reject':
        const rejectBody = await req.json();
        const { workflowId: rejectWorkflowId, rejectionReason = '' } = rejectBody;

        if (!rejectWorkflowId) {
          throw new Error('Workflow ID is required for rejection');
        }

        // Get the workflow item
        const rejectWorkflowResponse = await fetch(
          `${supabaseUrl}/rest/v1/content_approval_workflow?id=eq.${rejectWorkflowId}`,
          {
            headers: {
              'Authorization': `Bearer ${serviceRoleKey}`,
              'apikey': serviceRoleKey
            }
          }
        );

        const rejectWorkflows = await rejectWorkflowResponse.json();
        if (!rejectWorkflows.length) {
          throw new Error('Workflow item not found');
        }

        const rejectWorkflow = rejectWorkflows[0];

        // Update workflow status to rejected
        await fetch(`${supabaseUrl}/rest/v1/content_approval_workflow?id=eq.${rejectWorkflowId}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status: 'rejected',
            approved_by: userId,
            approved_at: new Date().toISOString(),
            rejection_reason: rejectionReason,
            actual_completion: new Date().toISOString()
          })
        });

        // Update content item status to rejected
        await fetch(`${supabaseUrl}/rest/v1/content_items?id=eq.${rejectWorkflow.content_item_id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status: 'rejected'
          })
        });

        return new Response(JSON.stringify({
          success: true,
          data: {
            workflow_id: rejectWorkflowId,
            content_id: rejectWorkflow.content_item_id,
            status: 'rejected',
            rejection_reason: rejectionReason,
            rejected_at: new Date().toISOString()
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      default:
        throw new Error(`Invalid action: ${action}`);
    }

  } catch (error) {
    console.error('Content Approval System error:', error);
    
    const errorResponse = {
      error: {
        code: 'APPROVAL_SYSTEM_ERROR',
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