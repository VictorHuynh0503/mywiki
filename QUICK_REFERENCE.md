# Quick Reference

## File Structure

```
src/
├── lib/
│   ├── SettingsContext.tsx      ← New: Settings management
│   ├── ThemeContext.tsx          (kept for backward compatibility)
│   └── ...
├── pages/
│   ├── SettingsPage.tsx          ← New: Settings UI
│   ├── ArticleEditor.tsx
│   └── ...
├── components/
│   ├── Sidebar.tsx               (updated: uses SettingsContext)
│   └── ...
└── styles.css                    (updated: added settings styles)

Root files:
├── vercel.json                   ← New: Deployment config
├── DEPLOYMENT.md                 ← New: Deployment guide
├── MIGRATION_SUMMARY.md          ← New: Summary of changes
├── SETTINGS_GUIDE.md             ← New: Settings guide
└── ...
```

## Quick Start for Developers

### Import Settings Hook
```tsx
import { useSettings } from '../lib/SettingsContext'
```

### Use in Component
```tsx
const { settings, updateSetting, resetSettings } = useSettings()

// Read
const isDark = settings.theme === 'dark'

// Update
updateSetting('theme', 'light')

// Reset all
resetSettings()
```

### Access Settings in Styles
```css
/* Apply only in dark theme */
[data-theme="dark"] .element {
  color: var(--text);
}

/* Font size variations */
[data-font-size="large"] {
  font-size: 16px;
}

/* Compact mode */
[data-compact="true"] .card {
  padding: 12px;
}
```

## Available Settings Object

```tsx
interface UserSettings {
  theme: 'light' | 'dark' | 'auto'
  compactMode: boolean
  sidebarCollapsed: boolean
  autoSave: boolean
  autoSaveInterval: number
  fontSize: 'small' | 'medium' | 'large'
  notifications: boolean
  showPreview: boolean
}
```

## Deployment Quick Start

### 1. Setup Vercel
```bash
# Push to GitHub first
git push origin main

# Then connect on vercel.com/dashboard
```

### 2. Add Environment Variables
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_KEY=your-anon-key-here
```

### 3. Deploy
- Vercel auto-deploys on push
- Check `vercel.json` for build config
- View logs in Deployments tab

## Common Tasks

### Add New Setting
1. Update `UserSettings` interface in `SettingsContext.tsx`
2. Add to `DEFAULT_SETTINGS`
3. Add UI control in `SettingsPage.tsx`
4. Use `updateSetting()` to change it

### Test Settings Locally
```bash
npm run dev
# Navigate to http://localhost:5173/settings
# Change settings and verify they persist
```

### Test Production Build
```bash
npm run build
npm run preview
# Test at http://localhost:4173
```

### Clear All Settings
1. Go to Settings page
2. Click "Reset to Defaults"
3. Or manually: Open DevTools Console
   ```javascript
   localStorage.removeItem('user-settings')
   location.reload()
   ```

## Settings Storage Format

```javascript
// localStorage key
'user-settings'

// localStorage value (JSON)
{
  "theme": "dark",
  "compactMode": false,
  "sidebarCollapsed": false,
  "autoSave": true,
  "autoSaveInterval": 30,
  "fontSize": "medium",
  "notifications": true,
  "showPreview": true
}
```

## CSS Classes Reference

### Settings Page
- `.settings-page` - Main container
- `.settings-header` - Header with icon and title
- `.settings-section` - Each settings group
- `.settings-group` - Individual setting item
- `.setting-item` - Single setting control
- `.setting-toggle-item` - Checkbox style
- `.option-label` - Radio button style

### Colors & Components
- `.reset-settings-btn` - Reset button (red style)
- `[data-theme="dark"]` - Dark mode selector
- `[data-font-size="small|medium|large"]` - Font sizing
- `[data-compact="true"]` - Compact mode selector

## Troubleshooting

### Settings not showing in UI
- Check `SettingsContext.tsx` is imported
- Verify route exists in `App.tsx`
- Check component is exported

### TypeScript errors
- Ensure all types match `UserSettings` interface
- Check imports are correct
- Verify prop types in components

### Settings not persisting
- Check browser localStorage is enabled
- Verify settings key matches `'user-settings'`
- Clear cache and retry

### Deployment issues
- Verify `vercel.json` syntax (valid JSON)
- Check environment variables in Vercel dashboard
- Review build logs for errors
- Ensure `dist` folder is generated

## Resources

- [Vercel Docs](https://vercel.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [React Router](https://reactrouter.com/)
- [Vite](https://vitejs.dev/)
