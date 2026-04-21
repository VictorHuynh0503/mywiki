# Database Migration Guide

## Changes for Community Article Feature

This update adds the ability to publish articles as "Community" (visible to all registered users) or keep them "Local" (private).

### What's New
1. **User Profiles Table** - Stores user information for display
2. **Publish Type for Articles** - Articles can now be marked as `local` (private) or `community` (public to all registered users)
3. **Updated RLS Policies** - Allows viewing community articles from other users

## Database Migration Steps

### Step 1: Run the RLS Setup SQL

1. Go to Supabase Dashboard → SQL Editor
2. Create a new query and copy the entire contents of `RLS_SETUP.sql`
3. Execute the query

This will:
- Create the `user_profiles` table with proper RLS policies
- Add the `publish_type` column to the `articles` table
- Update the RLS policies to allow viewing community articles

### Step 2: Verify the Changes

Run these queries to verify:

```sql
-- Check user_profiles table
SELECT * FROM public.user_profiles LIMIT 1;

-- Check articles table has publish_type
SELECT id, title, publish_type FROM public.articles LIMIT 5;

-- Check RLS policies
SELECT tablename, policyname FROM pg_policies 
WHERE tablename IN ('articles', 'user_profiles');
```

## What Each Change Does

### User Profiles Table
- **Purpose**: Store user email, name, and avatar for display throughout the app
- **RLS Policies**:
  - Users can view all profiles (for displaying author info)
  - Users can only edit their own profile
  - Auto-synced from auth when users login/signup via AuthContext

### Publish Type Column
- **Values**: `'local'` (default) or `'community'`
- **Local**: Only the author can see this article
- **Community**: All registered users can see this article
- **RLS Policy Update**: 
  ```sql
  SELECT allowed if:
    - User is the author, OR
    - Article is marked as 'community'
  ```

## Frontend Changes

### New UI Features in Article Editor
- **Visibility Toggle**: Choose between "Local (Only me)" and "Community (Everyone)"
- Shows helpful text explaining what each setting means

### Article List Updates
- Displays visibility badge (🔒 Local or 🌍 Community) for each article
- Articles from other users only show if marked as community

### Article View Updates
- Shows who can see each article
- Displays author information (when article is from another user)

## Testing

### Test Case 1: Create a Community Article
1. Create a new article
2. Set Visibility to "Community"
3. Publish it
4. Sign in with a different user
5. Verify you can see the article in your article list

### Test Case 2: Keep Article Local
1. Create a new article
2. Leave Visibility as "Local" (default)
3. Sign in with a different user
4. Verify the article does NOT appear in their list

### Test Case 3: User Profile Creation
1. Sign up with a new email
2. Check Supabase: user_profiles table should have a record
3. Visit any community article from that user
4. Author name should display

## Rollback (if needed)

If you need to rollback these changes:

```sql
-- Drop user_profiles table
DROP TABLE IF EXISTS public.user_profiles CASCADE;

-- Remove publish_type column
ALTER TABLE public.articles DROP COLUMN IF EXISTS publish_type;

-- Restore original articles policies
DROP POLICY IF EXISTS "articles_select_policy" ON public.articles;
CREATE POLICY "articles_select_own" ON public.articles 
  FOR SELECT USING (auth.uid() = user_id);
```

## Notes

- User profiles are automatically synced when users login/signup
- Community articles are only visible to authenticated users
- The default publish_type for new articles is 'local'
- The feature respects existing RLS security - users can never see an article from a private user
