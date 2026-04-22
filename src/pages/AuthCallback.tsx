import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

/**
 * This page handles authentication callbacks from Supabase:
 * - Email confirmation links
 * - Password reset links
 * 
 * The flow:
 * 1. User clicks link in email → redirected here with token in URL
 * 2. This component processes the token
 * 3. User is logged in automatically
 * 4. Redirect to dashboard
 */
export default function AuthCallback() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Supabase automatically handles the token from URL hash
        // when the page loads, it will update the auth session
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          setError(`Authentication error: ${error.message}`)
          return
        }

        if (data?.session) {
          // User is now authenticated, redirect to dashboard
          setTimeout(() => {
            navigate('/', { replace: true })
          }, 500)
        } else {
          // No session yet, stay on login
          setError('Authentication failed. Please try again.')
          setTimeout(() => {
            navigate('/login', { replace: true })
          }, 2000)
        }
      } catch (err) {
        console.error('Callback error:', err)
        setError('An unexpected error occurred')
        setTimeout(() => {
          navigate('/login', { replace: true })
        }, 2000)
      }
    }

    handleCallback()
  }, [navigate])

  return (
    <div className="splash-loading">
      <div className="splash-spinner" />
      <p>Confirming your authentication...</p>
      {error && <p style={{ color: 'var(--red)', marginTop: '12px' }}>{error}</p>}
    </div>
  )
}
