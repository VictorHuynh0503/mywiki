import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Search, Trash2, Edit, Eye } from 'lucide-react'
import { useArticles, deleteArticle, trackUserAction } from '../hooks/useArticles'

export default function ArticleList() {
  const { articles, loading, refresh } = useArticles()
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  // Track page view
  useEffect(() => {
    trackUserAction('view_page', '/articles')
  }, [])

  const filtered = articles.filter(a =>
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    (a.excerpt ?? '').toLowerCase().includes(query.toLowerCase())
  )

  const handleDelete = async (id: number | string) => {
    if (!confirm('Delete this article?')) return
    await deleteArticle(id)
    refresh()
  }

  const handleCardClick = (id: number) => {
    navigate(`/articles/view/${id}`)
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Articles</h1>
          <p className="page-subtitle">{articles.length} articles in your wiki</p>
        </div>
        <Link to="/articles/new" className="btn-primary">
          <Plus size={16} /> New Article
        </Link>
      </div>

      <div className="search-bar">
        <Search size={16} />
        <input
          placeholder="Search articles…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading-rows">
          {[1,2,3,4,5].map(i => <div key={i} className="skeleton-row" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <p>No articles found.</p>
        </div>
      ) : (
        <div className="article-cards">
          {filtered.map(a => (
            <div 
              key={a.id} 
              className="article-card"
              role="button"
              onClick={() => handleCardClick(a.id)}
              style={{ cursor: 'pointer' }}
            >
              {a.cover_url && (
                <div className="article-card-cover">
                  <img src={a.cover_url} alt={a.title} />
                </div>
              )}
              <div className="article-card-body">
                <div className="article-card-top">
                  <span className={`status-badge ${a.status}`}>{a.status}</span>
                  <span className="article-date">{new Date(a.updated_at).toLocaleDateString()}</span>
                </div>
                <h3 className="article-card-title">{a.title || 'Untitled'}</h3>
                {a.excerpt && <p className="article-card-excerpt">{a.excerpt}</p>}
                {a.tags.length > 0 && (
                  <div className="tags">
                    {a.tags.map(t => <span key={t} className="tag">{t}</span>)}
                  </div>
                )}
                <div className="article-card-actions">
                  <button 
                    className="btn-sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCardClick(a.id)
                    }}
                    title="View article"
                  >
                    <Eye size={13} /> View
                  </button>
                  <Link 
                    to={`/articles/${a.id}`} 
                    className="btn-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Edit size={13} /> Edit
                  </Link>
                  <button 
                    className="btn-sm danger" 
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(a.id)
                    }}
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
