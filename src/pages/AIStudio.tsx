import React, { useState } from 'react';
import { ContentGenerationForm } from '../components/ContentGenerationForm';
import { BrandVettingEngine } from '../components/BrandVettingEngine';
import { Sparkles, Users, TrendingUp, CheckCircle2, Zap, Brain, Rocket, Shield } from 'lucide-react';

interface AIStudioProps {
  className?: string;
}

export function AIStudioPage({ className = '' }: AIStudioProps) {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-8 w-8 text-green-600" />
                <h1 className="text-xl font-bold text-gray-900">AutoContent Nexus</h1>
                <span className="text-sm text-gray-500">AI-Powered Sustainability</span>
              </div>
              <nav className="hidden md:flex space-x-6">
                <a href="/" className="text-gray-700 hover:text-gray-900 font-medium">Home</a>
                <a href="/products" className="text-gray-700 hover:text-gray-900 font-medium">Products</a>
                <a href="/categories" className="text-gray-700 hover:text-gray-900 font-medium">Categories</a>
                <a href="/ai-studio" className="bg-green-100 text-green-800 px-3 py-1 rounded-md font-medium">AI Studio</a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* AI Studio Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Enhanced AI Studio</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Transform your ideas into engaging, SEO-optimized content and analyze brand authenticity with our advanced AI-powered suite.
            Create articles, guides, reviews, and get real-time brand sustainability assessments that drive sustainable living forward.
          </p>
          
          {/* Statistics */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="bg-blue-50 rounded-lg p-4 mb-2">
                <div className="text-2xl font-bold text-blue-600">1,247+</div>
              </div>
              <div className="text-sm text-gray-600">Articles Generated</div>
            </div>
            <div className="text-center">
              <div className="bg-green-50 rounded-lg p-4 mb-2">
                <div className="text-2xl font-bold text-green-600">156</div>
              </div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="bg-purple-50 rounded-lg p-4 mb-2">
                <div className="text-2xl font-bold text-purple-600">98.5%</div>
              </div>
              <div className="text-sm text-gray-600">Quality Score</div>
            </div>
          </div>
        </div>

        {/* Content Generation Form */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-8">
          <div className="bg-green-600 text-white px-6 py-4 rounded-t-lg">
            <h2 className="text-xl font-semibold flex items-center">
              <Sparkles className="h-5 w-5 mr-2" />
              AI Content Generator
            </h2>
            <p className="text-green-100 mt-1">Create engaging, SEO-optimized content with AI</p>
          </div>
          
          <div className="p-6">
            <ContentGenerationForm />
          </div>
        </div>

        {/* Brand Vetting Engine */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-8">
          <div className="bg-blue-600 text-white px-6 py-4 rounded-t-lg">
            <h2 className="text-xl font-semibold flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              AI Brand Vetting Engine
            </h2>
            <p className="text-blue-100 mt-1">Analyze brand authenticity and sustainability with real-time AI evaluation</p>
          </div>
          
          <div className="p-6">
            <BrandVettingEngine />
          </div>
        </div>

        {/* MiniMax Premium Features Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg shadow-lg mb-8">
          <div className="px-6 py-4 border-b border-white/20">
            <h2 className="text-xl font-semibold flex items-center">
              <Zap className="h-5 w-5 mr-2 text-yellow-300" />
              MiniMax Premium AI Features
            </h2>
            <p className="text-purple-100 mt-1">Advanced AI-powered capabilities exclusive to MiniMax users</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Multimodal Content Generation */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mr-4">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Multimodal AI Generator</h3>
                    <p className="text-xs text-purple-200">Premium Feature</p>
                  </div>
                </div>
                <p className="text-sm text-purple-100 mb-4">
                  Generate text, images, audio, and video content simultaneously with our advanced MiniMax AI models.
                </p>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-300">Active & Ready</span>
                </div>
              </div>

              {/* Enhanced Text Generation */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center mr-4">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">MiniMax Text Pro</h3>
                    <p className="text-xs text-purple-200">Premium Feature</p>
                  </div>
                </div>
                <p className="text-sm text-purple-100 mb-4">
                  Advanced text generation with 100K+ token context, specialized models for technical writing.
                </p>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-300">Processing 24/7</span>
                </div>
              </div>

              {/* Advanced Image Generation */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-lg flex items-center justify-center mr-4">
                    <Rocket className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">MiniMax Image Pro</h3>
                    <p className="text-xs text-purple-200">Premium Feature</p>
                  </div>
                </div>
                <p className="text-sm text-purple-100 mb-4">
                  Ultra-high resolution images, custom styles, and commercial licensing for business use.
                </p>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-300">High Performance</span>
                </div>
              </div>
            </div>
            
            {/* Premium Status Banner */}
            <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-yellow-400 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-yellow-900" />
                  </div>
                  <div>
                    <h4 className="font-semibold">MiniMax Premium Active</h4>
                    <p className="text-xs text-purple-200">Full access to all advanced AI features</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-yellow-300">Unlimited Usage</p>
                  <p className="text-xs text-purple-200">API Credits: Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Provider Status */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Provider Status</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <Brain className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">Google Gemini Pro</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-600 font-medium">Active</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-900">Anthropic Claude</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-600 font-medium">Active</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <Rocket className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-gray-900">OpenAI GPT-4</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-600 font-medium">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">Start Your Sustainable Journey Today</h3>
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors">
              Start Shopping →
            </button>
          </div>
          <div className="text-center text-gray-400">
            <p className="mb-4">Empowering sustainable living through AI-powered product discovery and intelligent content creation.</p>
            <div className="flex justify-center space-x-6 text-sm">
              <a href="/" className="hover:text-white transition-colors">Products</a>
              <a href="/ai-studio" className="hover:text-white transition-colors">AI Studio</a>
              <a href="/categories" className="hover:text-white transition-colors">Categories</a>
              <a href="/help" className="hover:text-white transition-colors">Help Center</a>
            </div>
            <p className="mt-8 text-xs">© 2025 AutoContent Nexus. All rights reserved. Built for a sustainable future.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
