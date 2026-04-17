import { Link } from 'react-router-dom'
import { FileText, Database, Plus, ArrowRight, AlertTriangle } from 'lucide-react'
import { useArticles } from '../hooks/useArticles'
import { AppIcon } from '../components/AppIcon'

export default function Dashboard() {
  const { articles, loading, tableMissing } = useArticles()
  const published = articles.filter(a => a.status === 'published')
  const drafts = articles.filter(a => a.status === 'draft')
  const recent = articles.slice(0, 5)

  return (
    <div className="page">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <AppIcon size="md" rounded shadow />
          <div>
            <h1 className="page-title">Welcome back 👋</h1>
            <p className="page-subtitle">Here's what's happening in your wiki.</p>
          </div>
        </div>
        <Link to="/articles/new" className="btn-primary">
          <Plus size={16} /> New Article
        </Link>
      </div>

      {tableMissing && (
        <div className="alert-banner warning">
          <AlertTriangle size={16} />
          <span>Database tables are not set up yet.</span>
          <Link to="/db-setup" className="alert-link">Go to DB Setup →</Link>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue"><FileText size={20} /></div>
          <div className="stat-value">{loading ? '—' : articles.length}</div>
          <div className="stat-label">Total Articles</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><FileText size={20} /></div>
          <div className="stat-value">{loading ? '—' : published.length}</div>
          <div className="stat-label">Published</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber"><FileText size={20} /></div>
          <div className="stat-value">{loading ? '—' : drafts.length}</div>
          <div className="stat-label">Drafts</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple"><Database size={20} /></div>
          <div className="stat-value">—</div>
          <div className="stat-label">Sheet Imports</div>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <h2>Recent Articles</h2>
          <Link to="/articles" className="link-muted">View all <ArrowRight size={14} /></Link>
        </div>
        {loading ? (
          <div className="loading-rows">
            {[1,2,3].map(i => <div key={i} className="skeleton-row" />)}
          </div>
        ) : tableMissing ? (
          <div className="empty-state">
            <Database size={32} />
            <p>Tables not found. <Link to="/db-setup">Run the DB setup</Link> first.</p>
          </div>
        ) : recent.length === 0 ? (
          <div className="empty-state">
            <FileText size={32} />
            <p>No articles yet. <Link to="/articles/new">Create your first one</Link>.</p>
          </div>
        ) : (
          <div className="article-list">
            {recent.map(a => (
              <Link key={a.id} to={`/articles/${a.id}`} className="article-row">
                <div className="article-row-info">
                  <span className="article-row-title">{a.title || 'Untitled'}</span>
                  <span className={`status-badge ${a.status}`}>{a.status}</span>
                </div>
                <div className="article-row-meta">
                  {new Date(a.updated_at).toLocaleDateString()}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
