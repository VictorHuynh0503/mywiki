import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import iconImg from '../assets/icon.png'

export default function AboutPage() {
  const navigate = useNavigate()

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn-ghost" onClick={() => navigate('/')}>
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      <div className="about-container">
        <div className="about-hero">
          <div className="about-avatar-icon">
            <img src={iconImg} alt="MyWiki" />
          </div>
          <h1 className="about-title">About MyWiki</h1>
          <p className="about-subtitle">A modern wiki and article management system</p>
        </div>

        <div className="about-sections">
          <section className="about-section">
            <h2>Project Owner</h2>
            <p>
              This project is created and maintained by a passionate Decision Intelligence specialist dedicated to building 
              intuitive and user-friendly content management solutions.
            </p>
            <div className="owner-info">
              <div className="owner-detail">
                <strong>📧 Email:</strong>
                <a href="mailto:contact@example.com">huynhvi760@gmail.com</a>
              </div>
              <div className="owner-detail">
                <strong>🔗 GitHub:</strong>
                <a href="#" target="_blank" rel="noopener noreferrer">https://github.com/VictorHuynh0503</a>
              </div>
              <div className="owner-detail">
                <strong>💼 LinkedIn:</strong>
                <a href="https://www.linkedin.com/in/huynhlapvi/" target="_blank" rel="noopener noreferrer">https://www.linkedin.com/in/huynhlapvi/</a>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2>Features</h2>
            <ul className="about-list">
              <li>✨ Rich text editing with image support</li>
              <li>📊 Articles with cover images and tags</li>
              <li>🔐 Secure authentication and access control</li>
              <li>🌓 Dark/Light theme support</li>
              <li>📤 Sheet data import functionality</li>
              <li>🔒 Row-Level Security for content sharing</li>
            </ul>
          </section>

          <section className="about-section">
            <h2>Technology Stack</h2>
            <div className="tech-grid">
              <div className="tech-item">
                <strong>Frontend</strong>
                <span>React, TypeScript, Vite</span>
              </div>
              <div className="tech-item">
                <strong>Editor</strong>
                <span>TipTap (rich text)</span>
              </div>
              <div className="tech-item">
                <strong>Backend</strong>
                <span>Supabase PostSQL</span>
              </div>
              <div className="tech-item">
                <strong>Storage</strong>
                <span>Supabase Storage</span>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2>Row-Level Security (RLS)</h2>
            <p>
              This application uses Supabase Row-Level Security to control article visibility and sharing.
              Only you can see your own articles unless you explicitly grant access to other users.
            </p>
            <div className="rls-info">
              <p><strong>How RLS Works:</strong></p>
              <ul className="about-list">
                <li>Each article is linked to your user ID</li>
                <li>You can only view and edit your own articles</li>
                <li>Sharing a URL doesn't grant access - RLS validates permissions</li>
                <li>Custom policies can be created for collaborative editing</li>
              </ul>
            </div>
          </section>

          <section className="about-section">
            <h2>Getting Started</h2>
            <ol className="about-list" style={{ listStyle: 'decimal', paddingLeft: '20px' }}>
              <li>Set up your Supabase project</li>
              <li>Configure the database schema</li>
              <li>Create your first article</li>
              <li>Add images and tags</li>
              <li>Publish or keep as draft</li>
            </ol>
          </section>
        </div>
      </div>
    </div>
  )
}
