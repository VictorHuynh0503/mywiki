/// <reference types="vite/client" />

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ─── SQL to run once in Supabase SQL editor ───────────────────────────────────
//
// CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
//
// CREATE TABLE articles (
//   id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
//   title       TEXT NOT NULL DEFAULT 'Untitled',
//   content     TEXT NOT NULL DEFAULT '',
//   excerpt     TEXT,
//   cover_url   TEXT,
//   tags        TEXT[] DEFAULT '{}',
//   status      TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
//   created_at  TIMESTAMPTZ DEFAULT NOW(),
//   updated_at  TIMESTAMPTZ DEFAULT NOW()
// );
//
// CREATE TABLE sheet_imports (
//   id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
//   name        TEXT NOT NULL,
//   headers     TEXT[] NOT NULL,
//   rows        JSONB NOT NULL,
//   source      TEXT,
//   imported_at TIMESTAMPTZ DEFAULT NOW()
// );
//
// -- Storage bucket for images:
// -- Go to Storage → New bucket → name: "article-images" → public: true
