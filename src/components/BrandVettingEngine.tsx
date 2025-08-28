import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import {
  Shield,
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Download,
  ExternalLink,
  Award,
  Flag,
  Eye,
  Clock,
  Activity,
  AlertCircle
} from 'lucide-react';

interface BrandVettingResult {
  brandName: string;
  authenticityScore: number;
  tier: 'Green' | 'Amber' | 'Red';
  tierDescription: string;
  breakdown: {
    corporateData: number;
    thirdPartyRatings: number;
    publicSentiment: number;
    greenwashingPenalty: number;
  };
  findings: {
    greenwashingFlags: string[];
    discrepancies: string[];
    certifications: string[];
    transparencyInsights: string[];
  };
  dataSources: string[];
  lastUpdated: string;
  analysisMetrics: {
    totalDataPoints: number;
    confidenceLevel: string;
    analysisDepth: string;
  };
}

interface AuthenticityScoreDisplayProps {
  score: number;
  tier: 'Green' | 'Amber' | 'Red';
  tierDescription: string;
}

function AuthenticityScoreDisplay({ score, tier, tierDescription }: AuthenticityScoreDisplayProps) {
  const getScoreColor = (tier: string) => {
    switch (tier) {
      case 'Green': return 'text-green-600';
      case 'Amber': return 'text-amber-600';
      case 'Red': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getProgressColor = (tier: string) => {
    switch (tier) {
      case 'Green': return 'bg-green-500';
      case 'Amber': return 'bg-amber-500';
      case 'Red': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getBgColor = (tier: string) => {
    switch (tier) {
      case 'Green': return 'bg-green-50';
      case 'Amber': return 'bg-amber-50';
      case 'Red': return 'bg-red-50';
      default: return 'bg-gray-50';
    }
  };

  return (
    <div className={`${getBgColor(tier)} rounded-lg p-6 border-2 ${
      tier === 'Green' ? 'border-green-200' : 
      tier === 'Amber' ? 'border-amber-200' : 
      'border-red-200'
    }`}>
      <div className="text-center">
        <div className="relative inline-flex items-center justify-center w-24 h-24 mb-4">
          <svg className="w-24 h-24 transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - (score || 0) / 100)}`}
              className={getScoreColor(tier)}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-2xl font-bold ${getScoreColor(tier)}`}>
              {Math.round(score || 0)}
            </span>
          </div>
        </div>
        <div className={`text-lg font-semibold ${getScoreColor(tier)} mb-2`}>
          {tier} Tier
        </div>
        <div className="text-sm text-gray-600 max-w-xs mx-auto">
          {tierDescription}
        </div>
      </div>
    </div>
  );
}

interface TierClassificationBadgeProps {
  tier: 'Green' | 'Amber' | 'Red';
  score: number;
}

function TierClassificationBadge({ tier, score }: TierClassificationBadgeProps) {
  const getIcon = (tier: string) => {
    switch (tier) {
      case 'Green': return <CheckCircle className="h-5 w-5" />;
      case 'Amber': return <AlertTriangle className="h-5 w-5" />;
      case 'Red': return <XCircle className="h-5 w-5" />;
      default: return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getColors = (tier: string) => {
    switch (tier) {
      case 'Green': return 'bg-green-100 text-green-800 border-green-200';
      case 'Amber': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Red': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium border ${getColors(tier)}`}>
      {getIcon(tier)}
      <span className="ml-2">{tier} ({score}/100)</span>
    </div>
  );
}

interface GreenwashingFlagsDisplayProps {
  flags: string[];
}

function GreenwashingFlagsDisplay({ flags }: GreenwashingFlagsDisplayProps) {
  // Safe array handling with null checks
  const safeFlags = flags || [];
  
  if (safeFlags.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center">
          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
          <span className="text-green-800 font-medium">No greenwashing flags detected</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center text-red-600">
        <Flag className="h-5 w-5 mr-2" />
        <span className="font-medium">Greenwashing Risk Indicators ({safeFlags.length})</span>
      </div>
      {safeFlags.map((flag, index) => (
        <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-start">
            <AlertTriangle className="h-4 w-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-red-800 text-sm">{flag}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function BrandVettingEngine() {
  const [brandName, setBrandName] = useState('');
  const [brandUrl, setBrandUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<BrandVettingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVetBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Enhanced input validation
    const trimmedBrandName = brandName.trim();
    
    if (!trimmedBrandName) {
      setError('Brand name is required');
      return;
    }
    
    if (trimmedBrandName.length < 2) {
      setError('Brand name must be at least 2 characters long');
      return;
    }
    
    if (!/[a-zA-Z]/.test(trimmedBrandName)) {
      setError('Please enter a valid brand name with letters');
      return;
    }
    
    // Check for test/dummy inputs
    if (/^(xyz|abc|test|invalid|random|dummy|placeholder)\d*$/i.test(trimmedBrandName)) {
      setError('Please enter a real company name for analysis');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('brand-vetting', {
        body: {
          brandName: trimmedBrandName,
          brandUrl: brandUrl.trim() || undefined,
          companyInfo: `Brand vetting analysis for ${trimmedBrandName}`
        }
      });

      if (error) {
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error.message);
      }

      // Ensure data structure is complete before setting result
      if (!data?.data) {
        throw new Error('Invalid response format received from server');
      }

      // Validate required properties and provide defaults
      const validatedData = {
        ...data.data,
        findings: {
          greenwashingFlags: data.data.findings?.greenwashingFlags || [],
          discrepancies: data.data.findings?.discrepancies || [],
          certifications: data.data.findings?.certifications || [],
          transparencyInsights: data.data.findings?.transparencyInsights || []
        },
        analysisMetrics: {
          totalDataPoints: data.data.analysisMetrics?.totalDataPoints || 0,
          confidenceLevel: data.data.analysisMetrics?.confidenceLevel || 'Low',
          analysisDepth: data.data.analysisMetrics?.analysisDepth || 'Limited'
        },
        dataSources: data.data.dataSources || [],
        tierDescription: data.data.tierDescription || 'Analysis completed with limited data'
      };

      setResult(validatedData);
    } catch (err: any) {
      console.error('Brand vetting error:', err);
      setError(err.message || 'Failed to analyze brand. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportResults = () => {
    if (!result) return;

    const exportData = {
      brand: result.brandName,
      score: result.authenticityScore,
      tier: result.tier,
      analysis: result.findings,
      sources: result.dataSources,
      timestamp: result.lastUpdated
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.brandName.replace(/\s+/g, '_')}_brand_analysis.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Brand Input Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Search className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Brand Analysis Form</h3>
        </div>
        
        <form onSubmit={handleVetBrand} className="space-y-4">
          <div>
            <label htmlFor="brandName" className="block text-sm font-medium text-gray-700 mb-2">
              Brand Name *
            </label>
            <input
              type="text"
              id="brandName"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="e.g., Patagonia, Tesla, Beyond Meat"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="brandUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Company Website (Optional)
            </label>
            <input
              type="url"
              id="brandUrl"
              value={brandUrl}
              onChange={(e) => setBrandUrl(e.target.value)}
              placeholder="https://www.company.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading || !brandName.trim()}
            className={`w-full flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors ${
              isLoading || !brandName.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Analyzing Brand...
              </>
            ) : (
              <>
                <Shield className="h-5 w-5 mr-2" />
                Analyze Brand Authenticity
              </>
            )}
          </button>
        </form>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Comprehensive Analysis in Progress</h3>
            <p className="text-blue-700 mb-4">Our AI is analyzing multiple data sources to provide accurate authenticity scoring...</p>
            <div className="space-y-2 text-sm text-blue-600">
              <div className="flex items-center justify-center">
                <Activity className="h-4 w-4 mr-2" />
                Analyzing corporate disclosures and sustainability reports
              </div>
              <div className="flex items-center justify-center">
                <Award className="h-4 w-4 mr-2" />
                Verifying third-party certifications and ESG ratings
              </div>
              <div className="flex items-center justify-center">
                <Eye className="h-4 w-4 mr-2" />
                Monitoring public sentiment and news coverage
              </div>
              <div className="flex items-center justify-center">
                <Flag className="h-4 w-4 mr-2" />
                Detecting greenwashing tactics and inconsistencies
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <XCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800 font-medium">Analysis Failed</span>
          </div>
          <p className="text-red-700 mt-2">{error}</p>
        </div>
      )}

      {/* Results Display */}
      {result && (
        <div className="space-y-6">
          {/* Header with Export */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Brand Authenticity Analysis</h2>
              <p className="text-gray-600">{result.brandName}</p>
            </div>
            <button
              onClick={handleExportResults}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Results
            </button>
          </div>

          {/* Score Display */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <AuthenticityScoreDisplay 
                score={result.authenticityScore} 
                tier={result.tier} 
                tierDescription={result.tierDescription}
              />
            </div>
            
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Scoring Breakdown</h3>
                <TierClassificationBadge tier={result.tier} score={result.authenticityScore} />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Corporate Data (25%)</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${((result.breakdown?.corporateData || 0) / 25) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-12">
                      {(result.breakdown?.corporateData || 0).toFixed(1)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Third-Party Ratings (40%)</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${((result.breakdown?.thirdPartyRatings || 0) / 40) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-12">
                      {(result.breakdown?.thirdPartyRatings || 0).toFixed(1)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Public Sentiment (20%)</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${((result.breakdown?.publicSentiment || 0) / 20) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-12">
                      {(result.breakdown?.publicSentiment || 0).toFixed(1)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <span className="text-sm font-medium text-red-700">Greenwashing Penalty (-15%)</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-red-200 rounded-full h-2">
                      <div 
                        className="bg-red-600 h-2 rounded-full" 
                        style={{ width: `${((result.breakdown?.greenwashingPenalty || 0) / 15) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-red-900 w-12">
                      -{(result.breakdown?.greenwashingPenalty || 0).toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Findings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Greenwashing Analysis */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Flag className="h-5 w-5 text-red-600 mr-2" />
                Greenwashing Analysis
              </h3>
              <GreenwashingFlagsDisplay flags={result.findings?.greenwashingFlags || []} />
            </div>

            {/* Certifications */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Award className="h-5 w-5 text-green-600 mr-2" />
                Certifications & Validation
              </h3>
              {(result.findings?.certifications || []).length > 0 ? (
                <div className="space-y-2">
                  {(result.findings?.certifications || []).map((cert, index) => (
                    <div key={index} className="flex items-center p-2 bg-green-50 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-green-800 text-sm">{cert}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-gray-600">No major certifications found</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Transparency Insights */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Eye className="h-5 w-5 text-blue-600 mr-2" />
              Transparency Insights
            </h3>
            {(result.findings?.transparencyInsights || []).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(result.findings?.transparencyInsights || []).map((insight, index) => (
                  <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0" />
                    <span className="text-blue-800 text-sm">{insight}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <span className="text-gray-600">Limited transparency data available for analysis</span>
              </div>
            )}
          </div>

          {/* Analysis Metadata */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{result.analysisMetrics?.totalDataPoints || 0}</div>
                <div className="text-sm text-gray-600">Data Points Analyzed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{result.dataSources?.length || 0}</div>
                <div className="text-sm text-gray-600">Sources Consulted</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{result.analysisMetrics?.confidenceLevel || 'Unknown'}</div>
                <div className="text-sm text-gray-600">Confidence Level</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center">
                  <Clock className="h-4 w-4 text-gray-500 mr-1" />
                  <div className="text-sm text-gray-600">
                    {result.lastUpdated ? new Date(result.lastUpdated).toLocaleDateString() : 'Unknown'}
                  </div>
                </div>
                <div className="text-sm text-gray-600">Last Updated</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
