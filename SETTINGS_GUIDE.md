# Settings System Guide

## Overview

The new settings system allows users to customize the MyWiki application's appearance and behavior. All settings are stored locally in the browser and persist across sessions.

## Settings Location

Users can access settings via **Settings** link in the Admin section of the sidebar (or navigate to `/settings`).

## Available Settings

### Appearance
- **Theme**: Choose between Light, Dark, or Auto (follow system preference)
- **Font Size**: Adjust text size (Small, Medium, Large)
- **Compact Mode**: Reduce spacing and padding for a denser interface

### Editor  
- **Show Preview**: Toggle live preview while editing articles
- **Auto-Save**: Enable/disable automatic saving
- **Auto-Save Interval**: Set how often documents save (5-300 seconds)

### Notifications
- **Enable Notifications**: Toggle notification alerts

## How It Works

### Data Storage
Settings are stored in browser's `localStorage` under the key `user-settings`:

```json
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

### Theme Application
The SettingsContext applies settings via CSS:
- Sets `data-theme` attribute on `<html>` for theme colors
- Sets `data-font-size` attribute for text scaling
- Sets `data-compact` attribute for compact spacing

### Reactive Updates
When settings change, the entire app updates in real-time:
- Theme changes apply to all pages instantly
- Font size adjustments affect text globally
- Compact mode reduces spacing throughout

## Accessing Settings in Code

### Using the Settings Hook

```tsx
import { useSettings } from '../lib/SettingsContext'

function MyComponent() {
  const { settings, updateSetting, resetSettings } = useSettings()
  
  // Read a setting
  if (settings.theme === 'dark') {
    // Do something in dark mode
  }
  
  // Update a setting
  updateSetting('theme', 'light')
  updateSetting('fontSize', 'large')
  
  // Reset all to defaults
  resetSettings()
}
```

### Available Methods

- **`settings`**: Current settings object
- **`updateSetting(key, value)`**: Update a specific setting
- **`resetSettings()`**: Reset all settings to defaults

## Default Settings

| Setting | Default | Options |
|---------|---------|---------|
| theme | `'auto'` | `'light'`, `'dark'`, `'auto'` |
| fontSize | `'medium'` | `'small'`, `'medium'`, `'large'` |
| compactMode | `false` | `true`, `false` |
| autoSave | `true` | `true`, `false` |
| autoSaveInterval | `30` | `5-300` (seconds) |
| notifications | `true` | `true`, `false` |
| showPreview | `true` | `true`, `false` |
| sidebarCollapsed | `false` | `true`, `false` |

## Extending Settings

To add new settings:

1. **Update `UserSettings` interface** in `src/lib/SettingsContext.tsx`:
   ```tsx
   interface UserSettings {
     // ... existing settings
     myNewSetting: string
   }
   ```

2. **Add to defaults** in `DEFAULT_SETTINGS`:
   ```tsx
   const DEFAULT_SETTINGS: UserSettings = {
     // ... existing
     myNewSetting: 'default-value'
   }
   ```

3. **Add UI control** in `src/pages/SettingsPage.tsx`:
   ```tsx
   <div className="settings-group">
     <label className="setting-toggle-item">
       <input 
         type="checkbox"
         checked={settings.myNewSetting}
         onChange={(e) => updateSetting('myNewSetting', e.target.checked)}
       />
       <span className="toggle-label">
         <span className="toggle-title">My Setting</span>
         <span className="toggle-description">Description here</span>
       </span>
     </label>
   </div>
   ```

4. **Handle in app** (if needed):
   ```tsx
   const { settings } = useSettings()
   if (settings.myNewSetting === 'some-value') {
     // Apply your logic
   }
   ```

## CSS Variables for Theming

Settings are applied via CSS custom properties. You can use them in your styles:

```css
.my-element {
  background: var(--bg);
  color: var(--text);
}

/* In dark mode */
[data-theme="dark"] .my-element {
  /* Dark mode overrides */
}
```

## Theme Variables Reference

### Light Mode
- `--bg`: `#f4f5f7` (background)
- `--surface`: `#ffffff` (card/surface)
- `--text`: `#172b4d` (text)
- `--text-2`: `#5e6c84` (secondary text)
- `--accent`: `#0052cc` (primary color)

### Dark Mode
- `--bg`: `#0f1419`
- `--surface`: `#1a1f28`
- `--text`: `#e4e9f1`
- `--text-2`: `#a8b0bc`
- `--accent`: `#0052cc` (same)

See `src/styles.css` for complete variable list.

## Browser Compatibility

Settings use standard Web APIs:
- `localStorage` - All modern browsers
- CSS Custom Properties - All modern browsers
- `prefers-color-scheme` - All modern browsers

## Troubleshooting

### Settings Not Persisting
- Check browser's localStorage is enabled
- Try clearing browser cache
- Reset settings to defaults

### Theme Not Applying
- Ensure CSS variables are loaded
- Check for CSS framework conflicts
- Verify `data-theme` attribute on `<html>`

### Settings Lost After Refresh
- localStorage might be disabled
- Private/Incognito mode doesn't persist
- Check browser storage quota

## Future Enhancements

Potential additions:
- **Cloud Sync**: Store settings in Supabase
- **Multiple Profiles**: Save different setting profiles
- **Export/Import**: Backup and restore settings
- **Settings Search**: Quick find specific settings
- **Keyboard Shortcuts**: Customizable shortcuts
