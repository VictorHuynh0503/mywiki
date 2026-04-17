# MyWiki

A modern, feature-rich article and content management system built with React, TypeScript, and Supabase. Perfect for creating and managing personal wikis, knowledge bases, or documentation.

![MyWiki](./src/assets/icon.png)

## ✨ Features

- **📝 Rich Text Editing** - Powered by TipTap with support for images, links, lists, code blocks, and more
- **🎨 Multiple Themes** - Dark, Light, and Auto (system preference) theme modes
- **⚙️ Comprehensive Settings** - Customize appearance, editor behavior, notifications, and more
- **🔐 Secure Authentication** - Supabase authentication with email/password support
- **🔒 Row-Level Security** - Control article visibility and sharing with RLS policies
- **📊 Data Import** - Import articles from CSV and Excel files
- **🏷️ Article Organization** - Tags, categories, cover images, and metadata
- **💾 Auto-Save** - Configurable auto-save intervals
- **🌓 Dark/Light Mode** - Seamless theme switching with persistent settings
- **📱 Responsive Design** - Works beautifully on desktop, tablet, and mobile
- **🚀 Fast Performance** - Built with Vite for instant page loads

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Lightning-fast build tool
- **React Router** - Client-side routing
- **TipTap** - Rich text editor
- **Lucide React** - Icon library

### Backend & Storage
- **Supabase** - Backend-as-a-Service (PostgreSQL, Auth, Storage)
- **Row-Level Security** - Data protection and privacy

### Utilities
- **PapaParse** - CSV parsing
- **XLSX** - Excel file handling

## 📋 Prerequisites

- **Node.js** 16+ and npm/yarn/pnpm
- **Supabase Account** - Free tier available at [supabase.com](https://supabase.com)
- **Git** - For version control

## 🚀 Quick Start

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/VictorHuynh0503/mywiki.git
cd mywiki

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_KEY=your-anon-key-here
```

Get these values from your Supabase project:
1. Go to [supabase.com](https://supabase.com)
2. Create a new project or select existing one
3. Navigate to **Settings → API**
4. Copy **Project URL** and **Anon Public Key**

### 3. Database Setup

1. Open the app and navigate to **DB Setup** page
2. Follow the setup instructions
3. Or manually run the SQL script:
   - Open **RLS_SETUP.sql** in your Supabase SQL editor
   - Execute to create tables

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and start building your wiki!

## 📖 Usage

### Creating Articles

1. Click **New Article** in the sidebar
2. Enter title and write content using the rich text editor
3. Add cover image, tags, and metadata
4. Click **Save** or use auto-save

### Managing Articles

- **View Articles** - Browse all your articles on the Articles page
- **Edit** - Click any article to edit
- **Delete** - Remove articles you no longer need
- **Search** - Find articles by title or content
- **Filter** - Organize by status (published/draft)

### Customizing Settings

Navigate to **Settings** to customize:
- **Theme** - Light, Dark, or Auto modes
- **Font Size** - Small, Medium, or Large text
- **Compact Mode** - Reduce spacing for denser UI
- **Auto-Save** - Enable and set save intervals
- **Notifications** - Toggle alerts and notifications

### Importing Data

1. Go to **Sheet Importer**
2. Upload CSV or Excel files
3. Map columns to article fields
4. Review and import data

## 🗂️ Project Structure

```
mywiki/
├── src/
│   ├── assets/
│   │   └── icon.png              # App icon
│   ├── components/
│   │   ├── AppIcon.tsx           # Reusable icon component
│   │   ├── RichEditor.tsx        # TipTap editor wrapper
│   │   └── Sidebar.tsx           # Main navigation
│   ├── hooks/
│   │   ├── useArticles.ts        # Articles management
│   │   └── useSheetImports.ts    # Data import logic
│   ├── lib/
│   │   ├── AuthContext.tsx       # Authentication state
│   │   ├── SettingsContext.tsx   # Settings management
│   │   ├── ThemeContext.tsx      # Theme state
│   │   └── supabase.ts           # Supabase client
│   ├── pages/
│   │   ├── AboutPage.tsx         # About & info
│   │   ├── ArticleEditor.tsx     # Write/edit articles
│   │   ├── ArticleList.tsx       # Browse articles
│   │   ├── ArticleView.tsx       # Read articles
│   │   ├── Dashboard.tsx         # Home dashboard
│   │   ├── DataImporter.tsx      # Import data
│   │   ├── DbSetup.tsx           # Database setup
│   │   ├── LoginPage.tsx         # Authentication
│   │   └── SettingsPage.tsx      # User settings
│   ├── types/
│   │   └── index.ts              # TypeScript types
│   ├── App.tsx                   # Main app component
│   ├── main.tsx                  # Entry point
│   └── styles.css                # Global styles
├── public/
│   └── manifest.json             # PWA manifest
├── index.html                    # HTML template
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── vite.config.ts                # Vite config
├── vercel.json                   # Vercel deployment config
└── RLS_SETUP.sql                 # Database schema
```

## 📝 Available Scripts

```bash
# Development
npm run dev              # Start dev server (http://localhost:5173)

# Build
npm run build            # Build for production (generates dist/)

# Preview
npm run preview          # Preview production build locally

# Type checking
tsc --noEmit            # Check TypeScript errors
```

## 🌐 Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Configure project settings

3. **Set Environment Variables**
   - In Vercel dashboard, go to **Settings → Environment Variables**
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_KEY`

4. **Deploy**
   - Click "Deploy"
   - Vercel automatically builds and deploys

See **DEPLOYMENT.md** for detailed instructions.

### Other Platforms

Can be deployed to any Node.js hosting:
- Netlify
- AWS Amplify
- Railway
- Render
- DigitalOcean
- etc.

## ⚙️ Configuration

### Settings System

All user preferences are stored locally in `localStorage`:
- Theme preference
- Font size
- Compact mode
- Auto-save settings
- Notification preferences

See **SETTINGS_GUIDE.md** for extending settings.

### Icon Usage

The app icon is accessible via the reusable `AppIcon` component:

```tsx
import { AppIcon } from '../components/AppIcon'

<AppIcon size="lg" shadow />
```

See **ICON_GUIDE.md** for more information.

### Database Schema

The application uses Supabase PostgreSQL with RLS policies:

- **articles** table - Stores article content
- **covers** table - Image storage for article covers
- Row-Level Security - Restricts data to user's own content

See **RLS_SETUP.sql** for the complete schema.

## 🔐 Security

- **Supabase Auth** - Secure email/password authentication
- **Row-Level Security** - Database-level access control
- **Environment Variables** - Never expose API keys in code
- **HTTPS Only** - All Vercel deployments use HTTPS

## 🤝 Contributing

Contributions are welcome! Please feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Huynh Vi (Victor Huynh)**
- 📧 Email: [huynhvi760@gmail.com](mailto:huynhvi760@gmail.com)
- 🔗 GitHub: [github.com/VictorHuynh0503](https://github.com/VictorHuynh0503)
- 💼 LinkedIn: [linkedin.com/in/huynhlapvi](https://www.linkedin.com/in/huynhlapvi/)

## 📚 Documentation

- **[SETTINGS_GUIDE.md](./SETTINGS_GUIDE.md)** - Detailed settings documentation
- **[ICON_GUIDE.md](./ICON_GUIDE.md)** - Icon integration guide
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment instructions
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Developer quick reference
- **[MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md)** - Migration details

## ❓ FAQ

**Q: Can I use this offline?**
A: The current version requires internet to sync with Supabase. PWA support is planned for offline capabilities.

**Q: Can I self-host?**
A: You need to self-host Supabase backend separately. See Supabase docs for self-hosting options.

**Q: Is there a mobile app?**
A: The web app is fully responsive and works great on mobile. Native apps are not currently planned.

**Q: Can I share articles with others?**
A: Yes, through RLS policies. You can create custom policies to share articles with specific users.

**Q: How do I backup my data?**
A: Supabase provides backup options. See Supabase documentation for backup procedures.

## 🐛 Troubleshooting

### Build Error: "Cannot find module"
- Run `npm install` to ensure all dependencies are installed
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### Supabase Connection Failed
- Verify environment variables in `.env.local`
- Check Supabase project is active
- Ensure Supabase URL and key are correct

### Database Tables Not Found
- Visit **DB Setup** page and run setup
- Or manually execute **RLS_SETUP.sql** in Supabase SQL editor

### Settings Not Persisting
- Check browser localStorage is enabled
- Try clearing browser cache
- Check browser console for errors

### Login Issues
- Verify email and password are correct
- Check Supabase authentication is configured
- Try resetting password on login page

## 🎯 Roadmap

Future features in development:
- [ ] PWA offline support
- [ ] Collaborative editing
- [ ] Advanced search and filters
- [ ] Custom themes and branding
- [ ] API for third-party integration
- [ ] Mobile native apps
- [ ] Database backups and export
- [ ] Team/workspace management

## 💡 Tips & Tricks

1. **Use keyboard shortcuts** - TipTap editor supports standard markdown shortcuts
2. **Enable auto-save** - Never lose your work with auto-save enabled
3. **Use dark mode** - Easier on the eyes for long editing sessions
4. **Tag articles** - Organize and find articles faster with tags
5. **Preview before publishing** - Use the preview toggle to see how articles look

## 📧 Support

For questions, issues, or suggestions:
- Open an issue on GitHub
- Email: [huynhvi760@gmail.com](mailto:huynhvi760@gmail.com)
- Check the documentation files for more information

---

**Happy Wiki-ing! 🎉**

Made with ❤️ by Huynh Vi
