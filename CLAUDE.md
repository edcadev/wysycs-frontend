# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WYSCYS (What You See Can You Save) is a global forest monitoring platform for a 2025 hackathon project that uses NASA satellite data to detect and visualize deforestation and wildfires in real-time. The project is a Next.js 14 frontend application built with TypeScript, React 18, and Tailwind CSS.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 with custom theme variables
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Fonts**: Geist Sans & Geist Mono
- **Forms**: React Hook Form with Zod validation
- **Analytics**: Vercel Analytics
- **Package Manager**: pnpm
- **Internationalization**: next-intl
- **Maps**: Leaflet with heatmap support
- **Charts**: Recharts

## Common Commands

- `pnpm dev` - Start development server (runs on http://localhost:3000)
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Architecture

### Directory Structure

- `app/` - Next.js App Router
  - `[locale]/` - Internationalized routes (es/en)
    - `layout.tsx` - Locale-specific layout with NextIntlClientProvider
    - `page.tsx` - Landing page
    - `dashboard/` - Dashboard application
      - `layout.tsx` - Dashboard layout with sidebar navigation
      - `page.tsx` - Main dashboard overview
      - `fires/page.tsx` - Fire monitoring and alerts
      - `guardian/page.tsx` - Guardian profile management
      - `forests/[id]/page.tsx` - Individual forest detail pages
  - `layout.tsx` - Root layout with dynamic lang attribute
  - `globals.css` - Global styles with custom Tailwind theme
- `components/` - React components
  - `ui/` - shadcn/ui components (auto-generated, do not manually edit)
  - `theme-provider.tsx` - Theme management component
  - `dashboard-header.tsx` - Reusable dashboard header
  - `d3-forest-map.tsx` - D3.js interactive forest map
  - `forest-adoption-dialog.tsx` - Forest adoption form dialog
  - `language-switcher.tsx` - Language selection dropdown
- `i18n/` - Internationalization configuration
  - `request.ts` - next-intl configuration
  - `routing.ts` - Locale routing and navigation helpers
- `messages/` - Translation files
  - `es.json` - Spanish translations (default)
  - `en.json` - English translations
- `lib/` - Utility functions
  - `utils.ts` - cn() function for className merging
- `hooks/` - Custom React hooks
  - `use-toast.ts` - Toast notifications
  - `use-mobile.ts` - Mobile detection
- `public/` - Static assets
- `middleware.ts` - next-intl middleware for locale detection
- `I18N.md` - Comprehensive internationalization documentation

### Import Aliases

TypeScript path aliases are configured in `tsconfig.json`:
- `@/*` - Root directory (e.g., `@/components`, `@/lib/utils`)

### Styling Approach

The project uses a custom environmental monitoring theme with Tailwind CSS v4:
- Color palette defined using OKLCH color space in `app/globals.css`
- Primary: Deep cyan (`oklch(0.25 0.05 200)`)
- Secondary/Accent: Emerald green (`oklch(0.65 0.15 150)`)
- Destructive: Red for alerts (`oklch(0.55 0.2 25)`)
- CSS custom properties for theme variables
- Dark mode support via `.dark` class variant

### UI Component System

This project uses shadcn/ui components configured in `components.json`:
- Style: "new-york"
- Base color: neutral
- Icon library: Lucide
- Components are in `components/ui/`
- To add new shadcn/ui components, use the shadcn CLI

### Build Configuration

Next.js is configured in `next.config.mjs` with:
- **next-intl plugin**: Integrated via `createNextIntlPlugin('./i18n/request.ts')`
- ESLint disabled during builds (`ignoreDuringBuilds: true`)
- TypeScript errors ignored during builds (`ignoreBuildErrors: true`)
- Image optimization disabled (`unoptimized: true`)

These settings suggest rapid prototyping for the hackathon context.

### Internationalization (i18n)

The application is fully internationalized using `next-intl`:

**Supported Locales:**
- Spanish (`es`) - Default locale
- English (`en`)

**Key Patterns:**
- All routes are prefixed with locale: `/es/dashboard`, `/en/dashboard`
- Use `useTranslations()` hook in client components to access translations
- Import navigation helpers from `@/i18n/routing` instead of `next/navigation`
- Translations are organized by section in `messages/es.json` and `messages/en.json`

**Example usage:**
```tsx
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';

const t = useTranslations('dashboard');
<h1>{t('title')}</h1>
<Link href="/fires">{t('nav.fires')}</Link>
```

For comprehensive i18n documentation, see `I18N.md`.

## Backend Integration

### API Configuration

The project integrates with a FastAPI backend deployed on Railway:
- **Production API**: `https://web-production-7dae.up.railway.app/api/v1`
- **Key Endpoints**:
  - `/fires/peru` - NASA FIRMS fire data for Peru
  - `/fires/analyze` - Risk analysis for specific coordinates
  - `/forests` - Forest data and adoption system
  - `/forest/{id}/health` - NDVI health metrics from NASA MODIS

### Data Sources

All visualization components fetch real-time data from NASA satellite APIs:
- **NASA FIRMS**: Fire detection via VIIRS sensors (updated every 2 hours)
- **NASA MODIS**: NDVI vegetation health index
- **Prophet ML**: Forest health trend predictions

### Client Components Pattern

Dashboard components are client-side (`"use client"`) for:
- Real-time data fetching with `useEffect`
- Interactive maps (Leaflet with heatmap layers)
- User interactions (adoption, alerts)
- Internationalization hooks (`useTranslations`, `useLocale`)

## Development Notes

- All user-facing pages are under `app/[locale]/` for internationalization
- Use `Link` and `useRouter` from `@/i18n/routing` for navigation (not from `next/navigation`)
- Dashboard uses sidebar navigation with real-time data updates
- API calls should use the `API_BASE` constant defined in components
- The project is designed for hackathon presentation with rapid iteration
- Uses Vercel Analytics for tracking

## Working with Translations

When adding new features or updating text:

1. **Add translation keys to both locale files:**
   - `messages/es.json` - Spanish version
   - `messages/en.json` - English version

2. **Keep the same structure in both files:**
   ```json
   {
     "newSection": {
       "title": "Título",
       "description": "Descripción"
     }
   }
   ```

3. **Use in components:**
   ```tsx
   const t = useTranslations('newSection');
   <h1>{t('title')}</h1>
   ```

4. **For dynamic values, use interpolation:**
   ```tsx
   // In messages: "greeting": "Hello {name}"
   t('greeting', { name: userName })
   ```

## TypeScript Type Safety

When working with API responses:
- Define explicit types for NASA data structures (fires, NDVI, etc.)
- Avoid implicit `any` types in data transformation functions
- Use type guards when processing uncertain API response shapes
- Properly type React component props and state
