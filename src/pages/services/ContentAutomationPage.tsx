import { Link } from 'react-router-dom'
import { Zap, Calendar, RefreshCw, TrendingUp, Clock, BarChart } from 'lucide-react'

export default function ContentAutomationPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6">
              <Zap className="h-16 w-16 mx-auto text-purple-200 mb-4" />
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Content Automation</h1>
              <p className="text-xl text-purple-100 max-w-3xl mx-auto">
                Break free from the content treadmill. Intelligent automation that repurposes your best ideas 
                across platforms while maintaining your authentic voice and message.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Point Section */}
      <section className="py-16 bg-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">The Content Treadmill Crisis</h2>
            <p className="text-lg text-gray-600">When content creation becomes a creativity killer</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-red-600 mb-4">The Burnout Cycle</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-red-100 rounded-full p-1 mt-1">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Platform Pressure</h4>
                    <p className="text-gray-700 text-sm">Algorithms demand multiple posts daily across TikTok, YouTube, Instagram, and blogs</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-red-100 rounded-full p-1 mt-1">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Manual Repurposing</h4>
                    <p className="text-gray-700 text-sm">Hours spent manually adapting one idea for different platform requirements and audiences</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-red-100 rounded-full p-1 mt-1">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Creative Stagnation</h4>
                    <p className="text-gray-700 text-sm">Pressure for volume leads to repetitive content and loss of innovative thinking</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-orange-600 mb-4">The Hidden Costs</h3>
              <div className="space-y-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900">Time Breakdown Per Week:</h4>
                  <ul className="text-sm text-gray-700 mt-2 space-y-1">
                    <li>• Content ideation: 8-10 hours</li>
                    <li>• Platform-specific adaptation: 12-15 hours</li>
                    <li>• Manual scheduling & posting: 4-6 hours</li>
                    <li>• Performance tracking: 2-3 hours</li>
                  </ul>
                  <p className="font-bold text-lg text-orange-600 mt-2">Total: 26-34 hours/week</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900">Opportunity Cost:</h4>
                  <p className="text-gray-700 text-sm">Time spent on repetitive tasks = less time for high-impact content, audience engagement, and strategic growth</p>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Intelligent Content Calendar & Automation Suite</h2>
            <p className="text-lg text-gray-600">Create once, publish everywhere - intelligently</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Content Calendar</h3>
              <p className="text-gray-600">AI analyzes your best-performing content and suggests optimal posting schedules across all platforms</p>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Automated Repurposing</h3>
              <p className="text-gray-600">Transform one blog post into TikTok scripts, Instagram carousels, YouTube descriptions, and Twitter threads</p>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Performance Optimization</h3>
              <p className="text-gray-600">Continuously learns from your content performance to improve future automation and scheduling decisions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Complete Workflow Automation</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-600" />
                One-Click Repurposing
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Blog post → TikTok video script with hook, body, and CTA</li>
                <li>• YouTube video → Instagram carousel with key takeaways</li>
                <li>• Long-form content → Twitter thread with optimal engagement</li>
                <li>• Podcast → LinkedIn article with professional tone adaptation</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Intelligent Scheduling
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• AI learns your audience's peak engagement times per platform</li>
                <li>• Seasonal content suggestions based on sustainability events</li>
                <li>• Content gaps identification and automatic fill recommendations</li>
                <li>• Cross-platform coordination to avoid content cannibalization</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart className="h-5 w-5 text-green-600" />
                Performance Analytics
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Real-time performance tracking across all platforms</li>
                <li>• Content format effectiveness analysis</li>
                <li>• Audience engagement pattern recognition</li>
                <li>• ROI measurement for time invested vs. results achieved</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-orange-600" />
                Continuous Learning
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Algorithm change adaptation and strategy adjustment</li>
                <li>• Personal voice and style consistency maintenance</li>
                <li>• Trending topic integration with your niche expertise</li>
                <li>• Content theme rotation to prevent audience fatigue</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Transform Your Workflow</h2>
            <p className="text-lg text-gray-600">From content treadmill to creative freedom</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">80%</div>
              <p className="text-gray-700">Time Saved</p>
              <p className="text-sm text-gray-500 mt-1">From 30+ hours to 6 hours per week</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">5x</div>
              <p className="text-gray-700">Content Output</p>
              <p className="text-sm text-gray-500 mt-1">Same effort, exponentially more reach</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">60%</div>
              <p className="text-gray-700">Engagement Boost</p>
              <p className="text-sm text-gray-500 mt-1">Optimized timing and platform adaptation</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">90%</div>
              <p className="text-gray-700">Burnout Reduction</p>
              <p className="text-sm text-gray-500 mt-1">More time for creativity and strategy</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Escape the Content Treadmill</h2>
          <p className="text-xl text-purple-100 mb-8">
            Reclaim your time and creativity with intelligent content automation designed for sustainability creators
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/ai-studio"
              className="inline-flex items-center px-8 py-4 rounded-lg text-lg font-semibold text-purple-600 bg-white hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Zap className="w-5 h-5 mr-2" />
              Start Automating
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-4 rounded-lg text-lg font-semibold text-white border-2 border-white hover:bg-white hover:text-purple-600 transition-all duration-300"
            >
              See Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}