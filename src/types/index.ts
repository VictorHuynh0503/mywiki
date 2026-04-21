export interface Article {
  id: number
  title: string
  content: string
  excerpt: string | null
  cover_url: string | null
  tags: string[]
  status: 'draft' | 'published'
  publish_type: 'local' | 'community'
  created_at: string
  updated_at: string
}

export interface SheetImport {
  id: number
  name: string
  headers: string[]
  rows: Record<string, string>[]
  source: string | null
  imported_at: string
}

export interface UserProfile {
  id: string // UUID from auth.users
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface UserAction {
  id: number
  user_id: string
  action: 'login' | 'view_article' | 'edit_article' | 'create_article' | 'delete_article' | 'view_page'
  page: string
  article_id?: number | null
  metadata?: Record<string, any> | null
  created_at: string
}
