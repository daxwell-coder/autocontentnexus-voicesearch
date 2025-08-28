import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uqrmmnzwfvqpnzobwgly.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxcm1tbnp3ZnZxcG56b2J3Z2x5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MzAxOTYsImV4cCI6MjA3MTEwNjE5Nn0.4HPgcnfxNTJXEm9ES7ijpv2KnkHGO-S3EDo6yvSz7QA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Analytics service
export const analyticsService = {
  async trackVisitor(data: {
    sessionId: string
    pageVisited: string
    trafficSource?: string
    userAgent?: string
    country?: string
    deviceType?: string
  }) {
    const { data: result, error } = await supabase.functions.invoke('visitor-tracking', {
      body: data
    })
    
    if (error) {
      console.error('Visitor tracking error:', error)
      return null
    }
    
    return result
  },

  async getDashboardAnalytics() {
    try {
      const { data, error } = await supabase.functions.invoke('dashboard-analytics', {
        body: {}
      })
      
      if (error) {
        console.error('Dashboard analytics error:', error)
        return null
      }
      
      // The edge function returns { data: { ... } }, so we need to extract the inner data
      return data?.data || null
    } catch (err) {
      console.error('Dashboard analytics fetch error:', err)
      return null
    }
  },

  async logAgentActivity(data: {
    agentName: string
    taskType: string
    status: string
    executionTime?: number
    details?: any
    errorMessage?: string
  }) {
    const { data: result, error } = await supabase.functions.invoke('agent-logger', {
      body: data
    })
    
    if (error) {
      console.error('Agent logging error:', error)
      return null
    }
    
    return result
  }
}

// Types
export interface AnalyticsData {
  visitors: {
    daily_unique: number
    monthly_unique: number
    total_page_views: number
    traffic_sources: Record<string, number>
  }
  revenue: {
    total: number
    affiliate: number
    paypal: number
    transaction_count: number
    currency: string
    data_source: string
  }
  content: {
    total_created: number
    published: number
    pending: number
  }
  ai_agents: Array<{
    name: string
    status: string
    last_activity: string | null
    uptime: number
    errors: number
  }>
}

export interface VisitorData {
  sessionId: string
  pageVisited: string
  trafficSource?: string
  userAgent?: string
  country?: string
  deviceType?: string
}
