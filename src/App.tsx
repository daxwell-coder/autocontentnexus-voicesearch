import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { Dashboard } from './components/Dashboard'
import { LoginForm } from './components/LoginForm'
import { AdminDashboard } from './pages/AdminDashboard'
import HomePage from './pages/HomePage'
import { AIStudioPage } from './pages/AIStudio'
import ProductsPage from './pages/ProductsPage'
import CategoriesPage from './pages/CategoriesPage'
import { BrandVettingPage, ContentAutomationPage, ResearchAssistantPage, ImpactToolsPage } from './pages/services'
import { useVisitorTracking } from './hooks/useVisitorTracking'
import { LogOut, Home, BarChart3, Users, FileText, Settings, Mail, Phone, MapPin, ExternalLink, Menu, X, Calendar, User, Clock, Mic, ChevronDown, Shield, Zap, BookOpen, TrendingUp } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { contentService } from './services/contentService'

function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          
          {/* Company Info & Quick Links */}
          <div className="space-y-4 sm:space-y-6 col-span-1 sm:col-span-2 lg:col-span-1">
            <div>
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold">AutoContent Nexus</h3>
                  <p className="text-xs sm:text-sm text-gray-300">AI-Powered Sustainability</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Empowering sustainable living through AI-powered product discovery and intelligent content creation.
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-gray-200 uppercase tracking-wider mb-2 sm:mb-3">Quick Links</h4>
              <ul className="space-y-1 sm:space-y-2">
                <li><Link to="/products" className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors block py-1">Products</Link></li>
                <li><Link to="/ai-studio" className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors block py-1">AI Studio</Link></li>
                <li><Link to="/categories" className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors block py-1">Categories</Link></li>
                <li><Link to="/auth" className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors block py-1">Profile</Link></li>
              </ul>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-gray-200 uppercase tracking-wider mb-2 sm:mb-3">Categories</h4>
              <ul className="space-y-1 sm:space-y-2">
                <li><Link to="/categories/reviews" className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors block py-1">Product Reviews</Link></li>
                <li><Link to="/categories/renewable-energy" className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors block py-1">Renewable Energy</Link></li>
                <li><Link to="/categories/sustainable-living" className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors block py-1">Sustainable Living</Link></li>
                <li><Link to="/categories/zero-waste" className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors block py-1">Zero Waste</Link></li>
              </ul>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-gray-200 uppercase tracking-wider mb-2 sm:mb-3">Support</h4>
              <ul className="space-y-1 sm:space-y-2">
                <li><Link to="/help" className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors block py-1">Help Center</Link></li>
                <li><Link to="/contact" className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors block py-1">Contact Us</Link></li>
                <li><Link to="/privacy" className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors block py-1">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors block py-1">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4 sm:space-y-6 col-span-1 sm:col-span-2 lg:col-span-1">
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-gray-200 uppercase tracking-wider mb-2 sm:mb-3">Contact Info</h4>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400 flex-shrink-0" />
                  <a href="mailto:contact@autocontentnexus.com" className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors break-all">
                    contact@autocontentnexus.com
                  </a>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400 flex-shrink-0" />
                  <a href="tel:+2482713474" className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors">
                    +248 271 3474
                  </a>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-gray-300">
                    Anse Etoile, Mahe<br />Seychelles
                  </span>
                </div>
              </div>
            </div>

            {/* Additional Link */}
            <div>
              <a 
                href="https://chat.minimax.io/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-blue-400 hover:text-blue-300 transition-colors py-1"
              >
                Chat with us <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 text-center sm:text-left">
            <p className="text-xs sm:text-sm text-gray-400">
              © 2025 AutoContent Nexus. Created by MiniMax Agent. All rights reserved.
            </p>
            <p className="text-xs sm:text-sm text-gray-400">
              Powered by AI-driven sustainability solutions
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Public Navigation for non-authenticated users
function PublicNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const servicesRef = useRef<HTMLDivElement>(null)

  // Close services dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setIsServicesOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const serviceItems = [
    {
      title: 'AI Brand Vetting',
      description: 'Verify brand authenticity and sustainability',
      icon: Shield,
      href: '/services/brand-vetting',
      color: 'text-blue-600'
    },
    {
      title: 'Content Automation',
      description: '5x your content output with AI workflows',
      icon: Zap,
      href: '/services/content-automation',
      color: 'text-purple-600'
    },
    {
      title: 'Research Assistant',
      description: 'Academic-quality research in minutes',
      icon: BookOpen,
      href: '/services/research-assistant',
      color: 'text-emerald-600'
    },
    {
      title: 'High-Impact Content Tools',
      description: 'Data visualizations and A/B testing',
      icon: TrendingUp,
      href: '/services/impact-tools',
      color: 'text-orange-600'
    }
  ]

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">AutoContent Nexus</span>
                <p className="text-xs text-gray-500 -mt-1">AI-Powered Sustainability</p>
              </div>
            </Link>
          </div>
          
          {/* Main Navigation - Desktop */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50 transition-colors"
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link
              to="/products"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50 transition-colors"
            >
              <FileText className="h-4 w-4" />
              Products
            </Link>
            
            {/* Services Dropdown */}
            <div className="relative" ref={servicesRef}>
              <button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50 transition-colors"
              >
                <Settings className="h-4 w-4" />
                Services
                <ChevronDown className={`h-4 w-4 transition-transform ${isServicesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Services Dropdown Menu */}
              {isServicesOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
                  <div className="p-4">
                    <div className="text-sm font-semibold text-gray-900 mb-3">AI-Powered Services</div>
                    <div className="space-y-3">
                      {serviceItems.map((item) => {
                        const Icon = item.icon
                        return (
                          <Link
                            key={item.href}
                            to={item.href}
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                            onClick={() => {
                              setIsServicesOpen(false)
                              setIsMobileMenuOpen(false)
                            }}
                          >
                            <div className={`h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-white ${item.color}`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 text-sm">{item.title}</div>
                              <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <Link
              to="/categories"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50 transition-colors"
            >
              <FileText className="h-4 w-4" />
              Categories
            </Link>
            <Link
              to="/ai-studio"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50 transition-colors"
            >
              <Zap className="h-4 w-4" />
              AI Studio
            </Link>
            <Link
              to="/admin"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <Users className="h-4 w-4" />
              Admin Login
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-2">
              <Link
                to="/"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
              <Link
                to="/products"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FileText className="h-4 w-4" />
                Products
              </Link>
              
              {/* Mobile Services Section */}
              <div className="px-4 py-2">
                <div className="text-sm font-semibold text-gray-900 mb-2">Services</div>
                <div className="pl-4 space-y-2">
                  {serviceItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        className="flex items-center gap-2 py-2 text-sm text-gray-600 hover:text-blue-700 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Icon className={`h-4 w-4 ${item.color}`} />
                        {item.title}
                      </Link>
                    )
                  })}
                </div>
              </div>
              
              <Link
                to="/categories"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FileText className="h-4 w-4" />
                Categories
              </Link>
              <Link
                to="/ai-studio"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Zap className="h-4 w-4" />
                AI Studio
              </Link>
              <Link
                to="/admin"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Users className="h-4 w-4" />
                Admin Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

// Admin Navigation for authenticated users
function AdminNavigation() {
  const { user, signOut } = useAuth()

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/admin" className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">AutoContent Nexus</span>
                <p className="text-xs text-gray-500 -mt-1">Admin Dashboard</p>
              </div>
            </Link>
          </div>
          
          {/* Admin Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50 transition-colors"
            >
              <Home className="h-4 w-4" />
              View Site
            </Link>
            <Link
              to="/admin"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200"
            >
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </Link>
            
            {/* User Menu */}
            <div className="flex items-center gap-3 pl-6 ml-6 border-l border-gray-200">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-red-700 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button className="p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100">
              <Settings className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

// Protected Admin Routes Component
function AdminRoutes() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminNavigation />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>
    </div>
  )
}

// Public Layout Component
function PublicLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PublicNavigation />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/ai-studio" element={<AIStudioPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/services/brand-vetting" element={<BrandVettingPage />} />
          <Route path="/services/content-automation" element={<ContentAutomationPage />} />
          <Route path="/services/research-assistant" element={<ResearchAssistantPage />} />
          <Route path="/services/impact-tools" element={<ImpactToolsPage />} />
          <Route path="/categories/reviews" element={<CategoryPage category="Product Reviews" />} />
          <Route path="/categories/renewable-energy" element={<CategoryPage category="Renewable Energy" />} />
          <Route path="/categories/sustainable-living" element={<CategoryPage category="Sustainable Living" />} />
          <Route path="/categories/zero-waste" element={<CategoryPage category="Zero Waste" />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/help/getting-started" element={<GettingStartedPage />} />
          <Route path="/help/ai-studio" element={<AIStudioGuidePage />} />
          <Route path="/help/account" element={<AccountSupportPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/voice-search" element={<VoiceSearchPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

// Main App Content with Public and Admin Routing
function AppContent() {
  // Track visitors automatically
  useVisitorTracking()

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/*" element={<PublicLayout />} />
      
      {/* Admin Routes - Protected */}
      <Route path="/admin/*" element={<AdminRoutes />} />
    </Routes>
  )
}





function CategoryPage({ category }: { category: string }) {
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getCategorySlug = (categoryName: string) => {
    const slugMap: Record<string, string> = {
      'Product Reviews': 'reviews',
      'Renewable Energy': 'renewable-energy', 
      'Sustainable Living': 'sustainable-living',
      'Zero Waste': 'zero-waste'
    }
    return slugMap[categoryName] || categoryName.toLowerCase().replace(/\s+/g, '-')
  }

  useEffect(() => {
    const fetchCategoryArticles = async () => {
      try {
        setLoading(true)
        const categorySlug = getCategorySlug(category)
        const response = await contentService.getPublishedArticlesByCategory(categorySlug, 12, 0)
        
        if (response.success && response.data) {
          setArticles(response.data)
        } else {
          setError(response.error?.message || 'Failed to load category articles')
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred while loading articles')
      } finally {
        setLoading(false)
      }
    }

    fetchCategoryArticles()
  }, [category])

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">Loading...</div>
  }

  if (error) {
    return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">Error: {error}</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{category}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <div key={article.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
            <p className="text-gray-600">{article.excerpt}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// Help Center Page
function HelpPage() {
  const faqData = [
    {
      question: "How does AutoContent Nexus work?",
      answer: "AutoContent Nexus is an AI-powered platform that helps you discover sustainable products, create content, and make eco-friendly choices. Our AI analyzes products for sustainability, generates reviews, and provides personalized recommendations."
    },
    {
      question: "How do I earn affiliate commissions?",
      answer: "Sign up for an admin account, create and publish content through our AI Studio, and earn commissions when readers purchase products through your affiliate links. We support multiple affiliate networks including AWIN."
    },
    {
      question: "What makes a product sustainable?",
      answer: "Our AI evaluates products based on environmental impact, materials used, manufacturing processes, packaging, and company sustainability practices. We provide detailed sustainability scores and explanations."
    },
    {
      question: "Can I use my own affiliate links?",
      answer: "Yes! Admin users can integrate their own affiliate network accounts and use custom affiliate links within the content creation process."
    },
    {
      question: "How accurate are the AI-generated reviews?",
      answer: "Our AI analyzes multiple data sources including product specifications, user reviews, expert opinions, and sustainability databases to generate comprehensive and accurate reviews."
    },
    {
      question: "Is there a mobile app?",
      answer: "Currently, AutoContent Nexus is optimized as a responsive web application. We're working on native mobile apps for iOS and Android, coming soon."
    }
  ]

  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Help Center</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Find answers to common questions and get the support you need
          </p>
        </div>
      </section>

      {/* Quick Help Cards */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Getting Started</h3>
              <p className="text-gray-600 mb-4">Learn the basics of using our platform</p>
              <Link to="/help/getting-started" className="text-green-600 font-medium hover:text-green-700">
                Read Guide →
              </Link>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Studio Guide</h3>
              <p className="text-gray-600 mb-4">Master our AI content creation tools</p>
              <Link to="/help/ai-studio" className="text-blue-600 font-medium hover:text-blue-700">
                Learn More →
              </Link>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300">
              <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Account Support</h3>
              <p className="text-gray-600 mb-4">Manage your account and settings</p>
              <Link to="/help/account" className="text-purple-600 font-medium hover:text-purple-700">
                Get Help →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Quick answers to common questions</p>
          </div>
          
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-lg">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-100 transition-colors rounded-lg"
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  <span className="text-gray-500">
                    {openFaq === index ? '−' : '+'}
                  </span>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Still Need Help?</h2>
          <p className="text-lg text-gray-600 mb-8">Our support team is here to assist you</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-4 rounded-lg text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Mail className="w-5 h-5 mr-2" />
              Contact Support
            </Link>
            <a
              href="mailto:contact@autocontentnexus.com"
              className="inline-flex items-center px-8 py-4 rounded-lg text-lg font-semibold text-blue-600 bg-white border border-blue-600 hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Email Us Directly
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

// Contact Page with Professional Form
function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      setSubmitStatus('success')
      setIsSubmitting(false)
      setFormData({ name: '', email: '', subject: '', message: '', inquiryType: 'general' })
    }, 1500)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">
            Get in touch with our team. We're here to help with any questions about sustainable living and our platform.
          </p>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600 mb-4">Send us an email and we'll respond within 24 hours</p>
              <a
                href="mailto:contact@autocontentnexus.com"
                className="text-blue-600 font-medium hover:text-blue-700 break-all"
              >
                contact@autocontentnexus.com
              </a>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-600 mb-4">Speak with our support team directly</p>
              <a
                href="tel:+2482713474"
                className="text-green-600 font-medium hover:text-green-700"
              >
                +248 271 3474
              </a>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300">
              <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Visit Us</h3>
              <p className="text-gray-600 mb-4">Our headquarters location</p>
              <address className="text-purple-600 font-medium not-italic">
                Anse Etoile, Mahe<br />
                Seychelles
              </address>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Send us a Message</h2>
            <p className="text-lg text-gray-600">Fill out the form below and we'll get back to you as soon as possible</p>
          </div>

          {submitStatus === 'success' && (
            <div className="mb-8 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              <p className="font-semibold">Message sent successfully!</p>
              <p>Thank you for contacting us. We'll respond within 24 hours.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Your full name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="inquiryType" className="block text-sm font-medium text-gray-700 mb-2">
                Inquiry Type
              </label>
              <select
                id="inquiryType"
                name="inquiryType"
                value={formData.inquiryType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="general">General Inquiry</option>
                <option value="support">Technical Support</option>
                <option value="partnership">Partnership Opportunities</option>
                <option value="affiliate">Affiliate Program</option>
                <option value="press">Press & Media</option>
              </select>
            </div>
            
            <div className="mb-6">
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Brief description of your inquiry"
              />
            </div>
            
            <div className="mb-8">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
                placeholder="Please provide details about your inquiry..."
              ></textarea>
            </div>
            
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-8 py-4 rounded-lg text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5 mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Additional Support Options */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Other Ways to Reach Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Live Chat</h3>
              <p className="text-gray-600 mb-4">Chat with our AI assistant for instant help</p>
              <a
                href="https://chat.minimax.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700"
              >
                Start Chat <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Help Center</h3>
              <p className="text-gray-600 mb-4">Browse our comprehensive FAQ and guides</p>
              <Link to="/help" className="inline-flex items-center text-green-600 font-medium hover:text-green-700">
                Visit Help Center →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Privacy Policy Page
function PrivacyPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-700 to-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <p className="text-sm text-gray-400 mt-4">Last updated: January 2025</p>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            
            {/* Information We Collect */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">1. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                When you use AutoContent Nexus, we may collect personal information including:
              </p>
              <ul className="list-disc ml-6 text-gray-700 space-y-2 mb-6">
                <li>Name and email address when you create an account</li>
                <li>Contact information when you reach out to us</li>
                <li>Payment information for affiliate commissions (processed securely by third-party providers)</li>
                <li>Profile preferences and settings</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Usage Information</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We automatically collect information about how you use our platform:
              </p>
              <ul className="list-disc ml-6 text-gray-700 space-y-2 mb-6">
                <li>Pages visited and features used</li>
                <li>Search queries and content preferences</li>
                <li>Device information and browser type</li>
                <li>IP address and location data</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </div>

            {/* How We Use Your Information */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">2. How We Use Your Information</h2>
              
              <p className="text-gray-700 mb-4 leading-relaxed">
                We use the information we collect to:
              </p>
              <ul className="list-disc ml-6 text-gray-700 space-y-2 mb-6">
                <li>Provide and improve our AI-powered sustainability platform</li>
                <li>Personalize content recommendations and product suggestions</li>
                <li>Process affiliate commissions and payments</li>
                <li>Communicate with you about your account and our services</li>
                <li>Analyze usage patterns to enhance user experience</li>
                <li>Prevent fraud and ensure platform security</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>

            {/* Sharing Your Information */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">3. Sharing Your Information</h2>
              
              <p className="text-gray-700 mb-4 leading-relaxed">
                We do not sell your personal information. We may share your information with:
              </p>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Service Providers</h3>
              <ul className="list-disc ml-6 text-gray-700 space-y-2 mb-6">
                <li>Cloud hosting services (for platform infrastructure)</li>
                <li>Payment processors (for affiliate commission payments)</li>
                <li>Analytics providers (for usage analysis and improvement)</li>
                <li>Email service providers (for communications)</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Affiliate Partners</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                When you make purchases through affiliate links, we may share necessary information with affiliate networks (such as AWIN) and merchants to track referrals and process commissions.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Legal Requirements</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                We may disclose information when required by law, to protect our rights, or to ensure platform safety and security.
              </p>
            </div>

            {/* Cookies and Tracking */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">4. Cookies and Tracking Technologies</h2>
              
              <p className="text-gray-700 mb-4 leading-relaxed">
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc ml-6 text-gray-700 space-y-2 mb-6">
                <li>Remember your preferences and settings</li>
                <li>Analyze site traffic and usage patterns</li>
                <li>Track affiliate referrals and commissions</li>
                <li>Provide personalized content recommendations</li>
                <li>Ensure platform security and prevent fraud</li>
              </ul>
              
              <p className="text-gray-700 mb-4 leading-relaxed">
                You can control cookies through your browser settings, but disabling them may limit platform functionality.
              </p>
            </div>

            {/* Data Security */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">5. Data Security</h2>
              
              <p className="text-gray-700 mb-4 leading-relaxed">
                We implement industry-standard security measures to protect your information:
              </p>
              <ul className="list-disc ml-6 text-gray-700 space-y-2 mb-6">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security audits and monitoring</li>
                <li>Access controls and authentication systems</li>
                <li>Secure payment processing through certified providers</li>
                <li>Regular data backups and disaster recovery procedures</li>
              </ul>
              
              <p className="text-gray-700 mb-4 leading-relaxed">
                While we take reasonable steps to protect your information, no internet transmission is completely secure. Please use strong passwords and keep your account credentials confidential.
              </p>
            </div>

            {/* Your Rights and Choices */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">6. Your Rights and Choices</h2>
              
              <p className="text-gray-700 mb-4 leading-relaxed">
                You have the right to:
              </p>
              <ul className="list-disc ml-6 text-gray-700 space-y-2 mb-6">
                <li>Access and review your personal information</li>
                <li>Correct inaccurate or incomplete data</li>
                <li>Delete your account and associated data</li>
                <li>Opt out of marketing communications</li>
                <li>Request data portability where technically feasible</li>
                <li>Object to certain data processing activities</li>
              </ul>
              
              <p className="text-gray-700 mb-4 leading-relaxed">
                To exercise these rights, please contact us at{' '}
                <a href="mailto:admin@autocontentnexus.com" className="text-blue-600 hover:text-blue-700">
                  admin@autocontentnexus.com
                </a>.
              </p>
            </div>

            {/* Data Retention */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">7. Data Retention</h2>
              
              <p className="text-gray-700 mb-4 leading-relaxed">
                We retain your information for as long as necessary to:
              </p>
              <ul className="list-disc ml-6 text-gray-700 space-y-2 mb-6">
                <li>Provide our services and maintain your account</li>
                <li>Process affiliate commissions and payments</li>
                <li>Comply with legal and regulatory requirements</li>
                <li>Resolve disputes and enforce agreements</li>
              </ul>
              
              <p className="text-gray-700 mb-4 leading-relaxed">
                When you delete your account, we will remove or anonymize your personal information within 30 days, except where longer retention is required by law.
              </p>
            </div>

            {/* Children's Privacy */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">8. Children's Privacy</h2>
              
              <p className="text-gray-700 mb-4 leading-relaxed">
                AutoContent Nexus is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
              </p>
            </div>

            {/* International Data Transfers */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">9. International Data Transfers</h2>
              
              <p className="text-gray-700 mb-4 leading-relaxed">
                Our services are based in Seychelles. If you access our platform from other countries, your information may be transferred to, stored, and processed in Seychelles and other countries where our service providers operate. We ensure appropriate safeguards are in place for international transfers.
              </p>
            </div>

            {/* Changes to This Policy */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">10. Changes to This Policy</h2>
              
              <p className="text-gray-700 mb-4 leading-relaxed">
                We may update this privacy policy from time to time. We will notify you of significant changes by email or through our platform. The "Last Updated" date at the top of this policy indicates when it was last revised.
              </p>
            </div>

            {/* Contact Information */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">11. Contact Us</h2>
              
              <p className="text-gray-700 mb-4 leading-relaxed">
                If you have questions about this privacy policy or our data practices, please contact us:
              </p>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700 mb-2"><strong>Email:</strong> admin@autocontentnexus.com</p>
                <p className="text-gray-700 mb-2"><strong>General Contact:</strong> contact@autocontentnexus.com</p>
                <p className="text-gray-700 mb-2"><strong>Phone:</strong> +248 271 3474</p>
                <p className="text-gray-700">
                  <strong>Address:</strong><br />
                  AutoContent Nexus<br />
                  Anse Etoile, Mahe<br />
                  Seychelles
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Terms of Service Page
function TermsPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-700 to-purple-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms of Service</h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
            Please read these terms carefully before using AutoContent Nexus. By using our platform, you agree to these terms.
          </p>
          <p className="text-sm text-indigo-300 mt-4">Last updated: January 2025</p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            
            {/* Acceptance of Terms */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">1. Acceptance of Terms</h2>
              
              <p className="text-gray-700 mb-4 leading-relaxed">
                By accessing or using AutoContent Nexus ("the Platform"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Platform.
              </p>
              
              <p className="text-gray-700 mb-4 leading-relaxed">
                These Terms apply to all users, including visitors, registered users, and administrators. We reserve the right to modify these Terms at any time, and your continued use of the Platform constitutes acceptance of any changes.
              </p>
            </div>

            {/* Description of Service */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">2. Description of Service</h2>
              
              <p className="text-gray-700 mb-4 leading-relaxed">
                AutoContent Nexus is an AI-powered platform that provides:
              </p>
              <ul className="list-disc ml-6 text-gray-700 space-y-2 mb-6">
                <li>Sustainable product discovery and recommendations</li>
                <li>AI-generated content creation tools</li>
                <li>Affiliate marketing opportunities and commission tracking</li>
                <li>Product reviews and sustainability analysis</li>
                <li>Content management and publishing capabilities</li>
              </ul>
              
              <p className="text-gray-700 mb-4 leading-relaxed">
                We may modify, suspend, or discontinue any aspect of our service at any time without notice.
              </p>
            </div>

            {/* User Accounts and Responsibilities */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">3. User Accounts and Responsibilities</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Account Creation</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                To access certain features, you must create an account. You are responsible for:
              </p>
              <ul className="list-disc ml-6 text-gray-700 space-y-2 mb-6">
                <li>Providing accurate and complete information</li>
                <li>Maintaining the security of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized access</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Acceptable Use</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                You agree to use the Platform only for lawful purposes and in accordance with these Terms. You must not:
              </p>
              <ul className="list-disc ml-6 text-gray-700 space-y-2 mb-6">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Upload malicious code or attempt to harm our systems</li>
                <li>Engage in fraudulent or deceptive practices</li>
                <li>Harass, abuse, or spam other users</li>
                <li>Create multiple accounts to circumvent restrictions</li>
                <li>Use automated systems to access the Platform without permission</li>
              </ul>
            </div>

            {/* Content and Intellectual Property */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">4. Content and Intellectual Property</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Content</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                You retain ownership of content you create and publish on the Platform. By publishing content, you grant us a worldwide, non-exclusive, royalty-free license to use, display, and distribute your content in connection with our services.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Platform Content</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                All Platform features, technology, and AI-generated content remain our intellectual property. You may not:
              </p>
              <ul className="list-disc ml-6 text-gray-700 space-y-2 mb-6">
                <li>Copy, modify, or create derivative works of our Platform</li>
                <li>Reverse engineer or attempt to extract source code</li>
                <li>Remove or alter copyright notices or branding</li>
                <li>Use our trademarks without written permission</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-4">AI-Generated Content</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Content generated by our AI tools is provided "as is." While we strive for accuracy, you are responsible for reviewing and verifying all AI-generated content before publication or use.
              </p>
            </div>

            {/* Affiliate Program Terms */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">5. Affiliate Program Terms</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Participation</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Participation in our affiliate program is subject to approval. You must:
              </p>
              <ul className="list-disc ml-6 text-gray-700 space-y-2 mb-6">
                <li>Comply with all affiliate network terms and conditions</li>
                <li>Provide accurate tax and payment information</li>
                <li>Maintain high-quality, honest content standards</li>
                <li>Disclose affiliate relationships in accordance with FTC guidelines</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Commission Structure</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Commission rates vary by merchant and are subject to change. Commissions are paid according to the terms of the relevant affiliate network (such as AWIN). We are not responsible for commission disputes with affiliate networks or merchants.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Prohibited Practices</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                You may not engage in:
              </p>
              <ul className="list-disc ml-6 text-gray-700 space-y-2 mb-6">
                <li>Self-referrals or fraudulent transactions</li>
                <li>Trademark bidding on merchant brand terms</li>
                <li>Misleading advertising or false claims</li>
                <li>Cookie stuffing or other deceptive practices</li>
                <li>Violation of any affiliate network policies</li>
              </ul>
            </div>

            {/* Privacy and Data */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">6. Privacy and Data</h2>
              
              <p className="text-gray-700 mb-4 leading-relaxed">
                Your privacy is important to us. Our data collection and use practices are detailed in our{' '}
                <Link to="/privacy" className="text-blue-600 hover:text-blue-700">Privacy Policy</Link>, which forms part of these Terms.
              </p>
              
              <p className="text-gray-700 mb-4 leading-relaxed">
                By using our Platform, you consent to our data practices as described in the Privacy Policy.
              </p>
            </div>

            {/* Disclaimers and Limitations */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">7. Disclaimers and Limitations</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Service Availability</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                The Platform is provided "as is" without warranties of any kind. We do not guarantee uninterrupted service or error-free operation.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Content Accuracy</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                While we strive for accuracy in product information and AI-generated content, we make no warranties about completeness, reliability, or accuracy. Users should verify information independently.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Third-Party Links</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Our Platform contains links to third-party websites and services. We are not responsible for the content, privacy practices, or terms of these external sites.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Limitation of Liability</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                To the fullest extent permitted by law, AutoContent Nexus shall not be liable for any indirect, incidental, consequential, or punitive damages arising from your use of the Platform.
              </p>
            </div>

            {/* Termination */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">8. Termination</h2>
              
              <p className="text-gray-700 mb-4 leading-relaxed">
                Either party may terminate this agreement at any time. We may suspend or terminate your account immediately if you violate these Terms. Upon termination:
              </p>
              <ul className="list-disc ml-6 text-gray-700 space-y-2 mb-6">
                <li>Your right to use the Platform ceases immediately</li>
                <li>We may delete your account and associated data</li>
                <li>Outstanding commission payments will be processed according to affiliate network terms</li>
                <li>Provisions regarding intellectual property and limitation of liability survive termination</li>
              </ul>
            </div>

            {/* Governing Law */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">9. Governing Law and Disputes</h2>
              
              <p className="text-gray-700 mb-4 leading-relaxed">
                These Terms are governed by the laws of Seychelles. Any disputes arising from these Terms or use of the Platform will be resolved through binding arbitration in Seychelles, except where prohibited by local law.
              </p>
              
              <p className="text-gray-700 mb-4 leading-relaxed">
                Before pursuing formal dispute resolution, we encourage users to contact our support team to resolve issues amicably.
              </p>
            </div>

            {/* Changes to Terms */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">10. Changes to These Terms</h2>
              
              <p className="text-gray-700 mb-4 leading-relaxed">
                We may update these Terms from time to time to reflect changes in our services or legal requirements. We will notify users of significant changes through email or Platform notifications.
              </p>
              
              <p className="text-gray-700 mb-4 leading-relaxed">
                Your continued use of the Platform after changes become effective constitutes acceptance of the updated Terms.
              </p>
            </div>

            {/* Contact Information */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">11. Contact Information</h2>
              
              <p className="text-gray-700 mb-4 leading-relaxed">
                If you have questions about these Terms, please contact us:
              </p>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700 mb-2"><strong>Email:</strong> legal@autocontentnexus.com</p>
                <p className="text-gray-700 mb-2"><strong>General Contact:</strong> contact@autocontentnexus.com</p>
                <p className="text-gray-700 mb-2"><strong>Phone:</strong> +248 271 3474</p>
                <p className="text-gray-700">
                  <strong>Address:</strong><br />
                  AutoContent Nexus<br />
                  Anse Etoile, Mahe<br />
                  Seychelles
                </p>
              </div>
            </div>

            {/* Additional Information */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">12. Miscellaneous</h2>
              
              <p className="text-gray-700 mb-4 leading-relaxed">
                If any provision of these Terms is found unenforceable, the remaining provisions will remain in full effect. Our failure to enforce any right or provision does not constitute a waiver of that right or provision.
              </p>
              
              <p className="text-gray-700 mb-4 leading-relaxed">
                These Terms constitute the entire agreement between you and AutoContent Nexus regarding use of the Platform.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Help Guide Pages
function GettingStartedPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Getting Started Guide</h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">
            Learn the basics of using AutoContent Nexus for sustainable living
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Welcome to AutoContent Nexus!</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">1. Explore Our Content Categories</h3>
                <p className="text-gray-700 mb-4">
                  AutoContent Nexus organizes content into four specialized categories designed to support your sustainable living journey:
                </p>
                <ul className="list-disc ml-6 text-gray-700 space-y-2 mb-4">
                  <li><strong>Product Reviews:</strong> In-depth analyses of eco-friendly products, including sustainability scores, environmental impact assessments, and honest user experiences</li>
                  <li><strong>Renewable Energy:</strong> Comprehensive guides on solar, wind, hydroelectric, and emerging clean energy technologies for homes and businesses</li>
                  <li><strong>Sustainable Living:</strong> Practical tips for reducing your carbon footprint, including home efficiency, sustainable transportation, and mindful consumption</li>
                  <li><strong>Zero Waste:</strong> Strategies for minimizing waste through the 5 R's (Refuse, Reduce, Reuse, Recycle, Rot), DIY solutions, and plastic-free alternatives</li>
                </ul>
                <Link to="/categories" className="text-green-600 font-medium hover:text-green-700">
                  Explore All Categories →
                </Link>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">2. Use AI-Powered Voice Search</h3>
                <p className="text-gray-700 mb-4">
                  Our advanced voice search feature allows you to find relevant content simply by speaking your query. This innovative tool uses artificial intelligence to understand natural language and match you with the most relevant articles and product reviews.
                </p>
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Voice Search Tips:</h4>
                  <ul className="list-disc ml-4 text-blue-800 space-y-1">
                    <li>Speak clearly and avoid background noise</li>
                    <li>Use specific terms like "solar panel efficiency" or "zero waste kitchen"</li>
                    <li>Try different phrasings if you don't find what you're looking for</li>
                    <li>Works best in Chrome, Safari, and Edge browsers</li>
                  </ul>
                </div>
                <Link to="/voice-search" className="text-green-600 font-medium hover:text-green-700">
                  Try Voice Search Now →
                </Link>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">3. Create Your Administrator Account</h3>
                <p className="text-gray-700 mb-4">
                  Unlock the full potential of AutoContent Nexus by creating an administrator account. This gives you access to advanced features including:
                </p>
                <ul className="list-disc ml-6 text-gray-700 space-y-2 mb-4">
                  <li><strong>AI Studio:</strong> Create compelling content using our AI-powered writing tools</li>
                  <li><strong>Analytics Dashboard:</strong> Track your content performance and affiliate earnings</li>
                  <li><strong>Affiliate Management:</strong> Connect your AWIN and other affiliate network accounts</li>
                  <li><strong>Content Publishing:</strong> Publish articles and reviews to help others make sustainable choices</li>
                  <li><strong>Revenue Tracking:</strong> Monitor your commission earnings and optimize your content strategy</li>
                </ul>
                <Link to="/admin" className="text-green-600 font-medium hover:text-green-700">
                  Create Account →
                </Link>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">4. Understanding Our AI-Powered Recommendations</h3>
                <p className="text-gray-700 mb-4">
                  AutoContent Nexus uses advanced artificial intelligence to analyze thousands of products and provide personalized recommendations based on:
                </p>
                <ul className="list-disc ml-6 text-gray-700 space-y-2 mb-4">
                  <li>Environmental impact assessments and lifecycle analyses</li>
                  <li>Material sustainability ratings and ethical sourcing practices</li>
                  <li>User reviews and real-world performance data</li>
                  <li>Your browsing history and interests (if logged in)</li>
                  <li>Current sustainability trends and innovations</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">5. Getting the Most from Product Reviews</h3>
                <p className="text-gray-700 mb-4">
                  Our product reviews go beyond simple ratings. Each review includes:
                </p>
                <div className="bg-green-50 rounded-lg p-4">
                  <ul className="list-disc ml-4 text-green-800 space-y-2">
                    <li><strong>Sustainability Score:</strong> Our proprietary rating system (1-10) based on environmental impact</li>
                    <li><strong>Materials Analysis:</strong> Detailed breakdown of materials used and their eco-friendliness</li>
                    <li><strong>Lifecycle Assessment:</strong> From production to disposal, understanding the complete environmental footprint</li>
                    <li><strong>Price-Value Ratio:</strong> Balancing cost with environmental and social benefits</li>
                    <li><strong>Alternative Recommendations:</strong> Similar products that might better fit your needs and budget</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-200">
              <Link to="/help" className="text-blue-600 font-medium hover:text-blue-700">
                ← Back to Help Center
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function AIStudioGuidePage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">AI Studio Guide</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Master our AI-powered content creation tools for sustainable marketing
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">AI Content Creation Tools</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">1. AI Product Analysis Engine</h3>
                <p className="text-gray-700 mb-4">
                  Our sophisticated AI analyzes products across multiple dimensions to provide comprehensive sustainability assessments:
                </p>
                <div className="bg-blue-50 rounded-lg p-6 mb-4">
                  <h4 className="font-semibold text-blue-900 mb-3">Analysis Criteria:</h4>
                  <ul className="list-disc ml-4 text-blue-800 space-y-2">
                    <li><strong>Material Composition:</strong> Evaluates the sustainability of raw materials, recycled content, and biodegradability</li>
                    <li><strong>Manufacturing Process:</strong> Assesses energy usage, water consumption, and emissions during production</li>
                    <li><strong>Supply Chain Ethics:</strong> Reviews fair trade practices, worker conditions, and corporate responsibility</li>
                    <li><strong>Packaging Impact:</strong> Analyzes packaging materials, waste generation, and shipping efficiency</li>
                    <li><strong>Product Lifecycle:</strong> Considers durability, repairability, and end-of-life disposal options</li>
                    <li><strong>Performance vs. Alternatives:</strong> Compares effectiveness against traditional non-sustainable options</li>
                  </ul>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">2. Content Generation Capabilities</h3>
                <p className="text-gray-700 mb-4">
                  Create compelling, accurate, and SEO-optimized content with our advanced AI writing tools:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-green-50 rounded-lg p-4">
                    <h5 className="font-semibold text-green-900 mb-2">Product Reviews</h5>
                    <ul className="text-green-800 text-sm space-y-1">
                      <li>• Detailed feature analysis</li>
                      <li>• Pros and cons breakdown</li>
                      <li>• Comparison with competitors</li>
                      <li>• Sustainability scoring</li>
                      <li>• User experience insights</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h5 className="font-semibold text-purple-900 mb-2">Educational Articles</h5>
                    <ul className="text-purple-800 text-sm space-y-1">
                      <li>• How-to guides and tutorials</li>
                      <li>• Industry trend analysis</li>
                      <li>• Scientific explanations</li>
                      <li>• Case studies and examples</li>
                      <li>• Actionable tips and advice</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h5 className="font-semibold text-yellow-900 mb-2">Content Optimization Features:</h5>
                  <ul className="list-disc ml-4 text-yellow-800 space-y-1">
                    <li>SEO keyword integration and optimization</li>
                    <li>Readability scoring and improvement suggestions</li>
                    <li>Fact-checking and source verification</li>
                    <li>Tone adjustment for target audience</li>
                    <li>Automated meta descriptions and titles</li>
                  </ul>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">3. Advanced Affiliate Integration</h3>
                <p className="text-gray-700 mb-4">
                  Maximize your earning potential while maintaining authenticity and trust with your audience:
                </p>
                <div className="space-y-4">
                  <div className="border-l-4 border-green-500 pl-4">
                    <h5 className="font-semibold text-gray-900 mb-2">AWIN Network Integration</h5>
                    <p className="text-gray-700 text-sm mb-2">Seamlessly connect your AWIN advertiser account to access thousands of sustainable brands:</p>
                    <ul className="list-disc ml-4 text-gray-700 text-sm space-y-1">
                      <li>Automatic product data synchronization</li>
                      <li>Real-time commission rate updates</li>
                      <li>Performance tracking and analytics</li>
                      <li>Compliance monitoring and FTC disclosure</li>
                    </ul>
                  </div>
                  
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h5 className="font-semibold text-gray-900 mb-2">Smart Link Optimization</h5>
                    <p className="text-gray-700 text-sm mb-2">AI-powered affiliate link management for better conversion rates:</p>
                    <ul className="list-disc ml-4 text-gray-700 text-sm space-y-1">
                      <li>Automatic link cloaking and tracking</li>
                      <li>Geographic targeting for international audiences</li>
                      <li>A/B testing for different link placements</li>
                      <li>Dead link detection and replacement</li>
                    </ul>
                  </div>
                  
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h5 className="font-semibold text-gray-900 mb-2">Revenue Optimization</h5>
                    <p className="text-gray-700 text-sm mb-2">Data-driven insights to maximize your affiliate earnings:</p>
                    <ul className="list-disc ml-4 text-gray-700 text-sm space-y-1">
                      <li>Click-through rate analysis and optimization</li>
                      <li>Conversion funnel tracking and improvement</li>
                      <li>Seasonal trend identification</li>
                      <li>Content performance recommendations</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">4. Analytics and Performance Tracking</h3>
                <p className="text-gray-700 mb-4">
                  Comprehensive insights to optimize your content strategy and maximize impact:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900 mb-2">Content Metrics</h5>
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li>• Page views and engagement</li>
                      <li>• Time on page and bounce rate</li>
                      <li>• Social shares and comments</li>
                      <li>• SEO ranking positions</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900 mb-2">Revenue Tracking</h5>
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li>• Commission earnings by period</li>
                      <li>• Click-to-conversion rates</li>
                      <li>• Top-performing products</li>
                      <li>• Revenue forecasting</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900 mb-2">Audience Insights</h5>
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li>• Demographics and interests</li>
                      <li>• Geographic distribution</li>
                      <li>• Device and browser usage</li>
                      <li>• Customer journey mapping</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-200 text-center">
              <p className="text-gray-600 mb-4">
                Ready to start creating? Sign in to access the AI Studio.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/admin"
                  className="inline-flex items-center px-6 py-3 rounded-lg text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300"
                >
                  Access AI Studio
                </Link>
                <Link to="/help" className="text-blue-600 font-medium hover:text-blue-700">
                  ← Back to Help Center
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function AccountSupportPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Account Support</h1>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto">
            Get help managing your account and settings
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Account Management</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">1. Complete Profile Management</h3>
                <p className="text-gray-700 mb-4">
                  Your profile is the central hub for all your AutoContent Nexus activities. Here's how to maximize its potential:
                </p>
                <div className="bg-purple-50 rounded-lg p-6 mb-4">
                  <h4 className="font-semibold text-purple-900 mb-3">Profile Features:</h4>
                  <ul className="list-disc ml-4 text-purple-800 space-y-2">
                    <li><strong>Account Information:</strong> View and update your email address, password, and basic account details</li>
                    <li><strong>Subscription Status:</strong> Monitor your current plan, usage limits, and upgrade options</li>
                    <li><strong>Activity History:</strong> Track your content creation, publishing schedule, and platform engagement</li>
                    <li><strong>Preferences:</strong> Customize notification settings, content categories, and dashboard layout</li>
                    <li><strong>Security Settings:</strong> Enable two-factor authentication and manage login sessions</li>
                  </ul>
                </div>
                <Link to="/profile" className="text-purple-600 font-medium hover:text-purple-700">
                  Access Your Profile →
                </Link>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">2. Administrator Dashboard Navigation</h3>
                <p className="text-gray-700 mb-4">
                  The admin dashboard provides comprehensive tools for content creators and affiliate marketers. Here's your guide to key sections:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h5 className="font-semibold text-blue-900 mb-2">Content Management</h5>
                    <ul className="text-blue-800 text-sm space-y-1">
                      <li>• Draft, review, and publish articles</li>
                      <li>• Schedule content for optimal timing</li>
                      <li>• Organize content by categories and tags</li>
                      <li>• Track content performance metrics</li>
                      <li>• Collaborate with team members</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <h5 className="font-semibold text-green-900 mb-2">Revenue Analytics</h5>
                    <ul className="text-green-800 text-sm space-y-1">
                      <li>• Real-time commission tracking</li>
                      <li>• Monthly and yearly revenue reports</li>
                      <li>• Top-performing content identification</li>
                      <li>• Conversion rate optimization tools</li>
                      <li>• Payout schedule management</li>
                    </ul>
                  </div>
                </div>
                <Link to="/admin" className="text-purple-600 font-medium hover:text-purple-700">
                  Go to Admin Dashboard →
                </Link>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">3. Troubleshooting Common Issues</h3>
                <p className="text-gray-700 mb-4">
                  Quick solutions to the most frequently encountered problems:
                </p>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900 mb-2">Login and Authentication Issues</h5>
                    <div className="text-gray-700 text-sm space-y-2">
                      <p><strong>Problem:</strong> "Invalid credentials" error when logging in</p>
                      <p><strong>Solution:</strong> Ensure your email is correct and try resetting your password. Clear browser cache and cookies if the issue persists.</p>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900 mb-2">Content Publishing Problems</h5>
                    <div className="text-gray-700 text-sm space-y-2">
                      <p><strong>Problem:</strong> Articles not appearing after publishing</p>
                      <p><strong>Solution:</strong> Check your content status in the dashboard. Ensure all required fields are completed and the article meets our quality guidelines.</p>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900 mb-2">Affiliate Link Issues</h5>
                    <div className="text-gray-700 text-sm space-y-2">
                      <p><strong>Problem:</strong> Affiliate links not tracking properly</p>
                      <p><strong>Solution:</strong> Verify your affiliate network credentials in settings. Ensure cookies are enabled and links are properly formatted.</p>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900 mb-2">Performance and Loading Issues</h5>
                    <div className="text-gray-700 text-sm space-y-2">
                      <p><strong>Problem:</strong> Slow dashboard loading or timeouts</p>
                      <p><strong>Solution:</strong> Try refreshing the page, check your internet connection, or try accessing from a different browser or device.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">4. Getting Professional Support</h3>
                <p className="text-gray-700 mb-4">
                  When you need personalized assistance, our support team is ready to help:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-red-50 rounded-lg p-4">
                    <h5 className="font-semibold text-red-900 mb-2">Urgent Issues</h5>
                    <p className="text-red-800 text-sm mb-2">For critical problems affecting your earnings or content:</p>
                    <ul className="text-red-800 text-sm space-y-1">
                      <li>• Email: admin@autocontentnexus.com</li>
                      <li>• Expected response: Within 4 hours</li>
                      <li>• Include: Screenshot, error message, account email</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h5 className="font-semibold text-blue-900 mb-2">General Inquiries</h5>
                    <p className="text-blue-800 text-sm mb-2">For questions about features, best practices, or guidance:</p>
                    <ul className="text-blue-800 text-sm space-y-1">
                      <li>• Use our contact form for detailed requests</li>
                      <li>• Expected response: Within 24 hours</li>
                      <li>• Include: Specific questions, account context</li>
                    </ul>
                  </div>
                </div>
                <Link to="/contact" className="text-purple-600 font-medium hover:text-purple-700">
                  Contact Support Team →
                </Link>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">5. Account Security and Privacy</h3>
                <p className="text-gray-700 mb-4">
                  Protecting your account and data is our top priority. Here's how we keep you secure:
                </p>
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Security Features:</h4>
                  <ul className="list-disc ml-4 text-gray-700 space-y-2">
                    <li><strong>Encryption:</strong> All data is encrypted in transit and at rest using industry-standard protocols</li>
                    <li><strong>Access Control:</strong> Role-based permissions ensure users only access appropriate features</li>
                    <li><strong>Audit Logs:</strong> Comprehensive logging of all account activities for security monitoring</li>
                    <li><strong>Data Backup:</strong> Regular backups ensure your content and data are always protected</li>
                    <li><strong>Privacy Compliance:</strong> Full adherence to GDPR and other international privacy regulations</li>
                  </ul>
                </div>
                <div className="mt-4">
                  <Link to="/privacy" className="text-purple-600 font-medium hover:text-purple-700">
                    Read Full Privacy Policy →
                  </Link>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">6. Account Deletion and Data Export</h3>
                <p className="text-gray-700 mb-4">
                  You have full control over your account and data:
                </p>
                <div className="border border-yellow-300 bg-yellow-50 rounded-lg p-4">
                  <h5 className="font-semibold text-yellow-900 mb-2">Data Rights:</h5>
                  <ul className="list-disc ml-4 text-yellow-800 space-y-1">
                    <li><strong>Data Export:</strong> Request a complete export of your account data and content</li>
                    <li><strong>Account Deletion:</strong> Permanently delete your account and all associated data</li>
                    <li><strong>Content Ownership:</strong> You retain full rights to your original content</li>
                    <li><strong>Processing Time:</strong> Requests are typically processed within 7-14 business days</li>
                  </ul>
                </div>
                <p className="text-gray-700 text-sm mt-4">
                  To exercise these rights, contact our support team at admin@autocontentnexus.com with your request and account verification.
                </p>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-200">
              <Link to="/help" className="text-blue-600 font-medium hover:text-blue-700">
                ← Back to Help Center
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Profile Page Component
function ProfilePage() {
  const { user, loading, signOut } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setIsSigningOut(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">My Profile</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Access your account to manage your sustainability journey
            </p>
          </div>
        </section>

        {/* Sign In Prompt */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h2>
              <p className="text-gray-700 mb-8">
                Please sign in to access your profile and manage your account settings.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/admin"
                  className="inline-flex items-center px-8 py-4 rounded-lg text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <User className="w-5 h-5 mr-2" />
                  Sign In
                </Link>
                <Link
                  to="/"
                  className="inline-flex items-center px-8 py-4 rounded-lg text-lg font-semibold text-blue-600 bg-white border border-blue-600 hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">My Profile</h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">
            Welcome back to your sustainability dashboard
          </p>
        </div>
      </section>

      {/* Profile Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            {/* Profile Header */}
            <div className="flex items-center justify-center mb-8">
              <div className="h-20 w-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <User className="h-10 w-10 text-white" />
              </div>
            </div>

            {/* User Information */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Information</h2>
              <p className="text-gray-600">Your AutoContent Nexus profile details</p>
            </div>

            {/* Profile Details */}
            <div className="max-w-md mx-auto space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span className="text-lg font-medium text-gray-900">{user.email}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Type
                </label>
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-5 w-5 text-gray-400" />
                  <span className="text-lg font-medium text-gray-900">Administrator</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Member Since
                </label>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span className="text-lg font-medium text-gray-900">
                    {new Date(user.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/admin"
                className="inline-flex items-center px-8 py-4 rounded-lg text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                Go to Dashboard
              </Link>
              
              <button
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="inline-flex items-center px-8 py-4 rounded-lg text-lg font-semibold text-red-600 bg-white border border-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {isSigningOut ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600 mr-3"></div>
                    Signing Out...
                  </>
                ) : (
                  <>
                    <LogOut className="w-5 h-5 mr-2" />
                    Sign Out
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              to="/products"
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Browse Articles</h3>
                  <p className="text-gray-600">Explore our sustainability content</p>
                </div>
              </div>
            </Link>
            
            <Link
              to="/categories"
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Settings className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
                  <p className="text-gray-600">Browse by topic</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

// AI Voice Search Page Component
function VoiceSearchPage() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSupported, setIsSupported] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      setIsSupported(false)
      return
    }

    // Initialize speech recognition
    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
    }

    recognition.onresult = (event: any) => {
      let finalTranscript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript
        }
      }
      if (finalTranscript) {
        setTranscript(finalTranscript.trim())
      }
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.onerror = (event: any) => {
      setError(`Speech recognition error: ${event.error}`)
      setIsListening(false)
    }

    recognitionRef.current = recognition

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [])

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }

  const searchWithTranscript = async () => {
    if (!transcript.trim()) return

    setIsSearching(true)
    try {
      // Implement real search functionality using the contentService
      // This will perform an actual search query against the backend
      const searchQuery = transcript.trim()
      
      // Use contentService to search for articles based on the voice transcript
      const response = await contentService.searchArticles(searchQuery)
      
      if (response.success && response.data) {
        setSearchResults(response.data)
      } else {
        // If search service doesn't exist yet, fall back to filtering published articles
        // but with more sophisticated text matching
        const fallbackResponse = await contentService.getPublishedArticles(50, 0)
        if (fallbackResponse.success && fallbackResponse.data) {
          const keywords = searchQuery.toLowerCase().split(' ')
          const filtered = fallbackResponse.data.filter((article: any) => {
            const searchText = `${article.title} ${article.excerpt} ${article.category}`.toLowerCase()
            return keywords.some(keyword => 
              keyword.length > 2 && searchText.includes(keyword)
            )
          })
          setSearchResults(filtered)
        } else {
          setError('Failed to search articles')
          setSearchResults([])
        }
      }
    } catch (error: any) {
      console.error('Search error:', error)
      setError(`Search failed: ${error.message}`)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const clearResults = () => {
    setTranscript('')
    setSearchResults([])
    setError(null)
  }

  if (!isSupported) {
    return (
      <div className="bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-purple-600 to-pink-700 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">AI Voice Search</h1>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Search our sustainability content using your voice
            </p>
          </div>
        </section>

        {/* Browser Not Supported */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8">
              <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Browser Not Supported</h2>
              <p className="text-gray-700 mb-8">
                Your browser doesn't support speech recognition. Please try using Chrome, Safari, or Edge for the best experience.
              </p>
              <Link
                to="/products"
                className="inline-flex items-center px-8 py-4 rounded-lg text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <FileText className="w-5 h-5 mr-2" />
                Browse Articles Instead
              </Link>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-pink-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">AI Voice Search</h1>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto">
            Search our sustainability content using your voice - just click the microphone and speak
          </p>
        </div>
      </section>

      {/* Voice Search Interface */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-8 text-center">
            {/* Microphone Button */}
            <div className="mb-8">
              <button
                onClick={isListening ? stopListening : startListening}
                disabled={isSearching}
                className={`h-24 w-24 rounded-full border-4 flex items-center justify-center mx-auto transition-all duration-300 ${
                  isListening
                    ? 'bg-red-500 border-red-600 hover:bg-red-600 scale-110 animate-pulse'
                    : 'bg-purple-600 border-purple-700 hover:bg-purple-700 hover:scale-105'
                } disabled:opacity-50 disabled:cursor-not-allowed shadow-lg`}
              >
                <Mic className="h-10 w-10 text-white" />
              </button>
            </div>

            {/* Status Text */}
            <div className="mb-6">
              {isListening && (
                <p className="text-lg font-semibold text-purple-700 animate-pulse">
                  Listening... Speak now!
                </p>
              )}
              {!isListening && !transcript && (
                <p className="text-lg text-gray-600">
                  Click the microphone and tell us what you're looking for
                </p>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                <p className="font-semibold">Error:</p>
                <p>{error}</p>
              </div>
            )}

            {/* Transcript Display */}
            {transcript && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What you said:</h3>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <p className="text-xl text-gray-800 font-medium">"{transcript}"</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {transcript && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={searchWithTranscript}
                  disabled={isSearching}
                  className="inline-flex items-center px-8 py-4 rounded-lg text-lg font-semibold text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {isSearching ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Searching...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="w-5 h-5 mr-2" />
                      Search Now
                    </>
                  )}
                </button>
                
                <button
                  onClick={clearResults}
                  className="inline-flex items-center px-8 py-4 rounded-lg text-lg font-semibold text-gray-600 bg-white border border-gray-600 hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <X className="w-5 h-5 mr-2" />
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Search Results for "{transcript}"
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {searchResults.map((article) => (
                <div key={article.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                  <div className="mb-3">
                    <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                      {article.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{article.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(article.published_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* No Results */}
      {searchResults.length === 0 && transcript && !isSearching && (
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8">
              <div className="h-16 w-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No Results Found</h2>
              <p className="text-gray-700 mb-8">
                We couldn't find any articles matching "{transcript}". Try searching for different keywords or browse our categories.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={clearResults}
                  className="inline-flex items-center px-8 py-4 rounded-lg text-lg font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Mic className="w-5 h-5 mr-2" />
                  Try Again
                </button>
                <Link
                  to="/categories"
                  className="inline-flex items-center px-8 py-4 rounded-lg text-lg font-semibold text-purple-600 bg-white border border-purple-600 hover:bg-purple-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Settings className="w-5 h-5 mr-2" />
                  Browse Categories
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tips Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Voice Search Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Speak Clearly</h3>
              <p className="text-gray-600">Speak in a clear voice and avoid background noise for best results.</p>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Use Keywords</h3>
              <p className="text-gray-600">Try keywords like "solar energy", "zero waste", or "sustainable products".</p>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Be Specific</h3>
              <p className="text-gray-600">More specific queries often yield better, more relevant results.</p>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Try Again</h3>
              <p className="text-gray-600">If you don't get results, try rephrasing your search in different words.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Main App Component
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppContent />
        </div>
      </Router>
    </AuthProvider>
  )
}