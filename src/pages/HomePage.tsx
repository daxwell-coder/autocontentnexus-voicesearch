import React from 'react'
import { Link } from 'react-router-dom'
import { Star, Mic, Sparkles, Search, BarChart3, Lightbulb } from 'lucide-react'

const HomePage: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero Section - Matches Reference Design */}
      <div 
        className="relative min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url("/images/hero-renewable-energy.jpg")'
        }}
      >
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            The Future of{' '}
            <span className="text-green-400">Sustainable</span> Living
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover eco-friendly products, renewable energy solutions, and AI-powered recommendations 
            for sustainable living. Join thousands in building a greener future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/voice-search"
              className="inline-flex items-center px-8 py-4 rounded-lg text-lg font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Mic className="w-5 h-5 mr-2" />
              Try Voice Search
            </Link>
            <Link
              to="/ai-studio"
              className="inline-flex items-center px-8 py-4 rounded-lg text-lg font-semibold text-white bg-green-600 hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Explore AI Studio
            </Link>
          </div>
        </div>
      </div>

      {/* Statistics Section - Trusted by Thousands */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Trusted by Thousands</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join our community of eco-conscious consumers making a positive impact
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">10K+</div>
              <div className="text-gray-600 font-medium text-lg">Eco Products</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600 font-medium text-lg">Sustainable Brands</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">95%</div>
              <div className="text-gray-600 font-medium text-lg">Customer Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-orange-600 mb-2">50K+</div>
              <div className="text-gray-600 font-medium text-lg">Happy Customers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover sustainable products across our curated categories
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: 'Product Reviews',
                slug: 'reviews',
                description: 'In-depth reviews of eco-friendly products',
                image: '/images/category-product-reviews.jpg'
              },
              {
                name: 'Renewable Energy',
                slug: 'renewable-energy',
                description: 'Solar, wind, and clean energy solutions',
                image: '/images/category-renewable-energy.jpg'
              },
              {
                name: 'Sustainable Living',
                slug: 'sustainable-living',
                description: 'Tips for eco-conscious daily living',
                image: '/images/category-sustainable-living.jpg'
              },
              {
                name: 'Zero Waste',
                slug: 'zero-waste',
                description: 'Minimize waste, maximize impact',
                image: '/images/category-zero-waste.jpg'
              }
            ].map((category) => (
              <Link
                key={category.slug}
                to={`/categories/${category.slug}`}
                className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="aspect-w-16 aspect-h-12 relative overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <span className="text-green-600 font-medium hover:text-green-700 transition-colors">
                    Explore Category →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hand-picked sustainable products for conscious consumers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: 'Solar Power Bank',
                price: '$49.99',
                rating: 5,
                commission: '12%',
                image: '/images/hero-renewable-energy.jpg'
              },
              {
                name: 'Bamboo Kitchen Set',
                price: '$29.99',
                rating: 4,
                commission: '15%',
                image: '/images/category-sustainable-living.jpg'
              },
              {
                name: 'Reusable Water Bottle',
                price: '$19.99',
                rating: 5,
                commission: '10%',
                image: '/images/category-zero-waste.jpg'
              },
              {
                name: 'LED Smart Bulbs',
                price: '$24.99',
                rating: 4,
                commission: '8%',
                image: '/images/category-renewable-energy.jpg'
              }
            ].map((product, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="aspect-w-16 aspect-h-12 relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < product.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">({product.rating}/5)</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-gray-900">{product.price}</span>
                    <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded font-medium">
                      {product.commission} Commission
                    </span>
                  </div>
                  <button className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                    Shop Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced with AI Section */}
      <section className="py-20 bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Enhanced with AI</h2>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              Powerful AI features to help you discover the perfect sustainable products
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Smart Recommendations</h3>
              <p className="text-green-100">
                AI-powered suggestions based on your preferences and sustainability goals
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Intelligent Search</h3>
              <p className="text-green-100">
                Natural language processing to find exactly what you're looking for
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Impact Tracking</h3>
              <p className="text-green-100">
                Monitor your environmental impact and celebrate your sustainable choices
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link
              to="/ai-studio"
              className="inline-flex items-center px-8 py-4 rounded-lg text-lg font-semibold text-green-600 bg-white hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Explore AI Features
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Start Your Sustainable Journey Today
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of eco-conscious consumers making a positive impact on our planet
          </p>
          <Link
            to="/products"
            className="inline-flex items-center px-8 py-4 rounded-lg text-lg font-semibold text-white bg-green-600 hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage