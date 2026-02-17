# RigSense Frontend

Next.js frontend application for the RigSense PC build recommendation system.

## 🎯 Overview

A modern, responsive web application for designing and optimizing PC builds with:
- **Interactive Build Designer** with component selection
- **Performance Predictions** for gaming and workloads
- **Build Presets** for different use cases
- **Build Comparison** and optimization tools
- **Responsive Design** for desktop and mobile

## 🏗️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **UI Components**: Custom components + shadcn/ui
- **Backend Integration**: REST API (MongoDB via backend)
- **Client Storage**: localStorage for saved builds

## 📋 Prerequisites

- Node.js v18 or higher
- npm or yarn
- Backend API running (see [backend README](../backend/README.md))

## 🚀 Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file from the example:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:3001

# Application URL (optional)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎨 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build optimized production bundle |
| `npm start` | Start production server (requires build first) |
| `npm run lint` | Run ESLint for code quality |

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Home page
│   │   ├── layout.tsx            # Root layout
│   │   ├── builder/              # Build designer pages
│   │   ├── presets/              # Preset builds pages
│   │   └── compare/              # Build comparison pages
│   │
│   ├── components/
│   │   ├── ui/                   # Reusable UI components
│   │   ├── builder/              # Build-specific components
│   │   └── layout/               # Layout components
│   │
│   ├── lib/
│   │   ├── supabase.ts          # Supabase client
│   │   ├── api.ts               # API client functions
│   │   └── utils.ts             # Utility functions
│   │
│   └── store/
│       └── buildStore.ts         # Zustand state management
│
├── public/
│   └── images/                   # Static images
│
├── .env.example                  # Environment variables template
├── .env.local                    # Your local environment (not committed)
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json
```

## 🔌 API Integration

The frontend communicates with the backend API for:

### Get Components
```typescript
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/components`);
const components = await response.json();
```

### Save Build
```typescript
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/builds`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(buildData)
});
```

## 💾 Data Storage

### Build Persistence
Builds are saved using:
- **localStorage**: Client-side storage for saved builds
- **Backend API**: All component data and validation through MongoDB

### Storage Example
```typescript
// Saves are handled automatically through the Build Context
import { useBuild } from '@/store/buildContext';

const { saveBuild, savedBuilds } = useBuild();

// Save current build
await saveBuild('My Gaming Build');

// Access saved builds
console.log(savedBuilds); // All builds from localStorage

## 🎨 Styling

### Tailwind CSS

This project uses Tailwind CSS for styling:

```tsx
<div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-lg">
  <h1 className="text-2xl font-bold text-white">Component</h1>
</div>
```

### Custom Components

Reusable components are in `src/components/ui/`:
- Button
- Card
- Modal
- Input
- Select

## 🔧 Troubleshooting

### Frontend Can't Connect to Backend

**Error**: Network error or CORS issue

**Solutions:**
1. **Ensure backend is running**: Visit http://localhost:3001/health
2. **Check `NEXT_PUBLIC_API_URL`** in `.env.local` matches backend port
3. **Verify CORS** is configured in backend for `http://localhost:3000`
4. **Restart dev server** after changing `.env.local`

### Data Not Persisting

**Error**: Builds not saving or localStorage issues

**Solutions:**
1. **Check browser console** for localStorage errors
2. **Clear localStorage** if corrupted: Open DevTools → Application → Local Storage → Clear
3. **Verify build has a name** before saving
4. **Check browser localStorage quota**

### Build Errors

**Error**: TypeScript or build errors

**Solutions:**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### Port Already in Use

**Error**: `Port 3000 is already in use`

**Solutions:**
```bash
# Kill process using port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

Or use a different port:
```bash
PORT=3001 npm run dev
```

## 🚀 Production Build

### Build for Production

```bash
npm run build
```

This creates an optimized production build in `.next/` directory.

### Test Production Build Locally

```bash
npm run build
npm start
```

### Environment Variables for Production

Set these in your hosting platform (Vercel, Netlify, etc.):

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_APP_URL=https://your-app-domain.com
```

## 🎯 Key Features

### Build Designer
- Interactive component selection
- Real-time price calculation
- Compatibility checking
- Performance predictions

### Preset Builds
- Pre-configured builds for different use cases
- Gaming, workstation, budget builds
- Direct comparison with custom builds

### Build Management
- Save builds to database
- Load and edit saved builds
- Export builds as PDF
- Share builds with others

## 📱 Responsive Design

The application is fully responsive:
- **Desktop**: Full-featured interface with side panels
- **Tablet**: Optimized layout with collapsible sections
- **Mobile**: Touch-friendly interface with bottom sheets

## 🤝 Contributing

When contributing:
- Never commit `.env.local` files
- Update `.env.example` when adding new variables
- Follow TypeScript best practices
- Use Tailwind for styling (avoid inline styles)
- Test on multiple screen sizes
- Ensure build passes: `npm run build`
- Run linter: `npm run lint`

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Zustand Guide](https://github.com/pmndrs/zustand)

## 🐛 Common Issues

### Hydration Errors

If you see hydration mismatch errors:
1. Ensure server and client render the same content
2. Check for browser extensions interfering
3. Avoid using random values or dates directly in JSX

### Image Optimization

Next.js requires image domains to be configured:

In `next.config.ts`:
```typescript
images: {
  domains: ['your-image-domain.com'],
}
```

### TypeScript Errors

For type checking:
```bash
npx tsc --noEmit
```

## 📝 Development Tips

1. **Use TypeScript**: Define proper types for better IDE support
2. **Component Modularity**: Keep components small and reusable
3. **Server Components**: Use server components by default, client components only when needed
4. **Error Boundaries**: Implement error boundaries for robust error handling
5. **Loading States**: Always show loading states for async operations
