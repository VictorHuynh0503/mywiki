import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { CheckCircle, XCircle, Loader, Database, AlertTriangle } from 'lucide-react'

interface TableStatus {
  name: string
  exists: boolean | null
  checking: boolean
}

export default function DbSetup() {
  const [tables, setTables] = useState<TableStatus[]>([
    { name: 'articles', exists: null, checking: false },
    { name: 'sheet_imports', exists: null, checking: false },
  ])
  const [checking, setChecking] = useState(false)
  const [sqlCopied, setSqlCopied] = useState(false)

  const SQL_SCHEMA = `-- Run this in your Supabase SQL Editor
-- Go to: https://supabase.com/dashboard → your project → SQL Editor

CREATE TABLE IF NOT EXISTS public.articles (
  id          BIGSERIAL PRIMARY KEY,
  title       TEXT NOT NULL DEFAULT 'Untitled',
  content     TEXT NOT NULL DEFAULT '',
  excerpt     TEXT,
  cover_url   TEXT,
  tags        TEXT[] DEFAULT '{}',
  status      TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.sheet_imports (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  headers     TEXT[] NOT NULL,
  rows        JSONB NOT NULL,
  source      TEXT,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  imported_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sheet_imports ENABLE ROW LEVEL SECURITY;

-- Policies: users can only see/edit their own data
CREATE POLICY "articles_select" ON public.articles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "articles_insert" ON public.articles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "articles_update" ON public.articles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "articles_delete" ON public.articles FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "imports_select" ON public.sheet_imports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "imports_insert" ON public.sheet_imports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "imports_update" ON public.sheet_imports FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "imports_delete" ON public.sheet_imports FOR DELETE USING (auth.uid() = user_id);`

  const checkTables = async () => {
    setChecking(true)
    const updated = [...tables]

    for (let i = 0; i < updated.length; i++) {
      updated[i] = { ...updated[i], checking: true }
      setTables([...updated])

      const { error } = await supabase.from(updated[i].name).select('id').limit(1)
      // PGRST116 = no rows (table exists!), other errors = table missing
      const exists = !error || error.code === 'PGRST116' || error.message?.includes('0 rows')
      updated[i] = { ...updated[i], exists, checking: false }
      setTables([...updated])
    }

    setChecking(false)
  }

  const copySQL = () => {
    navigator.clipboard.writeText(SQL_SCHEMA)
    setSqlCopied(true)
    setTimeout(() => setSqlCopied(false), 2500)
  }

  const allGood = tables.every(t => t.exists === true)
  const anyChecked = tables.some(t => t.exists !== null)

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Database Setup</h1>
          <p className="page-subtitle">Check and create the required Supabase tables</p>
        </div>
      </div>

      {/* Status cards */}
      <div className="setup-cards">
        {tables.map(t => (
          <div key={t.name} className={`setup-card ${t.exists === true ? 'ok' : t.exists === false ? 'missing' : ''}`}>
            <div className="setup-card-icon">
              {t.checking ? <Loader size={20} className="spin" /> :
               t.exists === true ? <CheckCircle size={20} /> :
               t.exists === false ? <XCircle size={20} /> :
               <Database size={20} />}
            </div>
            <div className="setup-card-info">
              <div className="setup-card-name">public.{t.name}</div>
              <div className="setup-card-status">
                {t.checking ? 'Checking…' :
                 t.exists === true ? 'Table exists ✓' :
                 t.exists === false ? 'Table not found' :
                 'Not checked yet'}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="btn-primary" onClick={checkTables} disabled={checking} style={{ marginBottom: 24 }}>
        {checking ? <><Loader size={15} className="spin" /> Checking…</> : '🔍 Check Tables'}
      </button>

      {/* All good */}
      {allGood && (
        <div className="setup-alert success">
          <CheckCircle size={18} />
          <div>
            <strong>All tables are ready!</strong>
            <p>Your database is set up correctly. You can now use the wiki.</p>
          </div>
        </div>
      )}

      {/* Some missing */}
      {anyChecked && !allGood && (
        <div className="setup-alert warning">
          <AlertTriangle size={18} />
          <div>
            <strong>Some tables are missing.</strong>
            <p>Copy the SQL below and run it in your <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer">Supabase SQL Editor</a>, then click Check Tables again.</p>
          </div>
        </div>
      )}

      {/* SQL block */}
      <div className="sql-block">
        <div className="sql-block-header">
          <span>SQL Schema — run once in Supabase SQL Editor</span>
          <button className="btn-ghost" onClick={copySQL} style={{ padding: '4px 10px', fontSize: 12 }}>
            {sqlCopied ? '✓ Copied!' : '📋 Copy SQL'}
          </button>
        </div>
        <pre className="sql-code">{SQL_SCHEMA}</pre>
      </div>

      <div className="setup-steps">
        <h3 style={{ marginBottom: 12, fontSize: 15, fontWeight: 600 }}>How to run this SQL</h3>
        <ol className="steps-list">
          <li>Go to <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer">supabase.com/dashboard</a></li>
          <li>Select your project: <strong>nwniahwsfgenrgakcqln</strong></li>
          <li>Click <strong>SQL Editor</strong> in the left sidebar</li>
          <li>Click <strong>New query</strong>, paste the SQL above, and click <strong>Run</strong></li>
          <li>Come back here and click <strong>Check Tables</strong></li>
        </ol>
      </div>
    </div>
  )
}
