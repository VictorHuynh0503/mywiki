import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

/**
 * Password Reset Form Page
 * 
 * This page is shown when a user clicks the password reset link from their email.
 * They can enter their new password here.
 * 
 * Flow:
 * 1. User receives reset email from LoginPage
 * 2. Clicks link in email → redirected here with token in URL hash
 * 3. Supabase auth token is automatically captured
 * 4. User enters new password
 * 5. Submit → password updated in Supabase
 * 6. Auto-login → redirect to dashboard
 */
export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)
  const [isValidSession, setIsValidSession] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(true)

  // Check if user has a valid reset session
  useEffect(() => {
    const checkResetSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          setMessage({
            type: 'error',
            text: 'Invalid reset link or session expired. Please request a new password reset.',
          })
          setIsCheckingSession(false)
          return
        }

        // Check if user has confirmation_sent_at (indicates password reset in progress)
        if (data?.session?.user) {
          setIsValidSession(true)
          setIsCheckingSession(false)
        } else {
          // Likely expired or tampered link
          setMessage({
            type: 'error',
            text: 'Your password reset link has expired. Please request a new one.',
          })
          setIsCheckingSession(false)
          setTimeout(() => {
            navigate('/login', { replace: true })
          }, 3000)
        }
      } catch (err) {
        console.error('Error checking reset session:', err)
        setMessage({ type: 'error', text: 'An error occurred. Please try again.' })
        setIsCheckingSession(false)
      }
    }

    checkResetSession()
  }, [navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    // Validation
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters.' })
      setLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' })
      setLoading(false)
      return
    }

    try {
      // Update the password in Supabase
      const { error } = await supabase.auth.updateUser({ password: newPassword })

      if (error) {
        setMessage({ type: 'error', text: error.message })
        setLoading(false)
        return
      }

      setMessage({
        type: 'success',
        text: '✓ Password updated successfully! Redirecting to dashboard...',
      })

      // Auto-redirect after successful password update
      setTimeout(() => {
        navigate('/', { replace: true })
      }, 1500)
    } catch (err) {
      console.error('Password update error:', err)
      setMessage({
        type: 'error',
        text: 'Failed to update password. Please try again.',
      })
      setLoading(false)
    }
  }

  if (isCheckingSession) {
    return (
      <div className="splash-loading">
        <div className="splash-spinner" />
        <p>Verifying your password reset link...</p>
      </div>
    )
  }

  if (!isValidSession) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <img src="/icon.png" alt="MyWiki" style={{ width: '100%', height: '100%' }} />
            </div>
            <span className="auth-logo-text">MyWiki</span>
          </div>

          <h1 className="auth-title">Reset Link Invalid</h1>
          <p className="auth-subtitle">Your password reset link has expired or is invalid.</p>

          {message && (
            <div className={`auth-message ${message.type}`}>
              {message.text}
            </div>
          )}

          <button
            onClick={() => navigate('/login', { replace: true })}
            className="auth-btn"
            style={{ marginTop: '20px' }}
          >
            Return to Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <img src="/icon.png" alt="MyWiki" style={{ width: '100%', height: '100%' }} />
          </div>
          <span className="auth-logo-text">MyWiki</span>
        </div>

        <h1 className="auth-title">Set Your New Password</h1>
        <p className="auth-subtitle">Create a strong password to secure your account</p>

        {message && (
          <div className={`auth-message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Min. 6 characters"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? (
              <span className="auth-spinner" />
            ) : (
              'Update Password'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            <button
              type="button"
              className="form-link"
              onClick={() => navigate('/login', { replace: true })}
            >
              ← Back to sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
