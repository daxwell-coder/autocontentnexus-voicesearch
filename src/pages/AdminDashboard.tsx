import { BarChart3, TrendingUp, Users, FileText, Activity, AlertCircle } from 'lucide-react'
import { UnifiedRevenueDashboard } from '../components/dashboard/UnifiedRevenueDashboard'
import { ContentPipeline } from '../components/dashboard/ContentPipeline'
import { AffiliateAgentMonitor } from '../components/dashboard/AffiliateAgentMonitor'
import { AWINProgramManagement } from '../components/dashboard/AWINProgramManagement'

export function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Monitor revenue, content pipeline, and affiliate agent performance
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="bg-white rounded-lg border border-gray-200 px-4 py-2 shadow-sm">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Last Updated</p>
              <p className="text-sm font-medium text-gray-900">{new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        {/* Breadcrumb */}
        <nav className="mt-4">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <a href="/" className="hover:text-gray-700 transition-colors">Home</a>
            </li>
            <li className="flex items-center">
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-medium">Admin Dashboard</span>
            </li>
          </ol>
        </nav>
      </div>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Agents</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-sm text-green-600 ml-1">+2 this week</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Content Items</p>
              <p className="text-2xl font-bold text-gray-900">847</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-blue-600 ml-1">+23 today</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Processing Rate</p>
              <p className="text-2xl font-bold text-gray-900">94.5%</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center">
            <TrendingUp className="h-4 w-4 text-purple-500" />
            <span className="text-sm text-purple-600 ml-1">Optimal</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">System Status</p>
              <p className="text-2xl font-bold text-green-600">Online</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center">
            <span className="h-2 w-2 bg-green-500 rounded-full"></span>
            <span className="text-sm text-green-600 ml-2">All systems operational</span>
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue Dashboard - Takes full width on smaller screens, half on large */}
        <div className="lg:col-span-2">
          <UnifiedRevenueDashboard />
        </div>
      </div>

      {/* Secondary Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <ContentPipeline />
        </div>
        <div>
          <AffiliateAgentMonitor />
        </div>
      </div>

      {/* System Alerts */}
      <div className="mt-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-blue-900">Dashboard Status</p>
              <p className="text-sm text-blue-700 mt-1">
                All dashboard components are displaying with placeholder data. Connect to live APIs to see real-time metrics.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* AWIN Program Management */}
      <div className="mt-8">
        <AWINProgramManagement />
      </div>
    </div>
  )
}