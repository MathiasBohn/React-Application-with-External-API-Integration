# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 application with TypeScript, React 19, and Tailwind CSS 4, intended for React application development with external API integration.

## Development Commands

### Running the Development Server
```bash
npm run dev
```
- Starts development server at http://localhost:3000
- Enables hot reload for live code changes

### Building the Application
```bash
npm run build
```
- Creates an optimized production build
- Run this to verify TypeScript compilation and detect build errors

### Starting Production Server
```bash
npm run start
```
- Must run `npm run build` first
- Serves the production build locally

### Linting
```bash
npm run lint
```
- Runs ESLint with Next.js config
- Checks both TypeScript and web vitals rules

## Architecture

### Framework: Next.js 16 App Router

This project uses the **App Router** architecture (not Pages Router):
- All routes are defined in the `app/` directory
- `app/layout.tsx` is the root layout wrapping all pages
- `app/page.tsx` is the home page (route: `/`)
- To create new routes, add folders in `app/` with `page.tsx` files (e.g., `app/about/page.tsx` creates `/about` route)

### Styling: Tailwind CSS 4

- Global styles in `app/globals.css`
- Tailwind configured with PostCSS via `postcss.config.mjs`
- Uses utility-first CSS classes directly in components
- Dark mode support via `dark:` prefixes

### TypeScript Configuration

- Path alias `@/*` maps to project root (use `@/app/...`, `@/components/...`, etc.)
- Strict mode enabled
- JSX set to `react-jsx` (import React not required in files)

### Fonts

- Uses Next.js font optimization with Google Fonts
- Geist Sans and Geist Mono configured in `app/layout.tsx`
- Applied via CSS variables `--font-geist-sans` and `--font-geist-mono`

## Project Structure

```
app/
  layout.tsx       # Root layout with font configuration and metadata
  page.tsx         # Home page component
  globals.css      # Global Tailwind styles
public/            # Static assets (images, SVGs)
next.config.ts     # Next.js configuration
tsconfig.json      # TypeScript configuration
eslint.config.mjs  # ESLint configuration
```

## Key Patterns for External API Integration

When integrating external APIs in this Next.js App Router project:

### Server Components (default)
- Components in `app/` are Server Components by default
- Can directly `fetch()` data from external APIs
- No need for `useEffect` or client-side data fetching
- Example:
```tsx
async function getData() {
  const res = await fetch('https://api.example.com/data');
  return res.json();
}

export default async function Page() {
  const data = await getData();
  return <div>{/* render data */}</div>;
}
```

### Client Components
- Add `'use client'` directive at top of file for interactive components
- Use for components with hooks (useState, useEffect, etc.) or event handlers
- Place in separate files/folders (e.g., `app/components/`)

### API Routes
- Create API endpoints in `app/api/` directory
- File `app/api/hello/route.ts` creates endpoint `/api/hello`
- Use `export async function GET/POST/etc.` for handlers
- Useful for proxying external API calls or server-side logic

### Environment Variables
- Store API keys in `.env.local` (not committed to git)
- Prefix with `NEXT_PUBLIC_` only if needed in browser
- Access via `process.env.VARIABLE_NAME`
