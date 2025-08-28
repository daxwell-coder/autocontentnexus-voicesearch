import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Leaf, Zap, Recycle, Star, TrendingUp } from 'lucide-react'

const CategoriesPage: React.FC = () => {
  // Categories data with statistics
  const categories = [
    {
      id: 1,
      name: "Product Reviews",
      description: "In-depth reviews of eco-friendly products, from solar panels to sustainable fashion. Get unbiased analysis and recommendations.",
      icon: Star,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      articleCount: 45,
      recentTopics: [
        "Solar Panel Systems 2025",
        "Sustainable Fashion Brands",
        "Electric Vehicle Reviews",
        "Eco-Friendly Home Appliances"
      ],
      image: "/images/category-product-reviews.jpg",
      path: "/categories/reviews"
    },
    {
      id: 2,
      name: "Renewable Energy",
      description: "Everything about solar, wind, hydro, and other renewable energy sources. Installation guides, cost analysis, and future trends.",
      icon: Zap,
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
      articleCount: 38,
      recentTopics: [
        "Home Solar Installation",
        "Wind Energy for Homes",
        "Battery Storage Solutions",
        "Green Energy Incentives"
      ],
      image: "/images/category-renewable-energy.jpg",
      path: "/categories/renewable-energy"
    },
    {
      id: 3,
      name: "Sustainable Living",
      description: "Practical tips and guides for living sustainably. From reducing waste to making eco-conscious choices in daily life.",
      icon: Leaf,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      articleCount: 52,
      recentTopics: [
        "Zero Waste Kitchen Tips",
        "Sustainable Home Design",
        "Eco-Friendly Transportation",
        "Green Cleaning Solutions"
      ],
      image: "/images/category-sustainable-living.jpg",
      path: "/categories/sustainable-living"
    },
    {
      id: 4,
      name: "Zero Waste",
      description: "Comprehensive guides to achieving zero waste lifestyle. Product alternatives, DIY solutions, and waste reduction strategies.",
      icon: Recycle,
      color: "from-teal-500 to-teal-600",
      bgColor: "bg-teal-50",
      textColor: "text-teal-600",
      articleCount: 29,
      recentTopics: [
        "Zero Waste Bathroom",
        "Plastic-Free Alternatives",
        "Composting Guide",
        "Reusable Product Reviews"
      ],
      image: "/images/category-zero-waste.jpg",
      path: "/categories/zero-waste"
    }
  ]

  const totalArticles = categories.reduce((sum, cat) => sum + cat.articleCount, 0)

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Explore Our Categories
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Dive deep into sustainable living topics. From product reviews to renewable energy guides, 
              find expert insights and AI-powered content across all areas of eco-conscious living.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>{totalArticles} Total Articles</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                <span>Updated Weekly</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                <span>AI-Powered Content</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <div 
                key={category.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="relative">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className={`absolute top-4 left-4 p-3 rounded-xl bg-white/90 backdrop-blur-sm`}>
                    <IconComponent className={`h-6 w-6 ${category.textColor}`} />
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-gray-700">
                    {category.articleCount} articles
                  </div>
                </div>
                
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {category.description}
                  </p>
                  
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Recent Topics:</h4>
                    <div className="space-y-2">
                      {category.recentTopics.map((topic, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <div className={`w-1.5 h-1.5 rounded-full ${category.bgColor} mr-3`}></div>
                          {topic}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Link
                    to={category.path}
                    className={`inline-flex items-center px-6 py-3 bg-gradient-to-r ${category.color} text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300 group/link`}
                  >
                    Explore {category.name}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* Additional Content Section */}
        <div className="mt-16">
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 lg:p-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Can't Find What You're Looking For?
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Our AI Studio can generate custom content on any sustainability topic. 
                Get personalized articles, guides, and reviews tailored to your specific interests.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/ai-studio"
                  className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-lg hover:shadow-xl"
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  Try AI Studio
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  to="/products"
                  className="inline-flex items-center px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors border border-gray-200 shadow-lg hover:shadow-xl"
                >
                  View All Articles
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <div key={category.id} className="text-center">
              <div className={`mx-auto w-16 h-16 ${category.bgColor} rounded-2xl flex items-center justify-center mb-4`}>
                <category.icon className={`h-8 w-8 ${category.textColor}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900">{category.articleCount}</div>
              <div className="text-sm text-gray-600">{category.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CategoriesPage
