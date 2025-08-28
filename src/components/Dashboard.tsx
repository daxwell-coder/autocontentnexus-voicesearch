import { useEffect, useState } from 'react'
import { analyticsService, AnalyticsData } from '../lib/supabase'
import { Activity, Users, DollarSign, FileText, TrendingUp, AlertCircle } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string
  change?: string
  icon: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
}

function MetricCard({ title, value, change, icon, trend = 'neutral' }: MetricCardProps) {
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${trendColor} flex items-center gap-1`}>
              <TrendingUp className="h-4 w-4" />
              {change}
            </p>
          )}
        </div>
        <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
          {icon}
        </div>
      </div>
    </div>
  )
}

interface AgentStatusProps {
  agents: Array<{
    name: string
    status: string
    last_activity: string | null
    uptime: number
    errors: number
  }>
}

function AgentStatus({ agents }: AgentStatusProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Agent Management</h3>
      <div className="space-y-4">
        {agents.map((agent, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`h-3 w-3 rounded-full ${
                agent.status === 'active' ? 'bg-green-500' : 
                agent.status === 'error' ? 'bg-red-500' : 'bg-gray-400'
              }`} />
              <div>
                <p className="font-medium text-gray-900">{agent.name}</p>
                <p className="text-sm text-gray-600">
                  Last activity: {agent.last_activity ? new Date(agent.last_activity).toLocaleString() : 'Never'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{agent.uptime}% uptime</p>
              <p className="text-sm text-gray-600">{agent.errors} errors</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface ContentPipelineProps {
  content: {
    total_created: number
    published: number
    pending: number
  }
}

function ContentPipeline({ content }: ContentPipelineProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Pipeline</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Created</span>
          <span className="font-semibold text-gray-900">{content.total_created}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Published</span>
          <span className="font-semibold text-green-600">{content.published}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Pending</span>
          <span className="font-semibold text-yellow-600">{content.pending}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-600 h-2 rounded-full" 
            style={{ 
              width: content.total_created > 0 ? `${(content.published / content.total_created) * 100}%` : '0%' 
            }}
          />
        </div>
      </div>
    </div>
  )
}

export function Dashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true)
        setError(null)
        const data = await analyticsService.getDashboardAnalytics()
        
        if (data && data.visitors && data.revenue && data.content && data.ai_agents) {
          setAnalytics(data)
        } else {
          console.error('Invalid analytics data structure:', data)
          setError('Invalid data format received from server')
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
        console.error('Error loading analytics:', errorMessage)
        setError('Error loading analytics: ' + errorMessage)
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
    
    // Set up real-time updates
    const interval = setInterval(loadAnalytics, 30000) // Update every 30 seconds
    
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">No analytics data available</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AutoContent Nexus</h1>
          <p className="text-gray-600 mt-2">AI-Powered Sustainability Platform</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Daily Visitors"
            value={analytics.visitors.daily_unique.toString()}
            change="Starting fresh"
            icon={<Users className="h-6 w-6 text-blue-600" />}
            trend="neutral"
          />
          <MetricCard
            title="Total Revenue"
            value={`${analytics.revenue.currency === 'USD' ? '$' : '£'}${analytics.revenue.total.toFixed(2)}`}
            change={analytics.revenue.data_source || "Live AWIN data"}
            icon={<DollarSign className="h-6 w-6 text-green-600" />}
            trend="neutral"
          />
          <MetricCard
            title="Content Created"
            value={analytics.content.total_created.toString()}
            change="Ready to start"
            icon={<FileText className="h-6 w-6 text-purple-600" />}
            trend="neutral"
          />
          <MetricCard
            title="Page Views"
            value={analytics.visitors.total_page_views.toString()}
            change="Real-time tracking"
            icon={<Activity className="h-6 w-6 text-orange-600" />}
            trend="neutral"
          />
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AgentStatus agents={analytics.ai_agents} />
          <ContentPipeline content={analytics.content} />
          
          {/* Revenue Breakdown */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">PayPal</span>
                <span className="font-semibold text-gray-900">{analytics.revenue.currency === 'USD' ? '$' : '£'}{analytics.revenue.paypal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">AWIN Affiliate</span>
                <span className="font-semibold text-gray-900">{analytics.revenue.currency === 'USD' ? '$' : '£'}{analytics.revenue.affiliate.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-bold text-gray-900">{analytics.revenue.currency === 'USD' ? '$' : '£'}{analytics.revenue.total.toFixed(2)}</span>
              </div>
              <p className="text-sm text-gray-600">{analytics.revenue.transaction_count} transactions</p>
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h3>
            <div className="space-y-4">
              {Object.keys(analytics.visitors.traffic_sources).length > 0 ? (
                Object.entries(analytics.visitors.traffic_sources).map(([source, count]) => (
                  <div key={source} className="flex justify-between items-center">
                    <span className="text-gray-600 capitalize">{source}</span>
                    <span className="font-semibold text-gray-900">{count}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No traffic data yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Real-time Status */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-600">Real-time tracking active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-blue-500 rounded-full" />
              <span className="text-sm text-gray-600">Database connected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-yellow-500 rounded-full" />
              <span className="text-sm text-gray-600">AI agents ready for activation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
