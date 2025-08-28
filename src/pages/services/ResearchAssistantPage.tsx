import { Link } from 'react-router-dom'
import { BookOpen, Search, CheckCircle, Users, Clock, TrendingUp } from 'lucide-react'

export default function ResearchAssistantPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-teal-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6">
              <BookOpen className="h-16 w-16 mx-auto text-blue-200 mb-4" />
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Research Assistant</h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Navigate the credibility gauntlet with confidence. Our AI research assistant provides 
                verified sustainability data and real-time fact-checking to maintain your scientific credibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Point Section */}
      <section className="py-16 bg-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">The Credibility Gauntlet</h2>
            <p className="text-lg text-gray-600">When accuracy becomes your biggest time drain</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-orange-600 mb-4">The Research Burden</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-orange-100 rounded-full p-1 mt-1">
                    <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Technical Complexity</h4>
                    <p className="text-gray-700 text-sm">Sustainability involves complex systems: carbon cycles, supply chains, policy frameworks, and rapidly evolving technology</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-orange-100 rounded-full p-1 mt-1">
                    <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Source Verification</h4>
                    <p className="text-gray-700 text-sm">Hours spent verifying data sources, cross-referencing studies, and ensuring information is current and accurate</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-orange-100 rounded-full p-1 mt-1">
                    <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Misinformation Risk</h4>
                    <p className="text-gray-700 text-sm">One factual error can damage credibility and audience trust permanently</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-red-600 mb-4">The Time Reality</h3>
              <div className="space-y-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900">Research Time Per Video/Article:</h4>
                  <ul className="text-sm text-gray-700 mt-2 space-y-1">
                    <li>• Initial topic research: 2-4 hours</li>
                    <li>• Source verification: 1-3 hours</li>
                    <li>• Data accuracy cross-checking: 1-2 hours</li>
                    <li>• Citation and reference organization: 30-60 minutes</li>
                  </ul>
                  <p className="font-bold text-lg text-red-600 mt-2">Total: 4.5-9.5 hours</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900">The Accuracy Pressure:</h4>
                  <p className="text-gray-700 text-sm">Sustainability creators face unique scrutiny from scientifically-minded audiences who expect peer-review level accuracy in accessible content</p>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Curated Sustainability Data Hub</h2>
            <p className="text-lg text-gray-600">Verified information at your fingertips</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant Research</h3>
              <p className="text-gray-600">Access pre-verified sustainability data, statistics, and research from trusted sources in seconds</p>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-Time Fact-Checking</h3>
              <p className="text-gray-600">AI verifies your claims against the latest research, flags potential inaccuracies, and suggests corrections</p>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Source Intelligence</h3>
              <p className="text-gray-600">Automatically generates proper citations and tracks source credibility scores for academic-quality references</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Comprehensive Research Infrastructure</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                Verified Data Sources
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• IPCC reports and climate science databases</li>
                <li>• EPA, NOAA, and international environmental agencies</li>
                <li>• Peer-reviewed journals and academic institutions</li>
                <li>• Industry reports from certified sustainability organizations</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-teal-600" />
                Smart Fact-Checking
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Real-time claim verification against latest research</li>
                <li>• Context-aware accuracy scoring for your content</li>
                <li>• Automatic updates when new data contradicts old claims</li>
                <li>• Uncertainty quantification for emerging topics</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Search className="h-5 w-5 text-green-600" />
                Intelligent Search
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Natural language queries: "What's the carbon footprint of almond milk?"</li>
                <li>• Comparative analysis: "Solar vs wind energy efficiency 2025"</li>
                <li>• Trend identification: "Latest developments in carbon capture"</li>
                <li>• Complex topic simplification for audience accessibility</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                Citation Management
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Automatic APA, MLA, and Chicago style citations</li>
                <li>• Source credibility scoring and bias analysis</li>
                <li>• Reference list generation and organization</li>
                <li>• Link rot detection and alternative source suggestions</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Specialized Areas Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Specialized Knowledge Areas</h2>
            <p className="text-lg text-gray-600">Deep expertise across sustainability domains</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Climate Science</h3>
              <p className="text-sm text-gray-600">IPCC data, temperature trends, emission projections</p>
            </div>
            
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Renewable Energy</h3>
              <p className="text-sm text-gray-600">Technology efficiency, cost trends, grid integration</p>
            </div>
            
            <div className="text-center p-6 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Supply Chains</h3>
              <p className="text-sm text-gray-600">Carbon footprints, ethical sourcing, transparency</p>
            </div>
            
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Policy & Regulation</h3>
              <p className="text-sm text-gray-600">Environmental laws, carbon markets, incentives</p>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Research Revolution</h2>
            <p className="text-lg text-gray-600">From hours to minutes, from stress to confidence</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">90%</div>
              <p className="text-gray-700">Research Time Saved</p>
              <p className="text-sm text-gray-500 mt-1">From 6+ hours to 30 minutes per piece</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-teal-600 mb-2">99%</div>
              <p className="text-gray-700">Accuracy Rate</p>
              <p className="text-sm text-gray-500 mt-1">Verified against peer-reviewed sources</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">10x</div>
              <p className="text-gray-700">Content Depth</p>
              <p className="text-sm text-gray-500 mt-1">More comprehensive, data-rich content</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">100%</div>
              <p className="text-gray-700">Credibility</p>
              <p className="text-sm text-gray-500 mt-1">Maintain scientific accuracy effortlessly</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Stop Drowning in Research</h2>
          <p className="text-xl text-blue-100 mb-8">
            Access verified sustainability data instantly and maintain your scientific credibility without the time burden
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/ai-studio"
              className="inline-flex items-center px-8 py-4 rounded-lg text-lg font-semibold text-blue-600 bg-white hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Try Research Assistant
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-4 rounded-lg text-lg font-semibold text-white border-2 border-white hover:bg-white hover:text-blue-600 transition-all duration-300"
            >
              Request Access
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}