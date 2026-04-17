import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  FileText, Database, Plus,
  ChevronRight, LayoutDashboard, Settings2, LogOut, AlertCircle, Moon, Sun, Info
} from 'lucide-react'
import { useAuth } from '../lib/AuthContext'
import { useSettings } from '../lib/SettingsContext'

export default function Sidebar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { settings, updateSetting } = useSettings()
  const active = (path: string) => pathname === path || pathname.startsWith(path + '/')
  const initials = user?.email?.slice(0, 2).toUpperCase() ?? 'WA'

  const handleThemeToggle = () => {
    if (settings.theme === 'light') {
      updateSetting('theme', 'dark')
    } else if (settings.theme === 'dark') {
      updateSetting('theme', 'auto')
    } else {
      updateSetting('theme', 'light')
    }
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src="/icon.png" alt="MyWiki" className="sidebar-logo-img" />
        <span>MyWiki</span>
        <button 
          className="theme-toggle-icon"
          onClick={() => navigate('/about')}
          title="About this project"
        >
          <Info size={18} />
        </button>
      </div>

      <nav className="sidebar-nav">
        <Link to="/" className={`nav-item ${pathname === '/' ? 'active' : ''}`}>
          <LayoutDashboard size={16} />
          <span>Dashboard</span>
        </Link>

        <div className="nav-section-label">Content</div>

        <Link to="/articles" className={`nav-item ${active('/articles') && !active('/articles/new') ? 'active' : ''}`}>
          <FileText size={16} />
          <span>Articles</span>
        </Link>

        <Link to="/articles/new" className={`nav-item ${active('/articles/new') ? 'active' : ''}`}>
          <Plus size={16} />
          <span>New Article</span>
        </Link>

        <div className="nav-section-label">Data</div>

        <Link to="/data" className={`nav-item ${active('/data') ? 'active' : ''}`}>
          <Database size={16} />
          <span>Sheet Importer</span>
        </Link>

        <div className="nav-section-label">Admin</div>

        <Link to="/db-setup" className={`nav-item ${active('/db-setup') ? 'active' : ''}`}>
          <AlertCircle size={16} />
          <span>DB Setup</span>
        </Link>

        <Link to="/settings" className={`nav-item ${active('/settings') ? 'active' : ''}`}>
          <Settings2 size={16} />
          <span>Settings</span>
          <ChevronRight size={12} style={{ marginLeft: 'auto', opacity: 0.4 }} />
        </Link>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">{initials}</div>
          <div className="user-info">
            <div className="user-name" title={user?.email}>{user?.email?.split('@')[0] ?? 'Admin'}</div>
            <div className="user-role">{user?.email ?? ''}</div>
          </div>
        </div>
        <button className="signout-btn" onClick={signOut} title="Sign out">
          <LogOut size={14} />
        </button>
      </div>
    </aside>
  )
}
