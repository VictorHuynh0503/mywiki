# Icon Integration Guide

## Icon Asset

Your app icon is located at `src/assets/icon.png` and is now integrated throughout the MyWiki application.

## Where the Icon is Used

### 1. **Browser Favicon** 
   - Location: `index.html`
   - Appears in browser tabs and bookmarks
   - Multiple formats for different devices (favicon, apple-touch-icon)

### 2. **Sidebar Logo**
   - Location: `src/components/Sidebar.tsx`
   - Displays the icon at the top of the navigation sidebar
   - Size: 28x28px, rounded corners

### 3. **Login Page**
   - Location: `src/pages/LoginPage.tsx`
   - Shows in the authentication card header
   - Size: 40x40px in a rounded container

### 4. **About Page**
   - Location: `src/pages/AboutPage.tsx`
   - Featured prominently in the hero section
   - Size: 120x120px with shadow effect

### 5. **Dashboard**
   - Location: `src/pages/Dashboard.tsx`
   - Displays next to the welcome message
   - Size: 40x40px, rounded with shadow

## Using the AppIcon Component

A reusable `AppIcon` component has been created for consistent icon usage across the app.

### Import
```tsx
import { AppIcon } from '../components/AppIcon'
```

### Basic Usage
```tsx
// Default (40px, rounded, no shadow)
<AppIcon />

// Small icon
<AppIcon size="sm" /> {/* 24px */}

// Large icon
<AppIcon size="lg" /> {/* 64px */}

// Extra large
<AppIcon size="xl" /> {/* 120px */}

// With shadow
<AppIcon size="lg" shadow />

// Without rounding
<AppIcon rounded={false} />

// Custom CSS class
<AppIcon className="my-custom-class" />
```

## Icon Sizes

| Size | Pixels | Use Case |
|------|--------|----------|
| `sm` | 24px | Inline icons, small UI elements |
| `md` | 40px | Component logos, headers |
| `lg` | 64px | Card headers, featured areas |
| `xl` | 120px | Hero sections, featured displays |

## CSS Classes

All AppIcon instances have the `.app-icon` class for styling:

```css
.app-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.app-icon.rounded {
  border-radius: 8px;
}

.app-icon.shadow {
  box-shadow: 0 4px 12px rgba(9, 30, 66, 0.15);
}
```

## Adding Icon to New Pages

### Step 1: Import the Component
```tsx
import { AppIcon } from '../components/AppIcon'
```

### Step 2: Use in JSX
```tsx
<div className="my-section">
  <AppIcon size="md" shadow />
  <h1>My Section</h1>
</div>
```

### Step 3: Style as Needed
```css
.my-section {
  display: flex;
  align-items: center;
  gap: 16px;
}
```

## Icon Variants

If you want different icon variants (outline, fill, etc.), you can:

1. **Store multiple icon files** in `src/assets/`:
   - `icon.png` (main)
   - `icon-outline.png`
   - `icon-white.png`
   - etc.

2. **Create variant components**:
```tsx
export function AppIconOutline(props: IconProps) {
  return <img src={iconOutlineImg} {...props} />
}
```

3. **Update AppIcon component** to support variants:
```tsx
interface IconProps {
  variant?: 'default' | 'outline' | 'white'
  // ... other props
}
```

## SEO & Meta Tags

The icon is also used for:
- Browser favicon
- Apple touch icon (mobile home screen)
- PWA manifest (if configured)

Current meta tags added to `index.html`:
```html
<link rel="icon" type="image/png" href="/src/assets/icon.png" />
<link rel="shortcut icon" type="image/png" href="/src/assets/icon.png" />
<link rel="apple-touch-icon" href="/src/assets/icon.png" />
<meta name="theme-color" content="#0052cc" />
```

## Optimization Tips

### 1. **Responsive Icon Sizing**
Use AppIcon's size prop instead of hardcoding dimensions for better maintainability.

### 2. **Performance**
- The icon is imported once and reused everywhere
- Vite automatically optimizes the image
- Consider using `webp` format for smaller file sizes

### 3. **Dark Mode Support**
The icon will automatically adapt to the theme via CSS:
- Light mode: Shows on `--surface` background
- Dark mode: Shows on dark `--surface`

If you need theme-specific icon variants, use CSS:
```css
[data-theme="dark"] .app-icon {
  background: var(--surface);
}
```

## Future Enhancements

Consider:
- [ ] Create icon variants (.svg, .ico)
- [ ] Add icon to PWA manifest
- [ ] Create loading animation using the icon
- [ ] Add icon selection UI in settings
- [ ] Support custom/branded icons per instance

