export interface Article {
  id: number
  title: string
  content: string
  excerpt: string | null
  cover_url: string | null
  tags: string[]
  status: 'draft' | 'published'
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
