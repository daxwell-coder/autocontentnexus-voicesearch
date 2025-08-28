import { useState, useEffect } from 'react'
import { Search, Filter, ExternalLink, CheckCircle, Clock, AlertCircle, TrendingUp, BarChart3, Users, Zap } from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface AWINProgram {
  id: number
  program_id: number
  name: string
  merchant: string
  description: string
  status: 'not_applied' | 'pending' | 'approved' | 'rejected'
  relevance: number
  region: string
  sector: string
  logo_url?: string
  website_url?: string
  click_through_url?: string
  commission_rate?: number
  currency_code?: string
  niches: string[]
}

interface AWINData {
  programs: AWINProgram[]
  summary: {
    total: number
    discovered: number
    applied: number
    joined: number
  }
  last_updated: string
}

export function AWINProgramManagement() {
  const [data, setData] = useState<AWINData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [relevanceFilter, setRelevanceFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'not_applied' | 'pending' | 'approved' | 'rejected'>('all')
  const [selectedPrograms, setSelectedPrograms] = useState<Set<number>>(new Set())
  const [selectAll, setSelectAll] = useState(false)

  const [rejectingPrograms, setRejectingPrograms] = useState<Set<number>>(new Set())

  // Handle checkbox selection
  const handleSelectProgram = (programId: number) => {
    const newSelection = new Set(selectedPrograms)
    if (newSelection.has(programId)) {
      newSelection.delete(programId)
    } else {
      newSelection.add(programId)
    }
    setSelectedPrograms(newSelection)
    setSelectAll(false)
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedPrograms(new Set())
      setSelectAll(false)
    } else {
      const allProgramIds = new Set(filteredPrograms.slice(0, 10).map(p => p.program_id))
      setSelectedPrograms(allProgramIds)
      setSelectAll(true)
    }
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data: result, error: functionError } = await supabase.functions.invoke('awin-program-management', {
        body: { action: 'get_programs' }
      })

      if (functionError) {
        throw new Error(functionError.message || 'Failed to fetch programs')
      }

      if (result?.error) {
        throw new Error(result.error.message || 'Failed to fetch programs')
      }

      setData(result?.data || result)
    } catch (err) {
      console.error('Error fetching AWIN programs:', err)
      setError(err instanceof Error ? err.message : 'Failed to load programs')
    } finally {
      setLoading(false)
    }
  }

  const handleApplyOnAWIN = (programId: number, programName: string) => {
    // Open AWIN login page in new tab where users can manually apply to programs
    const awinUrl = 'https://ui.awin.com/'
    window.open(awinUrl, '_blank', 'noopener,noreferrer')
    
    // Show informative message about the manual application process
    alert(
      `Opening AWIN platform in new tab.\n\n` +
      `To apply to "${programName}":\n` +
      `1. Log in to your AWIN account\n` +
      `2. Go to Advertisers > My Programmes\n` +
      `3. Select "All Programmes"\n` +
      `4. Search for "${programName}" and click Apply`
    )
  }

  const handleReject = async (programId: number) => {
    setRejectingPrograms(prev => new Set(prev).add(programId))
    
    try {
      const { data: result, error: functionError } = await supabase.functions.invoke('awin-program-management', {
        body: { action: 'reject_program', program_id: programId }
      })
      
      if (functionError) {
        throw new Error(functionError.message || 'Rejection failed')
      }
      
      if (result?.error) {
        throw new Error(result.error.message || 'Rejection failed')
      }

      // Refresh data to show updated status
      await fetchData()
      
      // Show success notification
      console.log(`Successfully rejected program ${programId}`)
      
    } catch (err) {
      console.error('Error rejecting program:', err)
      // Show error notification
      alert(`Failed to reject program: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setRejectingPrograms(prev => {
        const newSet = new Set(prev)
        newSet.delete(programId)
        return newSet
      })
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      not_applied: { color: 'bg-gray-100 text-gray-800', icon: Clock, label: 'Not Applied' },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Rejected' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.not_applied
    const Icon = config.icon
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </span>
    )
  }

  const getRelevanceBadge = (relevance: number) => {
    if (relevance >= 70) return 'bg-green-100 text-green-800 border-green-200'
    if (relevance >= 40) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    return 'bg-red-100 text-red-800 border-red-200'
  }

  const filteredPrograms = data?.programs.filter(program => {
    const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRelevance = relevanceFilter === 'all' ||
                            (relevanceFilter === 'high' && program.relevance >= 70) ||
                            (relevanceFilter === 'medium' && program.relevance >= 40 && program.relevance < 70) ||
                            (relevanceFilter === 'low' && program.relevance < 40)
    
    const matchesStatus = statusFilter === 'all' || program.status === statusFilter
    
    return matchesSearch && matchesRelevance && matchesStatus
  }) || []

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-center h-48">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-600">Loading AWIN programs...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-center h-48">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to Load Programs</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
              <div className="h-8 w-8 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              AWIN Program Management
            </h2>
            <p className="text-gray-600 mt-1">
              Intelligent relevance scoring for affiliate programs across renewable energy and sustainable living niches. Applications must be completed manually on the AWIN platform.
            </p>
          </div>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {/* Information Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <ExternalLink className="h-5 w-5 text-blue-600 mt-0.5" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-800 mb-1">
                Program Applications Process
              </h3>
              <p className="text-sm text-blue-700">
                AWIN does not support automatic program applications through their API. When you click "Apply on AWIN", you'll be redirected to the AWIN platform where you can manually apply to programs through their secure interface.
              </p>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Programs</p>
                <p className="text-2xl font-bold text-blue-900">{data?.summary.total || 0}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Discovered</p>
                <p className="text-2xl font-bold text-green-900">{data?.summary.discovered || 0}</p>
              </div>
              <Search className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">Applied</p>
                <p className="text-2xl font-bold text-yellow-900">{data?.summary.applied || 0}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Joined</p>
                <p className="text-2xl font-bold text-purple-900">{data?.summary.joined || 0}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center mb-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search programs, merchants, or descriptions..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={relevanceFilter}
            onChange={(e) => setRelevanceFilter(e.target.value as any)}
          >
            <option value="all">All Relevance</option>
            <option value="high">High (70%+)</option>
            <option value="medium">Medium (40-69%)</option>
            <option value="low">Low (&lt;40%)</option>
          </select>
          
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="all">All Status</option>
            <option value="not_applied">Not Applied</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Batch Actions */}
        {selectedPrograms.size > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-blue-800 font-medium">
                  {selectedPrograms.size} program{selectedPrograms.size !== 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    // Handle bulk application start
                    alert(`Starting automatic application process for ${selectedPrograms.size} selected programs. This will open the AWIN platform for manual applications.`);
                    window.open('https://ui.awin.com/', '_blank', 'noopener,noreferrer');
                  }}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Start Automatic Application ({selectedPrograms.size})
                </button>
                <button
                  onClick={() => {
                    setSelectedPrograms(new Set());
                    setSelectAll(false);
                  }}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Programs Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Program
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Website
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Relevance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Region
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Niches
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPrograms.slice(0, 10).map((program) => (
              <tr key={program.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedPrograms.has(program.program_id)}
                    onChange={() => handleSelectProgram(program.program_id)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    {program.logo_url && (
                      <img 
                        src={program.logo_url} 
                        alt={`${program.merchant} logo`}
                        className="h-8 w-8 rounded object-cover"
                      />
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">{program.name}</div>
                      <div className="text-sm text-gray-500">{program.merchant}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {program.website_url ? (
                    <a
                      href={program.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Visit Site
                    </a>
                  ) : (
                    <span className="text-sm text-gray-400">No URL</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(program.status)}
                </td>
                <td className="px-6 py-4">
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getRelevanceBadge(program.relevance)}`}>
                    <Zap className="h-3 w-3 mr-1" />
                    {program.relevance}%
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-900">{program.region}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {program.niches.map((niche, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {niche}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {program.status === 'not_applied' ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApplyOnAWIN(program.program_id, program.name)}
                        disabled={rejectingPrograms.has(program.program_id)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="Apply to this program on the AWIN platform"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Apply on AWIN
                      </button>
                      <button
                        onClick={() => handleReject(program.program_id)}
                        disabled={rejectingPrograms.has(program.program_id)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {rejectingPrograms.has(program.program_id) ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400 mr-2"></div>
                            Rejecting...
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-4 w-4 mr-2" />
                            Reject
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredPrograms.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Programs Found</h3>
          <p className="text-gray-600">Try adjusting your search terms or filters.</p>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Showing {Math.min(filteredPrograms.length, 10)} of {filteredPrograms.length} programs</span>
          <span>Last updated: {data?.last_updated ? new Date(data.last_updated).toLocaleString() : 'Unknown'}</span>
        </div>
      </div>
    </div>
  )
}