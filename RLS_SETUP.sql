-- Row-Level Security (RLS) for Articles
-- This SQL sets up security policies to control article access and sharing

-- Enable RLS on articles table (already enabled, but ensuring)
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- ─── Existing Policies (User-only access) ───────────────────────────────
-- These are already in your database setup. They ensure each user can only
-- see and edit their own articles.

-- SELECT: Users can only view their own articles
CREATE POLICY "articles_select_own" ON public.articles 
  FOR SELECT 
  USING (auth.uid() = user_id);

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
