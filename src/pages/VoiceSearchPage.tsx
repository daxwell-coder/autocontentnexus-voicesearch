import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mic, Volume2, MessageSquare, Target, RotateCcw, Sparkles, BarChart3, Search } from 'lucide-react'

export function VoiceSearchPage() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState('')

  const startVoiceSearch = async () => {
    const windowWithSpeech = window as any
    
    try {
      setError('')
      
      // Check if browser supports speech recognition
      if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
        setError('Voice search is not supported in this browser. Please use Chrome, Edge, or Safari.')
        return
      }
      
      // Request microphone permission first
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        // Stop the stream immediately as we only needed permission
        stream.getTracks().forEach(track => track.stop())
        
        // Now start speech recognition
        const SpeechRecognition = windowWithSpeech.webkitSpeechRecognition || windowWithSpeech.SpeechRecognition
        const recognition = new SpeechRecognition()
        
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = 'en-US'
        
        recognition.onstart = () => {
          console.log('Voice search started - listening...')
          setIsListening(true)
          setTranscript('')
          setError('')
        }
        
        recognition.onresult = (event: any) => {
          const result = event.results[0][0].transcript
          console.log('Voice search result:', result)
          setTranscript(result)
          setIsListening(false)
          
          // Redirect to products page with search query after a brief delay
          setTimeout(() => {
            window.location.href = `/products?search=${encodeURIComponent(result)}`
          }, 2000)
        }
        
        recognition.onerror = (event: any) => {
          console.error('Voice search error:', event.error)
          setIsListening(false)
          
          let errorMessage = 'Voice search failed. Please try again.'
          switch (event.error) {
            case 'not-allowed':
              errorMessage = 'Microphone access denied. Please allow microphone permission and try again.'
              break
            case 'no-speech':
              errorMessage = 'No speech detected. Please try again and speak clearly.'
              break
            case 'network':
              errorMessage = 'Network error. Please check your connection and try again.'
              break
            case 'aborted':
              errorMessage = 'Voice search was cancelled.'
              break
          }
          setError(errorMessage)
        }
        
        recognition.onend = () => {
          setIsListening(false)
        }
        
        recognition.start()
        
      } catch (permissionError) {
        console.error('Microphone permission error:', permissionError)
        setError('Microphone access is required for voice search. Please allow microphone permission in your browser settings and try again.')
      }
      
    } catch (error) {
      console.error('Voice search initialization error:', error)
      setError('Voice search could not be initialized. Please ensure you\'re using a supported browser (Chrome, Edge, Safari) and try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Site Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">AutoContent Nexus</h1>
                <span className="text-sm text-gray-500">AI-Powered Sustainability</span>
              </Link>
              <nav className="hidden md:flex space-x-6">
                <Link to="/" className="text-gray-700 hover:text-gray-900 font-medium">Home</Link>
                <Link to="/products" className="text-gray-700 hover:text-gray-900 font-medium">Products</Link>
                <Link to="/categories" className="text-gray-700 hover:text-gray-900 font-medium">Categories</Link>
                <Link to="/ai-studio" className="text-gray-700 hover:text-gray-900 font-medium">AI Studio</Link>
                <Link to="/voice-search" className="bg-purple-100 text-purple-800 px-3 py-1 rounded-md font-medium">Voice Search</Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <Link to="/auth" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">AI Voice Search</h1>
          <h2 className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Search our sustainability content using your voice...
          </h2>
        </div>

        {/* Voice Search Interface */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-8 mb-8">
          <div className="text-center">
            {/* Microphone Button */}
            <div className="mb-8">
              <button
                onClick={startVoiceSearch}
                disabled={isListening}
                className={`relative inline-flex items-center justify-center w-32 h-32 rounded-full transition-all duration-300 transform hover:scale-105 ${
                  isListening 
                    ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                    : 'bg-purple-600 hover:bg-purple-700'
                } text-white shadow-lg hover:shadow-xl`}
              >
                <Mic className="h-12 w-12" />
                {isListening && (
                  <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping"></div>
                )}
              </button>
            </div>

            {/* Status Messages */}
            <div className="mb-6">
              {isListening ? (
                <div className="text-center">
                  <p className="text-lg font-semibold text-red-600 mb-2">Listening... Speak now!</p>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="h-2 w-2 bg-red-500 rounded-full animate-bounce"></div>
                    <div className="h-2 w-2 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="h-2 w-2 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              ) : transcript ? (
                <div className="text-center">
                  <p className="text-lg font-semibold text-green-600 mb-2">Voice search captured:</p>
                  <p className="text-xl text-gray-900 font-medium mb-2">"{transcript}"</p>
                  <p className="text-gray-600">Redirecting to search results...</p>
                </div>
              ) : (
                <p className="text-lg text-gray-700">
                  Click the microphone and tell us what you're looking for
                </p>
              )}
            </div>

            {/* Error Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800 text-sm font-medium">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Voice Search Tips */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
            Voice Search Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Volume2 className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Speak Clearly</h4>
                <p className="text-sm text-gray-600">Speak in a clear, normal voice and avoid background noise when possible.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Use Keywords</h4>
                <p className="text-sm text-gray-600">Use specific keywords like "solar panels", "renewable energy", or "eco-friendly products".</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Target className="h-4 w-4 text-purple-600" />
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Be Specific</h4>
                <p className="text-sm text-gray-600">The more specific your search, the better results you'll get from our AI-powered system.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <RotateCcw className="h-4 w-4 text-orange-600" />
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Try Again</h4>
                <p className="text-sm text-gray-600">If the search doesn't work as expected, try rephrasing your query or speaking more slowly.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Site Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">Start Your Sustainable Journey Today</h3>
            <Link to="/products" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors inline-block">
              Start Shopping
            </Link>
          </div>
          <div className="text-center text-gray-400">
            <p className="mb-4">Empowering sustainable living through AI-powered product discovery and intelligent content creation.</p>
            <div className="flex justify-center space-x-6 text-sm">
              <Link to="/" className="hover:text-white transition-colors">Products</Link>
              <Link to="/ai-studio" className="hover:text-white transition-colors">AI Studio</Link>
              <Link to="/categories" className="hover:text-white transition-colors">Categories</Link>
              <Link to="/voice-search" className="hover:text-white transition-colors">Voice Search</Link>
            </div>
            <p className="mt-8 text-xs">© 2025 AutoContent Nexus. Created by MiniMax Agent. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
