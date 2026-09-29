# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Shlok Bhakta's personal portfolio website built with Astro.js, Svelte, and Tailwind CSS. The site features a terminal-inspired design with glassmorphism effects and showcases projects, skills, and experience.

## Development Commands

- `bun run dev` or `bun start` - Start development server
- `bun run build` - Build for production (includes type checking with `astro check`)
- `bun run bundle` - Bundle the SSR server into `dist/server/bundle.mjs` (what ships in Docker)
- `bun run preview` - Preview production build locally
- `bun run check` - Typecheck the project (Astro + Svelte + tests)
- `bun test tests/unit tests/pocketbase` (or `bun run test`) - Unit + mocked PocketBase interaction tests
- `bunx playwright test` (or `bun run test:e2e`) - Browser UI tests (run `bun run build && bun run bundle` first)
- `bun run astro` - Run Astro CLI commands

## Architecture & Tech Stack

**Frontend Framework**: Astro.js with Svelte integration
- Static site generation with server-side rendering capability
- Astro handles routing and page generation
- Svelte components provide interactive functionality
- Tailwind CSS with Catppuccin color scheme for styling

**Key Dependencies**:
- `carta-md` - Markdown editor for blog functionality
- `pocketbase` - Lightweight backend for blog posts and data
- `color-thief-node` - Dynamic color extraction for theming
- `rehype-pretty-code` & `shiki` - Syntax highlighting
- `@catppuccin/tailwindcss` - Color theme integration

**Component Structure**:
- `/src/layouts/Base.astro` - Shared page shell: fonts, meta, nav, footer, per-visit accent color, scroll reveals
- `/src/components/` - Reusable UI components
  - `homepage/BinaryFluid.astro` - Canvas "binary fluid" (stable-fluids grid carrying 0/1 glyphs); used on the homepage hero and 404
  - `blogeditor/` - Svelte CMS for posts/projects (Carta editor, pickers, preview)
  - `navbar.astro`, `footer.astro`, `postCard.astro`
- `/src/lib/accent.ts` - Catppuccin accent palette; one is picked per visit and kept in an `accent` cookie
- `/src/pages/` - Astro page routes
- `/src/styles/` - `global.css` (tokens + shared chrome), `homepage.css`, `collection.css`, `blog.css` (article + CMS preview)

**Routing**:
- `/` - Homepage: binary-fluid hero, experience, hackathons, personal projects (from `src/data/experience.json`)
- `/blog` - Blog listing page
- `/projects` - Projects archive
- `/post/[id]` - Dynamic blog post pages
- `/project/[id]-[title]` - Dynamic project pages
- `/blogeditor` - Blog editing interface (requires authentication)

## Design System

Minimal dark layout with a terminal flavour:
- Colors: near-black `--ink` background, `--paper` text, one Catppuccin `--accent` per visit (footer dot cycles it)
- Type: Inter Variable (headings/body), Instrument Serif italic (display titles, accents), CaskaydiaCove mono (labels, prompts)
- Keep subtext to a minimum: big titles, short mono meta, no paragraphs of description on listing pages
- Shared classes in `global.css`: `.pill`, `.display-title` (serif italic title with a mono `<sup>` count), `.it`, `.reveal`
- Tailwind's Catppuccin utility names still exist (neutrals retuned to the palette above); avoid naming custom classes after Tailwind utilities (e.g. `outline`)

## Deployment

The site is containerized and deployed via GitHub Actions:
- Multi-stage `Dockerfile` builds with Bun, bundles the SSR server for Node, and ships it on `node:22-alpine` (no nginx or node_modules at runtime)
- Serves on port 4321 via `serve.mjs`
- Available at `ghcr.io/shlok-bhakta/portfolio-site:latest`

## File Structure Notes

- `middleware.ts` - Handles redirects and security headers for specific routes
- `consts.ts` - Global site configuration (currently has placeholder values)
- `Other/` directory contains technology icons organized by category
- `public/fonts/` contains custom fonts including pixel.ttf
- `bin/` directory likely contains build/deployment scripts
