import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Save, Eye, EyeOff, ArrowLeft, Upload, Tag, X, BookOpen } from 'lucide-react'
import RichEditor from '../components/RichEditor'
import { useArticle, saveArticle, uploadImage } from '../hooks/useArticles'

export default function ArticleEditor() {
  const { id: idParam } = useParams<{ id: string }>()
  const isNew = idParam === 'new'
  const id = isNew ? undefined : idParam ? parseInt(idParam) : undefined
  const { article, loading } = useArticle(id)
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [coverUrl, setCoverUrl] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [status, setStatus] = useState<'draft' | 'published'>('draft')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  useEffect(() => {
    if (article) {
      setTitle(article.title)
      setContent(article.content)
      setExcerpt(article.excerpt ?? '')
      setCoverUrl(article.cover_url ?? '')
      setTags(article.tags)
      setStatus(article.status)
    }
  }, [article])

  const handleSave = async (newStatus?: 'draft' | 'published') => {
    setSaving(true)
    const s = newStatus ?? status
    const { data, error } = await saveArticle({
      id: isNew ? undefined : id,
      title, content, excerpt, cover_url: coverUrl, tags, status: s
    })
    setSaving(false)
    if (error) { setSaveMsg('Error: ' + error.message); return }
    setSaveMsg('Saved!')
    setStatus(s)
    setTimeout(() => setSaveMsg(''), 2500)
    if (isNew && data) navigate(`/articles/${(data as any).id}`, { replace: true })
  }

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await uploadImage(file)
    if (url) setCoverUrl(url)
  }

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      setTags(t => [...t, tagInput.trim()])
      setTagInput('')
    }
  }

  if (!isNew && loading) return <div className="page-loading">Loading…</div>

  return (
    <div className="editor-page">
      {/* Top bar */}
      <div className="editor-topbar">
        <button className="btn-ghost" onClick={() => navigate('/articles')}>
          <ArrowLeft size={16} /> Back
        </button>
        <div className="editor-topbar-center">
          {saveMsg && <span className="save-msg">{saveMsg}</span>}
        </div>
        <div className="editor-topbar-actions">
          <span className={`status-badge ${status}`}>{status}</span>
          {!isNew && (
            <button 
              className="btn-ghost" 
              onClick={() => navigate(`/articles/view/${id}`)}
              title="Preview article"
            >
              <BookOpen size={15} /> View
            </button>
          )}
          <button className="btn-ghost" onClick={() => handleSave('draft')} disabled={saving}>
            <Save size={15} /> Save Draft
          </button>
          <button className="btn-primary" onClick={() => handleSave(status === 'published' ? 'draft' : 'published')} disabled={saving}>
            {status === 'published' ? <><EyeOff size={15} /> Unpublish</> : <><Eye size={15} /> Publish</>}
          </button>
        </div>
      </div>

      <div className="editor-layout">
        {/* Main editor */}
        <div className="editor-main">
          {/* Cover image */}
          {coverUrl ? (
            <div className="cover-preview">
              <img src={coverUrl} alt="Cover" />
              <button className="cover-remove" onClick={() => setCoverUrl('')}><X size={16} /></button>
            </div>
          ) : (
            <label className="cover-upload">
              <Upload size={16} /> Add cover image
              <input type="file" accept="image/*" onChange={handleCoverUpload} hidden />
            </label>
          )}

          <input
            className="title-input"
            placeholder="Article title…"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />

          <RichEditor content={content} onChange={setContent} />
        </div>

        {/* Sidebar meta */}
        <div className="editor-sidebar">
          <div className="meta-section">
            <label className="meta-label">Excerpt</label>
            <textarea
              className="meta-textarea"
              placeholder="Short description…"
              value={excerpt}
              onChange={e => setExcerpt(e.target.value)}
              rows={3}
            />
          </div>

          <div className="meta-section">
            <label className="meta-label"><Tag size={13} /> Tags</label>
            <div className="tags-input-wrapper">
              {tags.map(t => (
                <span key={t} className="tag">
                  {t}
                  <button onClick={() => setTags(tags.filter(x => x !== t))}><X size={10} /></button>
                </span>
              ))}
              <input
                placeholder="Add tag…"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={addTag}
              />
            </div>
          </div>

          <div className="meta-section">
            <label className="meta-label">Status</label>
            <select
              className="meta-select"
              value={status}
              onChange={e => setStatus(e.target.value as 'draft' | 'published')}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
