import React, { useState, useEffect, useCallback } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Calendar, RefreshCw, ExternalLink, Wifi, WifiOff } from 'lucide-react';
import { revenueService, RevenueMetrics, ServiceError } from '../../services/revenueService';
import {
  SkeletonMetricsGrid,
  SkeletonPerformanceGrid,
  SkeletonChart,
  LoadingSpinner,
  ErrorState,
  ConnectionStatus
} from '../ui/LoadingComponents';

// Component state interface
interface DashboardState {
  metrics: RevenueMetrics | null;
  loading: boolean;
  error: ServiceError | null;
  refreshing: boolean;
  connectivity: { dashboard: boolean; finance: boolean };
  lastRefresh: Date | null;
}

export function UnifiedRevenueDashboard() {
  const [state, setState] = useState<DashboardState>({
    metrics: null,
    loading: true,
    error: null,
    refreshing: false,
    connectivity: { dashboard: false, finance: false },
    lastRefresh: null
  });

  // Auto-refresh interval (5 minutes)
  const AUTO_REFRESH_INTERVAL = 5 * 60 * 1000;

  const formatCurrency = (amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatPercentage = (value: number): string => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

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

  const getTrendIcon = (change: number) => {
    return change >= 0 ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    );
  };

  const getTrendColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  // Load revenue data
  const loadRevenueData = useCallback(async (isRefresh: boolean = false) => {
    try {
      if (isRefresh) {
        setState(prev => ({ ...prev, refreshing: true }));
      } else {
        setState(prev => ({ ...prev, loading: true, error: null }));
      }

      // Test connectivity first
      const connectivity = await revenueService.testConnectivity();
      
      // Fetch revenue metrics
      const response = await revenueService.getRevenueMetrics();
      
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          metrics: response.data!,
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
            message: 'Failed to load revenue data',
            timestamp: new Date().toISOString()
          },
          connectivity
        }));
      }
    } catch (error: any) {
      console.error('Failed to load revenue data:', error);
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
      loadRevenueData(true);
    }
  }, [loadRevenueData, state.refreshing]);

  // Handle error retry
  const handleRetry = useCallback(() => {
    loadRevenueData(false);
  }, [loadRevenueData]);

  // Initial load and auto-refresh setup
  useEffect(() => {
    loadRevenueData(false);

    // Set up auto-refresh interval
    const intervalId = setInterval(() => {
      loadRevenueData(true);
    }, AUTO_REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
  }, [loadRevenueData, AUTO_REFRESH_INTERVAL]);

  // Loading state - show skeleton UI
  if (state.loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Revenue Dashboard
              </h3>
              <p className="text-sm text-gray-600 mt-1">Loading live commission and earnings data...</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 rounded-lg">
                <LoadingSpinner size="sm" />
                Loading...
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          <SkeletonMetricsGrid />
          <SkeletonPerformanceGrid />
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
                <DollarSign className="h-5 w-5 text-red-600" />
                Revenue Dashboard
              </h3>
              <p className="text-sm text-red-600 mt-1">Unable to load revenue data</p>
            </div>
            <ConnectionStatus 
              dashboard={state.connectivity.dashboard} 
              finance={state.connectivity.finance}
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
  const { metrics } = state;
  if (!metrics) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Revenue Dashboard
              </h3>
              {state.connectivity.dashboard && state.connectivity.finance ? (
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
                {metrics.dataSource} • Currency: {metrics.currency}
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
              dashboard={state.connectivity.dashboard} 
              finance={state.connectivity.finance}
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
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-50 transition-colors">
              <ExternalLink className="h-4 w-4" />
              View Report
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Main Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Today's Revenue */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200 relative">
            {state.refreshing && (
              <div className="absolute top-2 right-2">
                <LoadingSpinner size="sm" />
              </div>
            )}
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-blue-900">Today's Revenue</p>
              {getTrendIcon(metrics.todayChange)}
            </div>
            <p className="text-2xl font-bold text-blue-900">{formatCurrency(metrics.today, metrics.currency)}</p>
            <p className={`text-sm mt-1 ${getTrendColor(metrics.todayChange)}`}>
              {formatPercentage(metrics.todayChange)} vs yesterday
            </p>
          </div>

          {/* Weekly Revenue */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200 relative">
            {state.refreshing && (
              <div className="absolute top-2 right-2">
                <LoadingSpinner size="sm" />
              </div>
            )}
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-green-900">This Week</p>
              {getTrendIcon(metrics.weekChange)}
            </div>
            <p className="text-2xl font-bold text-green-900">{formatCurrency(metrics.week, metrics.currency)}</p>
            <p className={`text-sm mt-1 ${getTrendColor(metrics.weekChange)}`}>
              {formatPercentage(metrics.weekChange)} vs last week
            </p>
          </div>

          {/* Monthly Revenue */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200 relative">
            {state.refreshing && (
              <div className="absolute top-2 right-2">
                <LoadingSpinner size="sm" />
              </div>
            )}
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-purple-900">This Month</p>
              {getTrendIcon(metrics.monthChange)}
            </div>
            <p className="text-2xl font-bold text-purple-900">{formatCurrency(metrics.month, metrics.currency)}</p>
            <p className={`text-sm mt-1 ${getTrendColor(metrics.monthChange)}`}>
              {formatPercentage(metrics.monthChange)} vs last month
            </p>
          </div>

          {/* Total Revenue */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200 relative">
            {state.refreshing && (
              <div className="absolute top-2 right-2">
                <LoadingSpinner size="sm" />
              </div>
            )}
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-900">Total Revenue</p>
              <Calendar className="h-4 w-4 text-gray-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.total, metrics.currency)}</p>
            <p className="text-sm text-gray-600 mt-1">
              {metrics.transactionCount} transactions • All-time earnings
            </p>
          </div>
        </div>

        {/* Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Conversion Rate</h4>
            <div className="flex items-center">
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${(metrics.conversionRate / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
              <span className="ml-3 text-sm font-medium text-gray-900">
                {metrics.conversionRate.toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Top Performing Category</h4>
            <p className="text-lg font-semibold text-green-600">AWIN Affiliate Network</p>
            <p className="text-sm text-gray-600">{formatCurrency(metrics.month * 0.8, metrics.currency)} this month</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Active Revenue Streams</h4>
            <p className="text-lg font-semibold text-blue-600">AWIN + PayPal</p>
            <p className="text-sm text-gray-600">{metrics.transactionCount} transactions</p>
          </div>
        </div>

        {/* Revenue Chart Placeholder */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center relative">
          {state.refreshing && (
            <div className="absolute top-4 right-4">
              <LoadingSpinner size="md" />
            </div>
          )}
          <div className="mb-4">
            <TrendingUp className="h-12 w-12 text-green-500 mx-auto" />
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">Live Revenue Analytics</h4>
          <p className="text-gray-600 mb-2">Connected to {metrics.dataSource}</p>
          <p className="text-sm text-gray-500 mb-4">Last updated: {new Date(metrics.lastUpdated).toLocaleString()}</p>
          <div className="flex justify-center space-x-4">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Last 7 Days
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
              Last 30 Days
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
              Last 90 Days
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}