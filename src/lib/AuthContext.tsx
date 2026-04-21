import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from './supabase'

interface AuthContextType {
  session: Session | null
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
})

// Function to create or update user profile in the database
async function upsertUserProfile(user: User) {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .upsert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || null,
        avatar_url: user.user_metadata?.avatar_url || null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' })
    
    if (error && !error.message.includes('does not exist')) {
      console.warn('Could not update user profile:', error)
    }
  } catch (err) {
    console.warn('Error updating user profile:', err)
  }
}

// Function to track login
async function trackLogin(user: User) {
  try {
    await supabase.from('user_actions').insert({
      user_id: user.id,
      action: 'login',
      page: '/login',
      created_at: new Date().toISOString(),
    })
  } catch (err) {
    console.warn('Failed to track login:', err)
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        upsertUserProfile(session.user)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session?.user) {
        upsertUserProfile(session.user)
        // Track login on auth state change (e.g., first time login)
        if (_event === 'SIGNED_IN') {
          trackLogin(session.user)
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setSession(null)
  }

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
