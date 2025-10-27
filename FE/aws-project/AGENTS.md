# BF Car Rental - Frontend Application

A production-ready React SPA application for BF Car Rental, featuring React Router 6, TypeScript, Vitest, and modern tooling.

## Tech Stack

- **Package Manager**: PNPM
- **Frontend**: React 18 + React Router 6 (SPA) + TypeScript + Vite + TailwindCSS 3
- **Testing**: Vitest
- **UI**: Radix UI + TailwindCSS 3 + Lucide React icons + Ant Design
- **Backend**: Separate backend service (API calls only)

## Project Structure

```
client/                   # React SPA frontend
├── pages/                # Route components (Index.tsx = home)
│   ├── Customer/         # Customer-facing pages
│   ├── Admin/            # Admin dashboard
│   ├── Staff/            # Staff management
│   └── Login/            # Authentication pages
├── components/           # Reusable components
│   ├── ui/               # Pre-built UI component library
│   └── site/             # Site-specific components (Header, Footer, Layout)
├── App.tsx               # App entry point with SPA routing setup
└── global.css            # TailwindCSS 3 theming and global styles
```

## Key Features

## SPA Routing System

The routing system is powered by React Router 6:

- `client/pages/Index.tsx` represents the home page
- Routes are defined in `client/App.tsx` using the `react-router-dom` import
- Route files are located in the `client/pages/` directory

For example, routes can be defined with:

```typescript
import { BrowserRouter, Routes, Route } from "react-router-dom";

<Routes>
  <Route path="/" element={<Index />} />
  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
  <Route path="*" element={<NotFound />} />
</Routes>
```

### Styling System

- **Primary**: TailwindCSS 3 utility classes
- **Theme and design tokens**: Configure in `client/global.css`
- **UI components**: Pre-built library in `client/components/ui/`
- **Utility**: `cn()` function combines `clsx` + `tailwind-merge` for conditional classes

```typescript
// cn utility usage
className={cn(
  "base-classes",
  { "conditional-class": condition },
  props.className  // User overrides
)}
```

### Backend API Integration

- **Backend Service**: Separate backend service (not included in this repo)
- **API Calls**: Use `fetch` or `axios` to call backend APIs
- **Authentication**: Handle tokens/sessions via localStorage or cookies

Path aliases:

- `@/*` - Client folder

## Development Commands

```bash
pnpm dev        # Start dev server (frontend only)
pnpm build      # Production build
pnpm preview    # Preview production build
pnpm typecheck  # TypeScript validation
pnpm test       # Run Vitest tests
```

## Adding Features

### Add new colors to the theme

Open `client/global.css` and `tailwind.config.ts` and add new tailwind colors.

### New Page Route

1. Create component in `client/pages/MyPage.tsx`
2. Add route in `client/App.tsx`:

```typescript
<Route path="/my-page" element={<MyPage />} />
```

### API Integration Example

```typescript
// Example: Fetch data from backend API
const fetchCars = async () => {
  try {
    const response = await fetch("https://your-backend-api.com/api/cars");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching cars:", error);
  }
};
```

## Production Deployment

- **Standard**: `pnpm build` - Creates static files in `dist/` folder
- **Cloud Deployment**: Deploy to Vercel, Netlify, or any static hosting service
- **Environment Variables**: Configure API endpoints via `.env` files

## Architecture Notes

- Pure frontend SPA with React Router 6
- TypeScript throughout for type safety
- TailwindCSS for styling
- Radix UI + Ant Design for UI components
- Vite for fast development and optimized builds
- API calls to separate backend service
