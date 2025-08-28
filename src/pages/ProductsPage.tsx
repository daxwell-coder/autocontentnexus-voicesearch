import React from 'react'
import { Link } from 'react-router-dom'
import { Star, Search, Filter, ShoppingCart } from 'lucide-react'

const ProductsPage: React.FC = () => {
  // Sample products data - in production this would come from API/database
  const products = [
    {
      id: 1,
      name: "Solar Power Bank 20000mAh",
      price: "$49.99",
      originalPrice: "$59.99",
      rating: 5,
      reviews: 234,
      category: "Renewable Energy",
      commission: "12%",
      image: "/images/hero-renewable-energy.jpg",
      description: "Portable solar power bank with wireless charging capability and LED flashlight.",
      inStock: true,
      featured: true
    },
    {
      id: 2,
      name: "Bamboo Kitchen Set (5-Piece)",
      price: "$29.99",
      originalPrice: "$39.99",
      rating: 4,
      reviews: 187,
      category: "Sustainable Living",
      commission: "15%",
      image: "/images/category-sustainable-living.jpg",
      description: "Complete bamboo kitchen utensil set including cutting board, spatulas, and serving spoons.",
      inStock: true,
      featured: false
    },
    {
      id: 3,
      name: "Reusable Water Bottle with Filter",
      price: "$19.99",
      originalPrice: "$24.99",
      rating: 5,
      reviews: 312,
      category: "Zero Waste",
      commission: "10%",
      image: "/images/category-zero-waste.jpg",
      description: "BPA-free stainless steel water bottle with built-in water filtration system.",
      inStock: true,
      featured: false
    },
    {
      id: 4,
      name: "LED Smart Bulbs (4-Pack)",
      price: "$24.99",
      originalPrice: "$34.99",
      rating: 4,
      reviews: 156,
      category: "Renewable Energy",
      commission: "8%",
      image: "/images/category-renewable-energy.jpg",
      description: "WiFi-enabled LED bulbs with dimming and color changing capabilities. Energy efficient.",
      inStock: true,
      featured: false
    },
    {
      id: 5,
      name: "Organic Cotton Tote Bags Set",
      price: "$15.99",
      originalPrice: "$19.99",
      rating: 5,
      reviews: 203,
      category: "Zero Waste",
      commission: "18%",
      image: "/images/category-zero-waste.jpg",
      description: "Set of 3 durable organic cotton tote bags for plastic-free shopping.",
      inStock: true,
      featured: false
    },
    {
      id: 6,
      name: "Solar Garden Lights (8-Pack)",
      price: "$34.99",
      originalPrice: "$44.99",
      rating: 4,
      reviews: 128,
      category: "Renewable Energy",
      commission: "14%",
      image: "/images/hero-renewable-energy.jpg",
      description: "Weather-resistant solar pathway lights with automatic on/off sensors.",
      inStock: true,
      featured: false
    },
    {
      id: 7,
      name: "Eco-Friendly Cleaning Kit",
      price: "$22.99",
      originalPrice: "$28.99",
      rating: 4,
      reviews: 95,
      category: "Sustainable Living",
      commission: "16%",
      image: "/images/category-sustainable-living.jpg",
      description: "Complete natural cleaning solution set with reusable microfiber cloths.",
      inStock: false,
      featured: false
    },
    {
      id: 8,
      name: "Compost Bin with Charcoal Filter",
      price: "$39.99",
      originalPrice: "$49.99",
      rating: 5,
      reviews: 167,
      category: "Zero Waste",
      commission: "13%",
      image: "/images/category-zero-waste.jpg",
      description: "Countertop compost bin with odor-controlling charcoal filter system.",
      inStock: true,
      featured: false
    }
  ]

  const categories = [
    "All Products",
    "Renewable Energy", 
    "Sustainable Living", 
    "Zero Waste"
  ]

  const [selectedCategory, setSelectedCategory] = React.useState("All Products")
  const [searchTerm, setSearchTerm] = React.useState("")
  const [sortBy, setSortBy] = React.useState("featured")

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "All Products" || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return parseFloat(a.price.replace('$', '')) - parseFloat(b.price.replace('$', ''))
      case 'price-high':
        return parseFloat(b.price.replace('$', '')) - parseFloat(a.price.replace('$', ''))
      case 'rating':
        return b.rating - a.rating
      case 'featured':
      default:
        return b.featured ? 1 : -1
    }
  })

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Renewable Energy': 'bg-green-100 text-green-800',
      'Sustainable Living': 'bg-blue-100 text-blue-800',
      'Zero Waste': 'bg-purple-100 text-purple-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-50 to-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Sustainable Products
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Discover eco-friendly products that help you live sustainably while earning commission. 
              From renewable energy solutions to zero-waste essentials.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white shadow-sm border-b py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            
            {/* Filters */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="text-gray-400 h-5 w-5" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {selectedCategory === "All Products" ? "All Products" : `${selectedCategory} Products`}
            <span className="text-gray-500 font-normal ml-2">({sortedProducts.length} products)</span>
          </h2>
          
          {sortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  {/* Product Image */}
                  <div className="relative">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="h-48 w-full object-cover"
                    />
                    {product.featured && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        Featured
                      </div>
                    )}
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-semibold bg-red-600 px-3 py-1 rounded">Out of Stock</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    {/* Category Badge */}
                    <div className="mb-2">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(product.category)}`}>
                        {product.category}
                      </span>
                    </div>
                    
                    {/* Product Name */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    
                    {/* Product Description */}
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    
                    {/* Rating */}
                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < product.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">({product.reviews} reviews)</span>
                    </div>
                    
                    {/* Price and Commission */}
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <span className="text-xl font-bold text-gray-900">{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through ml-2">{product.originalPrice}</span>
                        )}
                      </div>
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded font-medium">
                        {product.commission} Commission
                      </span>
                    </div>
                    
                    {/* Shop Now Button */}
                    <button 
                      className={`w-full py-2 rounded-lg font-semibold transition-colors ${
                        product.inStock 
                          ? 'bg-green-600 text-white hover:bg-green-700' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={!product.inStock}
                    >
                      {product.inStock ? 'Shop Now' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 text-center mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Want to Become an Affiliate?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join our affiliate program and earn commission on every sale. Share sustainable products 
            you love and help others make eco-friendly choices.
          </p>
          <Link
            to="/ai-studio"
            className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
          >
            Learn More About Affiliate Program
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ProductsPage
