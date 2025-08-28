import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface UserProfile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  is_premium: boolean
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: any
  userProfile: UserProfile | null
  loading: boolean
  isPremium: boolean
  signIn: (email: string, password: string) => Promise<any>
  signOut: () => Promise<any>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Function to fetch user profile data
  async function fetchUserProfile(userId: string) {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        return null
      }

      return profile
    } catch (error) {
      console.error('Profile fetch error:', error)
      return null
    }
  }

  // Function to refresh profile data
  async function refreshProfile() {
    if (user?.id) {
      const profile = await fetchUserProfile(user.id)
      setUserProfile(profile)
    }
  }

  useEffect(() => {
    // Load user on mount
    async function loadUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        
        if (user?.id) {
          const profile = await fetchUserProfile(user.id)
          setUserProfile(profile)
        }
      } finally {
        setLoading(false)
      }
    }
    loadUser()

    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const newUser = session?.user || null
        setUser(newUser)
        
        if (newUser?.id) {
          const profile = await fetchUserProfile(newUser.id)
          setUserProfile(profile)
        } else {
          setUserProfile(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function signIn(email: string, password: string) {
    return await supabase.auth.signInWithPassword({ email, password })
  }

  async function signOut() {
    return await supabase.auth.signOut()
  }

  const isPremium = userProfile?.is_premium || false

  return (
    <AuthContext.Provider value={{ 
      user, 
      userProfile, 
      loading, 
      isPremium, 
      signIn, 
      signOut, 
      refreshProfile 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
