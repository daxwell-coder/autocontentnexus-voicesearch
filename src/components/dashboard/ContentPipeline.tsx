import React, { useState, useEffect, useCallback } from 'react';
import { FileText, Clock, CheckCircle, AlertCircle, XCircle, Play, Pause, MoreHorizontal, RefreshCw, Wifi, WifiOff, Eye, ThumbsUp, ThumbsDown, ExternalLink } from 'lucide-react';
import { contentService, ContentItem, PipelineStats, ContentAgentStatus, ServiceError } from '../../services/contentService';
import {
  SkeletonChart,
  LoadingSpinner,
  ErrorState,
  ConnectionStatus
} from '../ui/LoadingComponents';
import ArticleViewModal from './approval/ArticleViewModal';

// Pending approval item interface
interface PendingApproval {
  id: string;
  content_item_id: number;
  workflow_stage: string;
  status: string;
  priority_level: string;
  created_at: string;
  content: {
    id: number;
    title: string;
    content_type: string;
    status: string;
    author: string;
    created_at: string;
    word_count: number;
    target_niche: string;
  };
}

// Component state interface
interface ContentPipelineState {
  stats: PipelineStats | null;
  items: ContentItem[];
  pendingApprovals: PendingApproval[];
  agentStatus: ContentAgentStatus | null;
  loading: boolean;
  error: ServiceError | null;
  refreshing: boolean;
  connectivity: { database: boolean; agent: boolean };
  lastRefresh: Date | null;
  showApprovalModal: boolean;
  processingAction: string | null; // workflow ID being processed
  showArticleModal: boolean;
  currentArticle: any | null;
  loadingArticle: boolean;
}

export function ContentPipeline() {
  const [state, setState] = useState<ContentPipelineState>({
    stats: null,
    items: [],
    pendingApprovals: [],
    agentStatus: null,
    loading: true,
    error: null,
    refreshing: false,
    connectivity: { database: false, agent: false },
    lastRefresh: null,
    showApprovalModal: false,
    processingAction: null,
    showArticleModal: false,
    currentArticle: null,
    loadingArticle: false
  });

  // Auto-refresh interval (5 minutes)
  const AUTO_REFRESH_INTERVAL = 5 * 60 * 1000;

  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  // Load pipeline data
  const loadPipelineData = useCallback(async (isRefresh: boolean = false) => {
    try {
      if (isRefresh) {
        setState(prev => ({ ...prev, refreshing: true }));
      } else {
        setState(prev => ({ ...prev, loading: true, error: null }));
      }

      // Test connectivity first
      const connectivity = await contentService.testConnectivity();
      
      // Fetch pipeline data and pending approvals concurrently
      const [pipelineResponse, approvalsResponse] = await Promise.all([
        contentService.getPipelineData(),
        contentService.getPendingApprovals()
      ]);
      
      if (pipelineResponse.success) {
        const pendingApprovals = approvalsResponse.success ? approvalsResponse.data || [] : [];
        
        setState(prev => ({
          ...prev,
          stats: pipelineResponse.data!.stats,
          items: pipelineResponse.data!.items,
          pendingApprovals: pendingApprovals,
          agentStatus: {
            agent_id: 'content-creation-agent',
            status: 'active',
            last_activity: new Date().toISOString(),
            uptime: '95%',
            tasks_completed: pendingApprovals.length,
            errors: 0,
            capabilities: ['Content Generation', 'SEO Optimization', 'Manual Approval']
          },
          loading: false,
          refreshing: false,
          error: null,
          connectivity,
          lastRefresh: new Date()
        }));
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          refreshing: false,
          error: pipelineResponse.error || {
            code: 'UNKNOWN_ERROR',
            message: 'Failed to load pipeline data',
            timestamp: new Date().toISOString()
          },
          connectivity
        }));
      }
    } catch (error: any) {
      console.error('Failed to load pipeline data:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        refreshing: false,
        error: {
          code: 'LOAD_ERROR',
          message: error.message || 'Unexpected error occurred',
          timestamp: new Date().toISOString()
        }
      }));
    }
  }, []);

  // Handle refresh button click
  const handleRefresh = useCallback(() => {
    if (!state.refreshing) {
      loadPipelineData(true);
    }
  }, [loadPipelineData, state.refreshing]);

  // Handle error retry
  const handleRetry = useCallback(() => {
    loadPipelineData(false);
  }, [loadPipelineData]);

  // Handle opening approval modal
  const handleOpenApprovalModal = useCallback(() => {
    setState(prev => ({ ...prev, showApprovalModal: true }));
  }, []);

  // Handle closing approval modal
  const handleCloseApprovalModal = useCallback(() => {
    setState(prev => ({ ...prev, showApprovalModal: false }));
  }, []);

  // Handle approve content
  const handleApproveContent = useCallback(async (workflowId: string, reviewNotes?: string) => {
    try {
      setState(prev => ({ ...prev, processingAction: workflowId }));
      
      const response = await contentService.approveContent(workflowId, reviewNotes);
      
      if (response.success) {
        // Immediately remove approved item from pending list
        setState(prev => ({
          ...prev,
          pendingApprovals: prev.pendingApprovals.filter(item => item.id !== workflowId),
          processingAction: null,
          // Update stats to reflect the approval
          stats: prev.stats ? {
            ...prev.stats,
            completed: prev.stats.completed + 1,
            total: prev.stats.total
          } : prev.stats
        }));
        
        // Refresh pipeline data to get the latest counts from database
        setTimeout(() => {
          loadPipelineData(true);
        }, 500);
        
        console.log('Content approved and published successfully');
      } else {
        setState(prev => ({ ...prev, processingAction: null }));
        console.error('Failed to approve content:', response.error?.message);
        // You could add a toast notification here for user feedback
      }
    } catch (error: any) {
      setState(prev => ({ ...prev, processingAction: null }));
      console.error('Error approving content:', error);
      // You could add a toast notification here for user feedback
    }
  }, [loadPipelineData]);

  // Handle reject content
  const handleRejectContent = useCallback(async (workflowId: string, rejectionReason: string) => {
    try {
      setState(prev => ({ ...prev, processingAction: workflowId }));
      
      const response = await contentService.rejectContent(workflowId, rejectionReason);
      
      if (response.success) {
        // Immediately remove rejected item from pending list
        setState(prev => ({
          ...prev,
          pendingApprovals: prev.pendingApprovals.filter(item => item.id !== workflowId),
          processingAction: null,
          // Update stats to reflect the rejection
          stats: prev.stats ? {
            ...prev.stats,
            failed: prev.stats.failed + 1,
            total: prev.stats.total
          } : prev.stats
        }));
        
        // Refresh pipeline data to get the latest counts from database
        setTimeout(() => {
          loadPipelineData(true);
        }, 500);
        
        console.log('Content rejected successfully');
      } else {
        setState(prev => ({ ...prev, processingAction: null }));
        console.error('Failed to reject content:', response.error?.message);
        // You could add a toast notification here for user feedback
      }
    } catch (error: any) {
      setState(prev => ({ ...prev, processingAction: null }));
      console.error('Error rejecting content:', error);
      // You could add a toast notification here for user feedback
    }
  }, [loadPipelineData]);

  // Handle view article
  const handleViewArticle = useCallback(async (articleId: number) => {
    try {
      setState(prev => ({ ...prev, showArticleModal: true, loadingArticle: true, currentArticle: null }));
      
      const response = await contentService.getArticleContent(articleId);
      
      if (response.success) {
        setState(prev => ({
          ...prev,
          currentArticle: response.data,
          loadingArticle: false
        }));
      } else {
        setState(prev => ({
          ...prev,
          loadingArticle: false,
          currentArticle: null
        }));
        console.error('Failed to fetch article content:', response.error?.message);
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loadingArticle: false,
        currentArticle: null
      }));
      console.error('Error fetching article content:', error);
    }
  }, []);

  // Handle close article modal
  const handleCloseArticleModal = useCallback(() => {
    setState(prev => ({
      ...prev,
      showArticleModal: false,
      currentArticle: null,
      loadingArticle: false
    }));
  }, []);

  // Initial load and auto-refresh setup
  useEffect(() => {
    loadPipelineData(false);

    // Set up auto-refresh interval
    const intervalId = setInterval(() => {
      loadPipelineData(true);
    }, AUTO_REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
  }, [loadPipelineData, AUTO_REFRESH_INTERVAL]);

  const getStatusIcon = (status: ContentItem['status']) => {
    switch (status) {
      case 'queued':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'processing':
        return <Play className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'paused':
        return <Pause className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: ContentItem['status']) => {
    switch (status) {
      case 'queued':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'paused':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: ContentItem['type']) => {
    switch (type) {
      case 'article':
        return 'bg-purple-100 text-purple-800';
      case 'review':
        return 'bg-blue-100 text-blue-800';
      case 'guide':
        return 'bg-green-100 text-green-800';
      case 'video':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateHealthScore = (stats: PipelineStats | null) => {
    if (!stats) return 0;
    const totalItems = stats.queued + stats.processing + stats.completed;
    if (totalItems === 0) return 100;
    
    const successRate = (stats.completed / totalItems) * 100;
    const failureRate = (stats.failed / totalItems) * 100;
    return Math.max(0, Math.min(100, successRate - failureRate * 2));
  };

  // Loading state - show skeleton UI
  if (state.loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Content Pipeline
              </h3>
              <p className="text-sm text-gray-600 mt-1">Loading content workflow status...</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 rounded-lg">
              <LoadingSpinner size="sm" />
              Loading...
            </div>
          </div>
        </div>

        <div className="p-6">
          <SkeletonChart />
        </div>
      </div>
    );
  }

  // Error state
  if (state.error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-red-600" />
                Content Pipeline
              </h3>
              <p className="text-sm text-red-600 mt-1">Unable to load pipeline data</p>
            </div>
            <ConnectionStatus 
              dashboard={state.connectivity.database} 
              finance={state.connectivity.agent}
            />
          </div>
        </div>

        <div className="p-6">
          <ErrorState 
            error={state.error} 
            onRetry={handleRetry}
            retrying={state.loading}
          />
        </div>
      </div>
    );
  }

  // Success state with live data
  const { stats, items, agentStatus, pendingApprovals } = state;
  const healthScore = calculateHealthScore(stats);

  // Approval Modal Component
  const ApprovalModal = () => {
    if (!state.showApprovalModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Pending Content Approvals ({pendingApprovals.length})
              </h2>
              <button
                onClick={handleCloseApprovalModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6">
            {pendingApprovals.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Approvals</h3>
                <p className="text-gray-500">All content has been reviewed and processed.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {pendingApprovals.map((approval) => (
                  <div key={approval.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {approval.content.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <span className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            {approval.content.content_type}
                          </span>
                          <span>{approval.content.word_count} words</span>
                          <span>{approval.content.target_niche}</span>
                          <span>{approval.content.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                            {approval.status.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {approval.priority_level}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          Created: {new Date(approval.created_at).toLocaleString()}
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleViewArticle(approval.content.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                            View Article
                          </button>
                          <button
                            onClick={() => handleRejectContent(approval.id, 'Content rejected by user')}
                            disabled={state.processingAction === approval.id}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {state.processingAction === approval.id ? (
                              <LoadingSpinner size="sm" />
                            ) : (
                              <ThumbsDown className="h-4 w-4" />
                            )}
                            Reject
                          </button>
                          <button
                            onClick={() => handleApproveContent(approval.id, 'Content approved by user')}
                            disabled={state.processingAction === approval.id}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {state.processingAction === approval.id ? (
                              <LoadingSpinner size="sm" />
                            ) : (
                              <ThumbsUp className="h-4 w-4" />
                            )}
                            Approve
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <ApprovalModal />
      <ArticleViewModal
        isOpen={state.showArticleModal}
        onClose={handleCloseArticleModal}
        article={state.currentArticle}
        isLoading={state.loadingArticle}
      />
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Content Pipeline
                </h3>
                {state.connectivity.database && state.connectivity.agent ? (
                  <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                    <Wifi className="h-3 w-3" />
                    Live
                  </div>
                ) : (
                  <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                    <WifiOff className="h-3 w-3" />
                    Limited
                  </div>
                )}
                {pendingApprovals.length > 0 && (
                  <button 
                    onClick={handleOpenApprovalModal}
                    className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium hover:bg-red-200 transition-colors cursor-pointer"
                    title="Click to review pending approvals"
                  >
                    <AlertCircle className="h-3 w-3" />
                    {pendingApprovals.length} Pending
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Content creation workflow status {agentStatus && `• Agent: ${agentStatus.status}`}
                </p>
                {state.lastRefresh && (
                  <p className="text-xs text-gray-500">
                    Updated {formatRelativeTime(state.lastRefresh)}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <ConnectionStatus 
                dashboard={state.connectivity.database} 
                finance={state.connectivity.agent}
                className="mr-2"
              />
              <button 
                onClick={handleRefresh}
                disabled={state.refreshing}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {state.refreshing ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Refreshing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </>
                )}
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreHorizontal className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

      <div className="p-6">
        {/* Pipeline Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 relative">
          {state.refreshing && (
            <div className="absolute top-2 right-2 z-10">
              <LoadingSpinner size="sm" />
            </div>
          )}
          <button 
            onClick={pendingApprovals.length > 0 ? handleOpenApprovalModal : undefined}
            className={`text-center p-3 rounded-lg border transition-all ${
              pendingApprovals.length > 0 
                ? 'hover:bg-gray-50 cursor-pointer border-gray-200 hover:border-gray-300 hover:shadow-sm' 
                : 'border-transparent'
            }`}
            title={pendingApprovals.length > 0 ? 'Click to review pending approvals' : ''}
            disabled={pendingApprovals.length === 0}
          >
            <p className="text-2xl font-bold text-gray-900">{stats?.total || 0}</p>
            <p className="text-xs text-gray-600 uppercase tracking-wider">Total Created</p>
            {pendingApprovals.length > 0 && (
              <p className="text-xs text-red-600 mt-1 font-medium">{pendingApprovals.length} pending approval</p>
            )}
          </button>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{stats?.queued || 0}</p>
            <p className="text-xs text-gray-600 uppercase tracking-wider">Queued</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{stats?.processing || 0}</p>
            <p className="text-xs text-gray-600 uppercase tracking-wider">Processing</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{stats?.completed || 0}</p>
            <p className="text-xs text-gray-600 uppercase tracking-wider">Completed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{stats?.failed || 0}</p>
            <p className="text-xs text-gray-600 uppercase tracking-wider">Failed</p>
          </div>
        </div>

        {/* Pipeline Health */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 relative">
          {state.refreshing && (
            <div className="absolute top-2 right-2">
              <LoadingSpinner size="sm" />
            </div>
          )}
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-900">Pipeline Health</h4>
            <span className={`text-sm font-medium ${
              healthScore >= 80 ? 'text-green-600' : 
              healthScore >= 60 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {healthScore.toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${
                healthScore >= 80 ? 'bg-green-500' : 
                healthScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${healthScore}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            {healthScore >= 80 ? 'Excellent performance' : 
             healthScore >= 60 ? 'Good performance, monitor failed items' : 
             'Attention needed, high failure rate'}
          </p>
          {agentStatus && (
            <p className="text-xs text-gray-500 mt-1">
              Agent status: {agentStatus.status} • {agentStatus.tasks_completed} tasks completed • {agentStatus.errors} errors
            </p>
          )}
        </div>

        {/* Recent Pipeline Items */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-4">
            Recent Pipeline Activity ({items.length} items)
          </h4>
          <div className="space-y-3">
            {items.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-sm">No content items found</p>
                <p className="text-xs text-gray-400">Content will appear here as it's created</p>
              </div>
            ) : (
              items.slice(0, 10).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3 flex-1">
                    {getStatusIcon(item.status)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="text-sm font-medium text-gray-900 truncate">{item.title}</h5>
                        <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(item.type)}`}>
                          {item.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <span>{item.category}</span>
                        <span>{item.estimatedCompletion}</span>
                        {item.word_count && <span>{item.word_count} words</span>}
                      </div>
                      {item.progress && (
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${item.progress}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs border rounded-full ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pipeline Controls */}
        <div className="mt-6 flex justify-center space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
            Add Content
          </button>
          <button 
            onClick={handleOpenApprovalModal}
            className={`px-4 py-2 rounded-lg transition-colors text-sm flex items-center gap-2 ${
              pendingApprovals.length > 0
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Eye className="h-4 w-4" />
            {pendingApprovals.length > 0 
              ? `Review Queue (${pendingApprovals.length})` 
              : 'View Queue'
            }
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm">
            Settings
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
