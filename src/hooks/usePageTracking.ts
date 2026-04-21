import { useEffect } from 'react'
import { trackUserAction } from './useArticles'

/**
 * Hook to track page views. Call this in any page component.
 * @param page - The page path or name (e.g., '/dashboard', '/settings')
 */
export function usePageTracking(page: string) {
  useEffect(() => {
    trackUserAction('view_page', page)
  }, [page])
}
