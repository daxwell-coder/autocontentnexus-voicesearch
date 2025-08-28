import React from 'react';

// Skeleton loading components for professional loading states
export const SkeletonCard: React.FC = () => (
  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200 animate-pulse">
    <div className="flex items-center justify-between mb-2">
      <div className="h-4 bg-gray-300 rounded w-24"></div>
      <div className="h-4 w-4 bg-gray-300 rounded"></div>
    </div>
    <div className="h-8 bg-gray-300 rounded w-32 mb-2"></div>
    <div className="h-3 bg-gray-300 rounded w-20"></div>
  </div>
);

export const SkeletonMetricsGrid: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <SkeletonCard />
    <SkeletonCard />
    <SkeletonCard />
    <SkeletonCard />
  </div>
);

export const SkeletonPerformanceCard: React.FC = () => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
    <div className="h-4 bg-gray-300 rounded w-24 mb-3"></div>
    <div className="flex items-center">
      <div className="flex-1">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-gray-300 h-2 rounded-full w-1/3"></div>
        </div>
      </div>
      <div className="ml-3 h-4 bg-gray-300 rounded w-8"></div>
    </div>
  </div>
);

export const SkeletonPerformanceGrid: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <SkeletonPerformanceCard />
    <div className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
      <div className="h-4 bg-gray-300 rounded w-32 mb-3"></div>
      <div className="h-6 bg-gray-300 rounded w-24 mb-1"></div>
      <div className="h-3 bg-gray-300 rounded w-20"></div>
    </div>
    <div className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
      <div className="h-4 bg-gray-300 rounded w-28 mb-3"></div>
      <div className="h-6 bg-gray-300 rounded w-20 mb-1"></div>
      <div className="h-3 bg-gray-300 rounded w-24"></div>
    </div>
  </div>
);

export const SkeletonChart: React.FC = () => (
  <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center animate-pulse">
    <div className="mb-4">
      <div className="h-12 w-12 bg-gray-300 rounded mx-auto"></div>
    </div>
    <div className="h-6 bg-gray-300 rounded w-48 mx-auto mb-2"></div>
    <div className="h-4 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
    <div className="flex justify-center space-x-4">
      <div className="h-8 bg-gray-300 rounded w-24"></div>
      <div className="h-8 bg-gray-300 rounded w-24"></div>
      <div className="h-8 bg-gray-300 rounded w-24"></div>
    </div>
  </div>
);

// Loading spinner for refresh button
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-6 w-6'
  };

  return (
    <div className={`${sizeClasses[size]} border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin`} />
  );
};

// Error state component
export interface ErrorStateProps {
  error: {
    code: string;
    message: string;
    timestamp: string;
  };
  onRetry: () => void;
  retrying?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry, retrying = false }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
    <div className="mb-4">
      <div className="h-12 w-12 bg-red-100 rounded-full mx-auto flex items-center justify-center">
        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
    </div>
    <h4 className="text-lg font-medium text-red-900 mb-2">Failed to Load Revenue Data</h4>
    <p className="text-red-700 mb-4">{error.message}</p>
    <p className="text-sm text-red-600 mb-4">Error Code: {error.code}</p>
    <button
      onClick={onRetry}
      disabled={retrying}
      className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {retrying ? (
        <>
          <LoadingSpinner size="sm" />
          Retrying...
        </>
      ) : (
        <>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Try Again
        </>
      )}
    </button>
  </div>
);

// Connection status indicator
export interface ConnectionStatusProps {
  dashboard: boolean;
  finance: boolean;
  className?: string;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ dashboard, finance, className = '' }) => (
  <div className={`flex items-center gap-2 text-xs ${className}`}>
    <div className="flex items-center gap-1">
      <div className={`h-2 w-2 rounded-full ${dashboard ? 'bg-green-400' : 'bg-red-400'}`} />
      <span className={dashboard ? 'text-green-600' : 'text-red-600'}>Dashboard API</span>
    </div>
    <div className="flex items-center gap-1">
      <div className={`h-2 w-2 rounded-full ${finance ? 'bg-green-400' : 'bg-red-400'}`} />
      <span className={finance ? 'text-green-600' : 'text-red-600'}>Finance API</span>
    </div>
  </div>
);
