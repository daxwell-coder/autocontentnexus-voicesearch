import { Link } from 'react-router-dom'
import { Zap, BarChart, FileSearch, TrendingUp, Target, PieChart } from 'lucide-react'

export default function ImpactToolsPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-600 to-red-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6">
              <Target className="h-16 w-16 mx-auto text-orange-200 mb-4" />
              <h1 className="text-4xl md:text-5xl font-bold mb-6">High-Impact Content Tools</h1>
              <p className="text-xl text-orange-100 max-w-3xl mx-auto">
                Bridge the investigative impasse. Create data-rich, investigative content with automated 
                visualization and analysis tools that turn complex sustainability data into compelling stories.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Point Section */}
      <section className="py-16 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">The High-Impact Content Gap</h2>
            <p className="text-lg text-gray-600">When audience demand exceeds production capability</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-orange-600 mb-4">Audience Expectations</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-orange-100 rounded-full p-1 mt-1">
                    <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Data-Driven Analysis</h4>
                    <p className="text-gray-700 text-sm">Audiences expect investigative journalism quality: charts, infographics, and comprehensive data analysis</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-orange-100 rounded-full p-1 mt-1">
                    <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Visual Storytelling</h4>
                    <p className="text-gray-700 text-sm">Complex sustainability topics require sophisticated visualizations to make data accessible and engaging</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-orange-100 rounded-full p-1 mt-1">
                    <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Investigative Depth</h4>
                    <p className="text-gray-700 text-sm">High-engagement content requires uncovering connections, trends, and insights hidden in raw data</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-red-600 mb-4">Resource Reality Check</h3>
              <div className="space-y-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900">Creating One Data Visualization:</h4>
                  <ul className="text-sm text-gray-700 mt-2 space-y-1">
                    <li>• Data collection & cleaning: 3-5 hours</li>
                    <li>• Analysis & insight generation: 2-4 hours</li>
                    <li>• Design & visualization creation: 2-3 hours</li>
                    <li>• Content writing & context: 1-2 hours</li>
                  </ul>
                  <p className="font-bold text-lg text-red-600 mt-2">Total: 8-14 hours per visualization</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900">The Skills Gap:</h4>
                  <p className="text-gray-700 text-sm">Most creators lack data analysis, visualization design, and statistical analysis skills required for investigative content</p>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Automated Data Visualization & Investigative Suite</h2>
            <p className="text-lg text-gray-600">Turn complex data into compelling visual stories</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Visualizations</h3>
              <p className="text-gray-600">AI automatically creates charts, infographics, and interactive visualizations from raw sustainability data</p>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileSearch className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Investigative Analysis</h3>
              <p className="text-gray-600">Discover hidden patterns, correlations, and trends in sustainability data that would take hours to find manually</p>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Story Generation</h3>
              <p className="text-gray-600">Transform data insights into compelling narratives with context, implications, and actionable takeaways</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Professional-Grade Content Creation</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart className="h-5 w-5 text-orange-600" />
                Automated Visualization
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Interactive charts: line graphs, bar charts, scatter plots, heat maps</li>
                <li>• Infographic generation with brand-consistent design templates</li>
                <li>• Geographic visualizations for climate and environmental data</li>
                <li>• Time-series animations showing trends and changes over time</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileSearch className="h-5 w-5 text-red-600" />
                Data Intelligence
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Correlation detection between environmental and economic factors</li>
                <li>• Trend forecasting based on historical sustainability data</li>
                <li>• Anomaly detection in corporate sustainability reports</li>
                <li>• Comparative analysis across industries, regions, and time periods</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <PieChart className="h-5 w-5 text-blue-600" />
                Content Formats
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Long-form investigative articles with embedded visualizations</li>
                <li>• Social media carousel posts breaking down complex data</li>
                <li>• Video scripts with data storytelling frameworks</li>
                <li>• Interactive web components for audience engagement</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                Impact Measurement
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Content engagement prediction based on data complexity</li>
                <li>• Readability optimization for different audience segments</li>
                <li>• A/B testing for visualization styles and formats</li>
                <li>• Performance tracking for data-driven content ROI</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Data Sources Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Rich Data Ecosystem</h2>
            <p className="text-lg text-gray-600">Access to premium datasets and real-time information</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Climate Data</h3>
              <p className="text-sm text-gray-600">Temperature, emissions, sea levels, weather patterns</p>
            </div>
            
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Corporate ESG</h3>
              <p className="text-sm text-gray-600">Sustainability reports, carbon footprints, supply chains</p>
            </div>
            
            <div className="text-center p-6 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Energy Markets</h3>
              <p className="text-sm text-gray-600">Renewable capacity, pricing, grid integration data</p>
            </div>
            
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Policy Impact</h3>
              <p className="text-sm text-gray-600">Regulation effects, carbon markets, incentive programs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Content You Can Create</h2>
            <p className="text-lg text-gray-600">From concept to publication in hours, not weeks</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Investigative Exposés</h3>
              <p className="text-gray-600 text-sm mb-4">"The Hidden Carbon Cost of Fast Fashion: A Data Analysis of 50 Major Brands"</p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Supply chain visualization</li>
                <li>• Carbon footprint comparison</li>
                <li>• Greenwashing detection analysis</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Trend Analysis</h3>
              <p className="text-gray-600 text-sm mb-4">"Solar Energy Growth: 10-Year Regional Comparison with Future Projections"</p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Interactive time-series charts</li>
                <li>• Geographic heat maps</li>
                <li>• Predictive modeling visualizations</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Impact Stories</h3>
              <p className="text-gray-600 text-sm mb-4">"How Your City Compares: Personal Carbon Footprint by Location"</p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Personalized data calculators</li>
                <li>• Comparative infographics</li>
                <li>• Actionable recommendation charts</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Content Impact Revolution</h2>
            <p className="text-lg text-gray-600">From basic content to investigative journalism quality</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">85%</div>
              <p className="text-gray-700">Production Time Saved</p>
              <p className="text-sm text-gray-500 mt-1">From 12+ hours to 2 hours per visualization</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">10x</div>
              <p className="text-gray-700">Content Depth</p>
              <p className="text-sm text-gray-500 mt-1">Professional-grade investigative content</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-600 mb-2">3x</div>
              <p className="text-gray-700">Engagement Rate</p>
              <p className="text-sm text-gray-500 mt-1">Data-rich content performs significantly better</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">100%</div>
              <p className="text-gray-700">Professional Quality</p>
              <p className="text-sm text-gray-500 mt-1">Newsroom-quality visualizations and analysis</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Create High-Impact Content Today</h2>
          <p className="text-xl text-orange-100 mb-8">
            Transform complex sustainability data into compelling visual stories that drive engagement and action
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/ai-studio"
              className="inline-flex items-center px-8 py-4 rounded-lg text-lg font-semibold text-orange-600 bg-white hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Target className="w-5 h-5 mr-2" />
              Start Creating
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-4 rounded-lg text-lg font-semibold text-white border-2 border-white hover:bg-white hover:text-orange-600 transition-all duration-300"
            >
              View Examples
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}