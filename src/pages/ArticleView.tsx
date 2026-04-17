import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit } from 'lucide-react'
import { useArticle } from '../hooks/useArticles'

export default function ArticleView() {
  const { id: idParam } = useParams<{ id: string }>()
  const id = idParam ? parseInt(idParam) : undefined
  const { article, loading, error } = useArticle(id)
  const navigate = useNavigate()

  if (loading) {
    return <div className="page-loading">Loading…</div>
  }

  if (error || !article) {
    return (
      <div className="page">
        <div className="page-header">
          <button className="btn-ghost" onClick={() => navigate('/articles')}>
            <ArrowLeft size={16} /> Back
          </button>
        </div>
        <div className="empty-state">
          <p>Article not found or you don't have access to it.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      {/* Top bar */}
      <div className="article-view-topbar">
        <button className="btn-ghost" onClick={() => navigate('/articles')}>
          <ArrowLeft size={16} /> Back
        </button>
        <div className="article-view-actions">
          <button className="btn-primary" onClick={() => navigate(`/articles/${article.id}`)} title="Edit this article">
            <Edit size={16} /> Edit
          </button>
        </div>
      </div>

      {/* Article content */}
      <div className="article-view-container">
        {/* Cover image */}
        {article.cover_url && (
          <div className="article-view-cover">
            <img src={article.cover_url} alt={article.title} />
          </div>
        )}

        {/* Title and meta */}
        <div className="article-view-header">
          <h1 className="article-view-title">{article.title}</h1>
          <div className="article-view-meta">
            <span className={`status-badge ${article.status}`}>{article.status}</span>
            <span className="article-view-date">
              {new Date(article.created_at).toLocaleDateString()} 
              {article.created_at !== article.updated_at && 
                ` • Updated ${new Date(article.updated_at).toLocaleDateString()}`}
            </span>
          </div>
          
          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="article-view-tags">
              {article.tags.map(t => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
          )}
        </div>

        {/* Excerpt */}
        {article.excerpt && (
          <div className="article-view-excerpt">
            {article.excerpt}
          </div>
        )}

        {/* Content with rendered HTML (including images) */}
        <div className="article-view-content">
          <div 
            dangerouslySetInnerHTML={{ __html: article.content }}
            className="editor-content-display"
          />
        </div>
      </div>
    </div>
  )
}
