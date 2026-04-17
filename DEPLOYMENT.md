# MyWiki Deployment Guide

## Vercel Deployment

### Prerequisites
1. A Vercel account (https://vercel.com)
2. A GitHub account with this repository
3. Supabase credentials (URL and anon key)

### Step 1: Connect Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Select the project folder if prompted (the root folder)

### Step 2: Configure Environment Variables

After importing, add the following environment variables in the Vercel project settings:

- **VITE_SUPABASE_URL**: Your Supabase project URL
- **VITE_SUPABASE_KEY**: Your Supabase anon public key

Go to: Settings → Environment Variables

### Step 3: Deploy

1. Configure as needed (build settings are already in `vercel.json`)
2. Click "Deploy"
3. Vercel will automatically run:
   - `npm run build` - Build the project
   - Deploy to the `dist` directory

### Step 4: Configure Custom Domain (Optional)

1. Go to Settings → Domains
2. Add your custom domain
3. Follow the DNS configuration instructions

## Environment Variables

Create a `.env.local` file for local development:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_anon_key
```

## Build Configuration

The `vercel.json` file includes:

- **buildCommand**: Uses `npm run build` (TypeScript + Vite)
- **outputDirectory**: Deploys from `dist` folder
- **Rewrites**: Configures SPA routing (all routes go to `/index.html`)
- **Cache Headers**: Static assets cached for 1 year, HTML never cached
- **Environment Variables**: Auto-configured from Vercel secrets

## Local Testing

To test the production build locally:

```bash
npm run build
npm run preview
```

Then visit `http://localhost:4173`

## Troubleshooting

### Build Fails
- Ensure all TypeScript types are correct
- Check that `package.json` has all necessary dependencies
- Verify environment variables are set in Vercel

### Blank Page After Deploy
- Check browser console for errors
- Verify Supabase credentials are correct
- Ensure CORS is configured in Supabase

### Routing Issues
- The `vercel.json` rewrites handle SPA routing
- All requests go to `/index.html` and React Router handles navigation

## Monitoring & Logs

1. Check deployment logs in Vercel Dashboard → Deployments
2. View runtime logs: Vercel Dashboard → Runtime Logs
3. Frontend errors appear in browser console

## Performance Tips

- Static assets are cached for 1 year (immutable)
- HTML is never cached (always fetches latest)
- Consider adding a CDN for assets
- Monitor Vercel Analytics for performance metrics
