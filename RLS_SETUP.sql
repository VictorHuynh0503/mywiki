-- Complete Database Setup for MyWiki
-- This SQL creates all tables and sets up Row-Level Security (RLS)
-- Run this once to initialize your database

-- ─── Articles Table ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.articles (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  excerpt TEXT,
  cover_url TEXT,
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  publish_type TEXT DEFAULT 'local' CHECK (publish_type IN ('local', 'community')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_articles_user_id ON public.articles(user_id);
CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_publish_type ON public.articles(publish_type);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON public.articles(created_at DESC);

-- ─── User Actions Table ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_actions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('login', 'view_article', 'edit_article', 'create_article', 'delete_article', 'view_page')),
  page TEXT,
  article_id BIGINT REFERENCES public.articles(id) ON DELETE SET NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for user action tracking
CREATE INDEX IF NOT EXISTS idx_user_actions_user_id ON public.user_actions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_actions_action ON public.user_actions(action);
CREATE INDEX IF NOT EXISTS idx_user_actions_created_at ON public.user_actions(created_at DESC);

-- ─── User Profiles Table ─────────────────────────────────────────
-- Store user profile information synced from auth.users
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);

-- ─── Enable RLS on all tables ──────────────────────────────────────────
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- User profiles RLS policies
CREATE POLICY "user_profiles_select_own" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "user_profiles_select_all_for_display" ON public.user_profiles
  FOR SELECT USING (true);  -- Allow viewing other profiles for display purposes

CREATE POLICY "user_profiles_insert_own" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "user_profiles_update_own" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);

-- ─── Enable RLS on articles table (already enabled, but ensuring)
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- ─── Articles Policies (User access + Community visibility) ──────────────────
-- Note: Articles table must have columns: id, title, content, user_id, status, 
-- publish_type (local|community), created_at, updated_at

-- Add publish_type column if it doesn't exist
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS publish_type TEXT DEFAULT 'local' CHECK (publish_type IN ('local', 'community'));

-- SELECT: Users can see their own articles + community articles from others
DROP POLICY IF EXISTS "articles_select_own" ON public.articles;
DROP POLICY IF EXISTS "articles_select_shared" ON public.articles;

CREATE POLICY "articles_select_policy" ON public.articles 
  FOR SELECT 
  USING (
    auth.uid() = user_id 
    OR publish_type = 'community'
  );

-- INSERT: Users can only create articles for themselves
CREATE POLICY "articles_insert_own" ON public.articles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can only update their own articles
CREATE POLICY "articles_update_own" ON public.articles 
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: Users can only delete their own articles
CREATE POLICY "articles_delete_own" ON public.articles 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- ─── Advanced: Share with Specific User ───────────────────────────────
-- To allow sharing articles, create a shares table:

CREATE TABLE IF NOT EXISTS public.article_shares (
  id          BIGSERIAL PRIMARY KEY,
  article_id  BIGINT NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  shared_with_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  permission  TEXT DEFAULT 'view' CHECK (permission IN ('view', 'edit')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(article_id, shared_with_id)
);

-- Enable RLS on shares table
ALTER TABLE public.article_shares ENABLE ROW LEVEL SECURITY;

-- Share table policies
CREATE POLICY "shares_select_own" ON public.article_shares
  FOR SELECT
  USING (auth.uid() = shared_with_id OR auth.uid() = (SELECT user_id FROM articles WHERE id = article_id));

CREATE POLICY "shares_insert_own" ON public.article_shares
  FOR INSERT
  WITH CHECK (auth.uid() = (SELECT user_id FROM articles WHERE id = article_id));

-- ─── Advanced: Select Policy with Share Support ───────────────────────
-- Replace the simple articles_select_own with this to support shares:

DROP POLICY IF EXISTS "articles_select_own" ON public.articles;

CREATE POLICY "articles_select_shared" ON public.articles
  FOR SELECT
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.article_shares 
      WHERE article_shares.article_id = articles.id 
      AND article_shares.shared_with_id = auth.uid()
    )
  );

-- ─── Public Read-Only Articles ──────────────────────────────────────
-- To allow URL sharing with public read access, create a public_articles table:

CREATE TABLE IF NOT EXISTS public.public_articles (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id    BIGINT NOT NULL UNIQUE REFERENCES public.articles(id) ON DELETE CASCADE,
  slug          TEXT UNIQUE NOT NULL,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- No RLS on public_articles - everyone can read
ALTER TABLE public.public_articles DISABLE ROW LEVEL SECURITY;

-- Create index for faster lookups
CREATE INDEX idx_public_articles_article_id ON public.public_articles(article_id);
CREATE INDEX idx_public_articles_slug ON public.public_articles(slug);

-- ─── How to Use ──────────────────────────────────────────────────────
-- 
-- 1. Only Your Articles:
--    By default, RLS prevents other users from seeing your articles
--
-- 2. Share with Specific User:
--    INSERT INTO public.article_shares (article_id, shared_with_id, permission)
--    VALUES (1, 'user-uuid-here', 'view');
--
-- 3. Public Sharing (via URL slug):
--    INSERT INTO public.public_articles (article_id, slug, is_active)
--    VALUES (1, 'my-awesome-article', true);
--    
--    Then share: yourapp.com/public/my-awesome-article
--
-- 4. Verify RLS is working:
--    SELECT * FROM public.articles;  -- Should only show your articles
--    SELECT * FROM public.article_shares; -- Should only show shares you own/received
