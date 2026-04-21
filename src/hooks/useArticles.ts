import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Article, UserAction } from '../types'

// Track user actions
export async function trackUserAction(
  action: UserAction['action'],
  page: string,
  articleId?: number,
  metadata?: Record<string, any>
) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('user_actions').insert({
      user_id: user.id,
      action,
      page,
      article_id: articleId || null,
      metadata: metadata || null,
      created_at: new Date().toISOString(),
    })
  } catch (err) {
    console.warn('Failed to track action:', err)
  }
}

function isTableMissingError(error: { message?: string; code?: string } | null) {
  if (!error) return false
  return (
    error.message?.includes('schema cache') ||
    error.message?.includes('does not exist') ||
    error.code === '42P01' ||
    error.message?.includes('relation') ||
    error.message?.includes('PGRST200')
  )
}

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tableMissing, setTableMissing] = useState(false)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    setTableMissing(false)

    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('updated_at', { ascending: false })

    if (error) {
      if (isTableMissingError(error)) {
        setTableMissing(true)
        setError('Database tables not set up yet. Please visit the DB Setup page.')
      } else {
        setError(error.message)
      }
      setArticles([])
    } else {
      setArticles((data ?? []) as Article[])
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { articles, loading, error, tableMissing, refresh: fetch }
}

export function useArticle(id: number | undefined) {
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(!!id) // Only loading if we have an id
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) { 
      setLoading(false)
      setArticle(null)
      return 
    }
    
    setLoading(true)
    setError(null)
    
    supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          setError(error.message)
          setArticle(null)
        } else {
          setArticle(data as Article)
          setError(null)
        }
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [id])

  return { article, loading, error }
}

export async function saveArticle(article: Partial<Article> & { id?: string | number }) {
  const { data: { user } } = await supabase.auth.getUser()

  if (article.id) {
    const { data, error } = await supabase
      .from('articles')
      .update({ ...article, updated_at: new Date().toISOString() })
      .eq('id', article.id)
      .select()
      .single()
    return { data, error }
  } else {
    // Create new article - omit ID to let database auto-generate it
    const { title, content, excerpt, cover_url, tags, status } = article
    const { data, error } = await supabase
      .from('articles')
      .insert([{ 
        title,
        content,
        excerpt,
        cover_url,
        tags,
        status,
        user_id: user?.id 
      }])
      .select()
      .single()
    return { data, error }
  }
}

export async function deleteArticle(id: number | string) {
  return supabase.from('articles').delete().eq('id', id)
}

export async function uploadImage(file: File): Promise<string | null> {
  try {
    // Determine file extension
    let ext = file.name.split('.').pop() || 'png'
    // Fallback to png if type doesn't have extension
    if (!ext || ext.length > 4) {
      ext = file.type.split('/')[1] || 'png'
    }
    
    const path = `${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('article-images').upload(path, file)
    
    if (error) {
      console.error('Image upload error:', error.message)
      return null
    }
    
    const { data } = supabase.storage.from('article-images').getPublicUrl(path)
    return data.publicUrl
  } catch (err) {
    console.error('Image upload exception:', err)
    return null
  }
}
