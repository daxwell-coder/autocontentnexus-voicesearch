import React, { useState, useEffect, useCallback } from 'react';
import { Users, Activity, AlertCircle, CheckCircle, DollarSign, TrendingUp, Eye, Settings, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { agentService, AffiliatAgent, AgentMetrics, AgentSystemStatus, ServiceError } from '../../services/agentService';
import {
  SkeletonChart,
  LoadingSpinner,
  ErrorState,
  ConnectionStatus
} from '../ui/LoadingComponents';

// Component state interface
interface AgentMonitorState {
  agents: AffiliatAgent[];
  metrics: AgentMetrics | null;
  systemStatus: AgentSystemStatus | null;
  loading: boolean;
  error: ServiceError | null;
  refreshing: boolean;
  connectivity: { orchestrator: boolean; dashboard: boolean };
  lastRefresh: Date | null;
}

export function AffiliateAgentMonitor() {
  const [state, setState] = useState<AgentMonitorState>({
    agents: [],
    metrics: null,
    systemStatus: null,
    loading: true,
    error: null,
    refreshing: false,
    connectivity: { orchestrator: false, dashboard: false },
    lastRefresh: null
  });

  // Auto-refresh interval (3 minutes - more frequent for agent monitoring)
  const AUTO_REFRESH_INTERVAL = 3 * 60 * 1000;

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

  // Load agent monitoring data
  const loadAgentData = useCallback(async (isRefresh: boolean = false) => {
    try {
      if (isRefresh) {
        setState(prev => ({ ...prev, refreshing: true }));
      } else {
        setState(prev => ({ ...prev, loading: true, error: null }));
      }

      // Test connectivity first
      const connectivity = await agentService.testConnectivity();
      
      // Fetch agent monitoring data
      const response = await agentService.getAgentMonitoringData();
      
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          agents: response.data!.agents,
          metrics: response.data!.metrics,
          systemStatus: response.data!.systemStatus,
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
          error: response.error || {
            code: 'UNKNOWN_ERROR',
            message: 'Failed to load agent monitoring data',
            timestamp: new Date().toISOString()
          },
          connectivity
        }));
      }
    } catch (error: any) {
      console.error('Failed to load agent monitoring data:', error);
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
      loadAgentData(true);
    }
  }, [loadAgentData, state.refreshing]);

  // Handle error retry
  const handleRetry = useCallback(() => {
    loadAgentData(false);
  }, [loadAgentData]);

  // Initial load and auto-refresh setup
  useEffect(() => {
    loadAgentData(false);

    // Set up auto-refresh interval
    const intervalId = setInterval(() => {
      loadAgentData(true);
    }, AUTO_REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
  }, [loadAgentData, AUTO_REFRESH_INTERVAL]);

  const getStatusIcon = (status: AffiliatAgent['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'inactive':
        return <Activity className="h-4 w-4 text-gray-400" />;
      default:
        return <Activity className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: AffiliatAgent['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return 'text-green-600';
    if (performance >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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
                <Users className="h-5 w-5 text-purple-600" />
                Affiliate Agent Monitor
              </h3>
              <p className="text-sm text-gray-600 mt-1">Loading real-time agent performance data...</p>
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
                <Users className="h-5 w-5 text-red-600" />
                Affiliate Agent Monitor
              </h3>
              <p className="text-sm text-red-600 mt-1">Unable to load agent monitoring data</p>
            </div>
            <ConnectionStatus 
              dashboard={state.connectivity.orchestrator} 
              finance={state.connectivity.dashboard}
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
  const { agents, metrics, systemStatus } = state;
  const warningAgents = agents.filter(agent => agent.status === 'warning' || agent.status === 'error');

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                Affiliate Agent Monitor
              </h3>
              {state.connectivity.orchestrator && state.connectivity.dashboard ? (
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
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Real-time agent performance tracking {systemStatus && `• System: ${systemStatus.system_health}`}
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
              dashboard={state.connectivity.orchestrator} 
              finance={state.connectivity.dashboard}
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
              <Settings className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 relative">
          {state.refreshing && (
            <div className="absolute top-2 right-2 z-10">
              <LoadingSpinner size="sm" />
            </div>
          )}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="text-xs text-blue-600 font-medium">TOTAL</span>
            </div>
            <p className="text-xl font-bold text-blue-900">{metrics?.totalAgents || 0}</p>
            <p className="text-xs text-blue-700">Active: {metrics?.activeAgents || 0}</p>
          </div>

          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="text-xs text-green-600 font-medium">REVENUE</span>
            </div>
            <p className="text-xl font-bold text-green-900">{formatCurrency(metrics?.totalCommissions || 0)}</p>
            <p className="text-xs text-green-700">Total commissions</p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <span className="text-xs text-purple-600 font-medium">PERFORMANCE</span>
            </div>
            <p className="text-xl font-bold text-purple-900">{(metrics?.avgPerformance || 0).toFixed(1)}%</p>
            <p className="text-xs text-purple-700">Average score</p>
          </div>

          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center justify-between mb-2">
              <Activity className="h-5 w-5 text-orange-600" />
              <span className="text-xs text-orange-600 font-medium">CONVERSIONS</span>
            </div>
            <p className="text-xl font-bold text-orange-900">{metrics?.totalConversions || 0}</p>
            <p className="text-xs text-orange-700">This month</p>
          </div>
        </div>

        {/* Agents List */}
        <div className="space-y-3 mb-6">
          <h4 className="text-sm font-medium text-gray-900">Agent Performance ({agents.length} agents)</h4>
          {agents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-sm">No agents found</p>
              <p className="text-xs text-gray-400">Agents will appear here when they come online</p>
            </div>
          ) : (
            agents.map((agent) => (
              <div key={agent.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(agent.status)}
                    <div>
                      <h5 className="text-sm font-medium text-gray-900">{agent.name}</h5>
                      <p className="text-xs text-gray-600">Last active: {agent.lastActivity}</p>
                      {agent.capabilities && agent.capabilities.length > 0 && (
                        <p className="text-xs text-blue-600 mt-1">
                          Capabilities: {agent.capabilities.slice(0, 2).join(', ')}
                          {agent.capabilities.length > 2 && ` +${agent.capabilities.length - 2} more`}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs border rounded-full ${getStatusColor(agent.status)}`}>
                      {agent.status}
                    </span>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Eye className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Performance</p>
                    <p className={`text-sm font-semibold ${getPerformanceColor(agent.performance)}`}>
                      {agent.performance.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Commission</p>
                    <p className="text-sm font-semibold text-green-600">
                      {formatCurrency(agent.commission)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Conversions</p>
                    <p className="text-sm font-semibold text-blue-600">{agent.conversions}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Uptime</p>
                    <p className="text-sm font-semibold text-purple-600">{agent.uptime.toFixed(1)}%</p>
                  </div>
                </div>

                {/* Performance Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      agent.performance >= 90 ? 'bg-green-500' : 
                      agent.performance >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${agent.performance}%` }}
                  ></div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Agent Alerts */}
        {warningAgents.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
              <h4 className="text-sm font-medium text-yellow-900">Performance Alerts</h4>
            </div>
            <div className="space-y-2">
              {warningAgents.map((agent) => (
                <div key={agent.id} className="flex items-center justify-between text-sm">
                  <span className="text-yellow-800">
                    {agent.name} {agent.status === 'error' ? 'has errors' : 
                     agent.status === 'warning' ? 'performance below threshold' : 
                     agent.status === 'inactive' ? 'is offline' : 'needs attention'}
                  </span>
                  <button className="text-yellow-600 hover:text-yellow-800 font-medium">View Details</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* System Status */}
        {systemStatus && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">System Overview</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Tasks Completed</p>
                <p className="font-semibold text-gray-900">{systemStatus.total_tasks_completed}</p>
              </div>
              <div>
                <p className="text-gray-600">System Errors</p>
                <p className="font-semibold text-red-600">{systemStatus.total_errors}</p>
              </div>
              <div>
                <p className="text-gray-600">Average Uptime</p>
                <p className="font-semibold text-green-600">{systemStatus.average_uptime}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
            Add Agent
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm">
            View All Agents
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm">
            Configure Alerts
          </button>
        </div>
      </div>
    </div>
  );
}
