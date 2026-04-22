/**
 * Authentication Configuration Utility
 * 
 * Handles redirect URLs intelligently:
 * - First: Uses VITE_REDIRECT_URL from .env if explicitly set
 * - Fallback: Auto-detects current domain and builds URL
 * 
 * This ensures the app works on:
 * - Localhost (http://localhost:5173)
 * - Vercel (https://my-app.vercel.app)
 * - Custom domains (https://myapp.com)
 * - Any deployment without manual configuration
 */

/**
 * Get the redirect URL for password reset emails
 * 
 * Priority:
 * 1. If VITE_REDIRECT_URL is set in .env → use it
 * 2. Otherwise → auto-detect from current domain + /reset-password
 * 
 * Examples:
 * - Local: https://localhost:5173/reset-password
 * - Vercel: https://my-app.vercel.app/reset-password
 * - Custom: https://myapp.com/reset-password
 */
export function getResetPasswordRedirectUrl(): string {
  const envUrl = import.meta.env.VITE_REDIRECT_URL

  // If explicitly set in .env, use it as-is
  if (envUrl && typeof envUrl === 'string' && envUrl.trim()) {
    return envUrl
  }

  // Auto-detect: Use current domain + /reset-password
  const baseUrl = window.location.origin
  return `${baseUrl}/reset-password`
}

/**
 * Get the base URL (without path)
 * 
 * Examples:
 * - Local: https://localhost:5173
 * - Vercel: https://my-app.vercel.app
 * - Custom: https://myapp.com
 */
export function getBaseUrl(): string {
  const envUrl = import.meta.env.VITE_REDIRECT_URL

  if (envUrl && typeof envUrl === 'string' && envUrl.trim()) {
    // Extract base URL by removing path components
    const url = new URL(envUrl, window.location.origin)
    return url.origin
  }

  return window.location.origin
}

/**
 * Check if app is running in development (localhost)
 */
export function isDevelopment(): boolean {
  return window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1'
}

/**
 * Log environment info for debugging
 */
export function logAuthConfig(): void {
  if (isDevelopment()) {
    console.log('[Auth Config]', {
      environment: 'development',
      baseUrl: getBaseUrl(),
      resetPasswordUrl: getResetPasswordRedirectUrl(),
      currentOrigin: window.location.origin,
      envViteRedirectUrl: import.meta.env.VITE_REDIRECT_URL || 'not set',
    })
  }
}
