import { useEffect } from 'react'
import { analyticsService } from '../lib/supabase'
import { v4 as uuidv4 } from 'uuid'

interface UseVisitorTrackingOptions {
  autoTrack?: boolean
  trackPageViews?: boolean
}

export function useVisitorTracking(options: UseVisitorTrackingOptions = {}) {
  const { autoTrack = true, trackPageViews = true } = options

  useEffect(() => {
    if (!autoTrack) return

    // Generate or get session ID
    let sessionId = sessionStorage.getItem('acn_session_id')
    if (!sessionId) {
      sessionId = uuidv4()
      sessionStorage.setItem('acn_session_id', sessionId)
    }

    // Track visitor
    const trackVisitor = async () => {
      try {
        const visitorData = {
          sessionId,
          pageVisited: window.location.pathname,
          trafficSource: getTrafficSource(),
          userAgent: navigator.userAgent,
          country: await getCountry(),
          deviceType: getDeviceType()
        }

        await analyticsService.trackVisitor(visitorData)
        console.log('Visitor tracked successfully')
      } catch (error) {
        console.error('Failed to track visitor:', error)
      }
    }

    // Track on initial load
    trackVisitor()

    // Track page views if enabled
    if (trackPageViews) {
      const handlePopState = () => {
        setTimeout(trackVisitor, 100) // Small delay to ensure URL is updated
      }

      window.addEventListener('popstate', handlePopState)
      
      // Override pushState and replaceState to track navigation
      const originalPushState = history.pushState
      const originalReplaceState = history.replaceState

      history.pushState = function(...args) {
        originalPushState.apply(history, args)
        setTimeout(trackVisitor, 100)
      }

      history.replaceState = function(...args) {
        originalReplaceState.apply(history, args)
        setTimeout(trackVisitor, 100)
      }

      return () => {
        window.removeEventListener('popstate', handlePopState)
        history.pushState = originalPushState
        history.replaceState = originalReplaceState
      }
    }
  }, [autoTrack, trackPageViews])
}

function getTrafficSource(): string {
  const referrer = document.referrer
  
  if (!referrer) return 'direct'
  
  try {
    const referrerUrl = new URL(referrer)
    const hostname = referrerUrl.hostname.toLowerCase()
    
    if (hostname.includes('google')) return 'google'
    if (hostname.includes('facebook') || hostname.includes('fb.com')) return 'facebook'
    if (hostname.includes('twitter') || hostname.includes('t.co')) return 'twitter'
    if (hostname.includes('linkedin')) return 'linkedin'
    if (hostname.includes('youtube')) return 'youtube'
    if (hostname.includes('instagram')) return 'instagram'
    if (hostname.includes('tiktok')) return 'tiktok'
    
    return 'referral'
  } catch {
    return 'unknown'
  }
}

async function getCountry(): Promise<string> {
  try {
    const response = await fetch('https://ipapi.co/json/')
    const data = await response.json()
    return data.country_code || 'unknown'
  } catch {
    return 'unknown'
  }
}

function getDeviceType(): string {
  const userAgent = navigator.userAgent.toLowerCase()
  
  if (/tablet|ipad|playbook|silk/.test(userAgent)) {
    return 'tablet'
  }
  
  if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/.test(userAgent)) {
    return 'mobile'
  }
  
  return 'desktop'
}
