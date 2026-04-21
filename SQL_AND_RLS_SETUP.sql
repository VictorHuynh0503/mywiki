-- Complete Database Setup for MyWiki
-- This SQL creates all tables and sets up Row-Level Security (RLS)
-- Run this entire script once to initialize your database

-- ============================================================================
-- ─── STEP 1: Create Articles Table ──────────────────────────────────────
-- ============================================================================

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

-- ============================================================================
-- ─── STEP 2: Create User Actions Table ──────────────────────────────────
-- ============================================================================

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

-- ============================================================================
-- ─── STEP 3: Create User Profiles Table ─────────────────────────────────
-- ============================================================================

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

-- ============================================================================
-- ─── STEP 4: Enable RLS on All Tables ───────────────────────────────────
-- ============================================================================

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- ─── STEP 5: Articles RLS Policies ──────────────────────────────────────
-- ============================================================================

-- SELECT: Users can see their own articles + community articles from others
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

-- ============================================================================
-- ─── STEP 6: User Actions RLS Policies ──────────────────────────────────
-- ============================================================================

-- Users can view their own actions
CREATE POLICY "user_actions_select_own" ON public.user_actions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert their own actions
CREATE POLICY "user_actions_insert_own" ON public.user_actions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- ─── STEP 7: User Profiles RLS Policies ─────────────────────────────────
-- ============================================================================

-- Everyone can view all profiles (for author information display)
CREATE POLICY "user_profiles_select_all" ON public.user_profiles
  FOR SELECT USING (true);

-- Users can only insert their own profile
CREATE POLICY "user_profiles_insert_own" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can only update their own profile
CREATE POLICY "user_profiles_update_own" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ============================================================================
-- ─── VERIFICATION QUERIES ──────────────────────────────────────────────
-- ============================================================================
-- Run these to verify everything was created:
--
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public';
-- SELECT * FROM pg_policies WHERE tablename IN ('articles', 'user_actions', 'user_profiles');
--
-- You should see 3 tables: articles, user_actions, user_profiles
-- And multiple policies for RLS
