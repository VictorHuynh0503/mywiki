import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './lib/AuthContext'
import { ThemeProvider } from './lib/ThemeContext'
import { SettingsProvider } from './lib/SettingsContext'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import ArticleList from './pages/ArticleList'
import ArticleEditor from './pages/ArticleEditor'
import ArticleView from './pages/ArticleView'
import DataImporter from './pages/DataImporter'
import LoginPage from './pages/LoginPage'
import DbSetup from './pages/DbSetup'
import AboutPage from './pages/AboutPage'
import SettingsPage from './pages/SettingsPage'

function ProtectedLayout() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="splash-loading">
        <div className="splash-spinner" />
        <p>Loading…</p>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/articles" element={<ArticleList />} />
          <Route path="/articles/new" element={<ArticleEditor />} />
          <Route path="/articles/view/:id" element={<ArticleView />} />
          <Route path="/articles/:id" element={<ArticleEditor />} />
          <Route path="/data" element={<DataImporter />} />
          <Route path="/db-setup" element={<DbSetup />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

function AuthRoute() {
  const { session, loading } = useAuth()
  if (loading) return null
  if (session) return <Navigate to="/" replace />
  return <LoginPage />
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SettingsProvider>
          <ThemeProvider>
            <Routes>
              <Route path="/login" element={<AuthRoute />} />
              <Route path="/*" element={<ProtectedLayout />} />
            </Routes>
          </ThemeProvider>
        </SettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
