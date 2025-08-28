import { Link } from 'react-router-dom'
import { Shield, Check, TrendingUp, Users, Clock, Star } from 'lucide-react'

export default function BrandVettingPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6">
              <Shield className="h-16 w-16 mx-auto text-green-200 mb-4" />
              <h1 className="text-4xl md:text-5xl font-bold mb-6">AI Brand Vetting</h1>
              <p className="text-xl text-green-100 max-w-3xl mx-auto">
                End the authenticity paradox. Our AI-powered engine analyzes brands for greenwashing, 
                authenticity issues, and ethical alignment in minutes, not hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Point Section */}
      <section className="py-16 bg-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">The Authenticity Paradox</h2>
            <p className="text-lg text-gray-600">Sustainability creators face an impossible choice</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-red-600 mb-4">The Current Reality</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span>99% of brand offers rejected due to greenwashing concerns</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span>Hours spent researching each potential brand partnership</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span>Risk of audience trust erosion from one bad partnership</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span>Financial instability from rejecting most opportunities</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-green-600 mb-4">The Hidden Cost</h3>
              <div className="space-y-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900">Time Investment Per Brand:</h4>
                  <p className="text-gray-700 text-sm">Research: 2-4 hours • Verification: 1-2 hours • Documentation: 30 minutes</p>
                  <p className="font-bold text-lg text-red-600">Total: 3.5-6.5 hours per brand</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900">Emotional Toll:</h4>
                  <p className="text-gray-700 text-sm">Constant anxiety about authenticity • Fear of audience backlash • Creative energy drained by research</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">AI-Powered Brand Authenticity Engine</h2>
            <p className="text-lg text-gray-600">Transform hours of research into minutes of analysis</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Authenticity Score</h3>
              <p className="text-gray-600">AI analyzes sustainability reports, certifications, and public sentiment to generate a comprehensive authenticity score from 0-100</p>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Greenwashing Detection</h3>
              <p className="text-gray-600">Advanced algorithms identify vague claims, verify certifications against official databases, and flag potential red flags</p>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant Analysis</h3>
              <p className="text-gray-600">Get comprehensive brand analysis in under 5 minutes instead of 5+ hours of manual research</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Comprehensive Brand Intelligence</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                Automated Verification
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• B-Corp, Fair Trade, and organic certifications cross-reference</li>
                <li>• Supply chain transparency analysis</li>
                <li>• Environmental impact report verification</li>
                <li>• Third-party sustainability rating aggregation</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                Risk Assessment
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Public controversy and PR crisis monitoring</li>
                <li>• Community sentiment analysis across platforms</li>
                <li>• Competitor comparison and industry positioning</li>
                <li>• Partnership risk probability scoring</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                Language Analysis
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Greenwashing buzzword detection ("eco-friendly", "natural")</li>
                <li>• Vague claim identification and specificity scoring</li>
                <li>• Marketing vs. reality gap analysis</li>
                <li>• Regulatory compliance verification</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                Creator Protection
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Audience alignment scoring based on your values</li>
                <li>• Partnership recommendation with reasoning</li>
                <li>• Legal and regulatory risk assessment</li>
                <li>• Brand relationship history tracking</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Expected Results</h2>
            <p className="text-lg text-gray-600">Transform your partnership workflow</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">95%</div>
              <p className="text-gray-700">Time Reduction</p>
              <p className="text-sm text-gray-500 mt-1">From 5+ hours to 5 minutes per brand analysis</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">3x</div>
              <p className="text-gray-700">More Opportunities</p>
              <p className="text-sm text-gray-500 mt-1">Efficiently evaluate more brands, find better matches</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">100%</div>
              <p className="text-gray-700">Confidence</p>
              <p className="text-sm text-gray-500 mt-1">Make informed decisions with comprehensive data</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Stop Wasting Time on Brand Research</h2>
          <p className="text-xl text-green-100 mb-8">
            Join sustainability creators who have reclaimed their time and confidence with AI-powered brand vetting
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/ai-studio"
              className="inline-flex items-center px-8 py-4 rounded-lg text-lg font-semibold text-green-600 bg-white hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Star className="w-5 h-5 mr-2" />
              Try AI Brand Vetting
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-4 rounded-lg text-lg font-semibold text-white border-2 border-white hover:bg-white hover:text-green-600 transition-all duration-300"
            >
              Request Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}