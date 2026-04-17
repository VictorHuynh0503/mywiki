import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage({ type: 'error', text: error.message })

    } else if (mode === 'register') {
      if (password.length < 6) {
        setMessage({ type: 'error', text: 'Password must be at least 6 characters.' })
        setLoading(false)
        return
      }
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setMessage({ type: 'error', text: error.message })
      else setMessage({ type: 'success', text: 'Account created! Check your email to confirm, then log in.' })

    } else if (mode === 'reset') {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      })
      if (error) setMessage({ type: 'error', text: error.message })
      else setMessage({ type: 'success', text: 'Password reset email sent! Check your inbox.' })
    }

    setLoading(false)
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

        <h1 className="auth-title">
          {mode === 'login' && 'Sign in to your wiki'}
          {mode === 'register' && 'Create an account'}
          {mode === 'reset' && 'Reset your password'}
        </h1>
        <p className="auth-subtitle">
          {mode === 'login' && 'Enter your credentials to continue'}
          {mode === 'register' && 'Get started for free today'}
          {mode === 'reset' && "We'll send you a reset link"}
        </p>

        {message && (
          <div className={`auth-message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          {mode !== 'reset' && (
            <div className="form-group">
              <div className="form-label-row">
                <label className="form-label">Password</label>
                {mode === 'login' && (
                  <button type="button" className="form-link" onClick={() => { setMode('reset'); setMessage(null) }}>
                    Forgot password?
                  </button>
                )}
              </div>
              <input
                type="password"
                className="form-input"
                placeholder={mode === 'register' ? 'Min. 6 characters' : '••••••••'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          )}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? (
              <span className="auth-spinner" />
            ) : (
              <>
                {mode === 'login' && 'Sign in'}
                {mode === 'register' && 'Create account'}
                {mode === 'reset' && 'Send reset link'}
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          {mode === 'login' && (
            <p>Don't have an account?{' '}
              <button className="form-link" onClick={() => { setMode('register'); setMessage(null) }}>
                Sign up
              </button>
            </p>
          )}
          {mode === 'register' && (
            <p>Already have an account?{' '}
              <button className="form-link" onClick={() => { setMode('login'); setMessage(null) }}>
                Sign in
              </button>
            </p>
          )}
          {mode === 'reset' && (
            <p>
              <button className="form-link" onClick={() => { setMode('login'); setMessage(null) }}>
                ← Back to sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
