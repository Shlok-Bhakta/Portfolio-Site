# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Shlok Bhakta's personal portfolio website built with Astro.js, Svelte, and Tailwind CSS. The site features a terminal-inspired design with glassmorphism effects and showcases projects, skills, and experience.

## Development Commands

- `npm run dev` or `npm start` - Start development server
- `npm run build` - Build for production (includes type checking with `astro check`)  
- `npm run preview` - Preview production build locally
- `npm run astro` - Run Astro CLI commands

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
- `/src/components/` - Reusable UI components
  - `glassmorphism/` - Glassmorphic container components
  - `homepage/` - Homepage-specific components (ezatree.svelte)
  - `navbar.astro` - Main navigation
- `/src/pages/` - Astro page routes
- `/src/styles/` - Global CSS and component styles

**Routing**:
- `/` - Homepage with terminal-themed portfolio
- `/blog` - Blog listing page
- `/projects` - Projects showcase
- `/post/[id]` - Dynamic blog post pages
- `/project/[id]-[title]` - Dynamic project pages
- `/blogeditor` - Blog editing interface (requires authentication)

## Key Features

**Terminal Theme**: Homepage designed as an interactive terminal interface with:
- Neofetch-style personal info display
- `eza -T` command simulation for skills tree
- Git log format for experience timeline
- Dynamic Catppuccin color theming

**Blog System**: 
- Markdown-based blog posts with syntax highlighting
- Blog editor interface with live preview
- PocketBase integration for post management

**Interactive Elements**:
- Glassmorphic containers with hover effects  
- Responsive navigation with hamburger menu
- Scroll-triggered animations

## Deployment

The site is containerized and deployed via GitHub Actions:
- Dockerfile builds static assets
- Nginx serves the built site
- Available at `ghcr.io/shlok-bhakta/portfolio-site:latest`

## File Structure Notes

- `middleware.ts` - Handles redirects and security headers for specific routes
- `consts.ts` - Global site configuration (currently has placeholder values)
- `Other/` directory contains technology icons organized by category
- `public/fonts/` contains custom fonts including pixel.ttf
- `bin/` directory likely contains build/deployment scripts

## Code Cleanup & Refactoring Notes

**Recent Refactoring (2025-01-26)**:
- **Removed unused code**: Eliminated commented-out Meteors component and its imports
- **Component extraction**: Broke down the large `index.astro` (600+ lines) into modular components:
  - `HeroSection.astro` - Terminal-style personal info display
  - `SkillsSection.astro` - Skills tree with eza command simulation
  - `AboutSection.astro` - About me section with professional objectives
  - `ExperienceSection.astro` - Work experience and project timeline
  - `FooterSection.astro` - Footer with thank you message
  - `HomePageScripts.astro` - All JavaScript functionality (sticky navbar, scroll animations, branch line generation)
- **Style organization**: Moved inline CSS to dedicated `homepage.css` file
- **Improved maintainability**: Each section is now self-contained and reusable
- **No visual changes**: All refactoring maintained exact same appearance and functionality

**Glassmorphic Component Optimizations**:
- **Removed dead code**: Eliminated unused `rgbToHsl()` function (24 lines)  
- **Cleaned up CSS**: Removed commented-out styles and redundant border-radius rules
- **Simplified DOM structure**: Removed redundant overlay element, kept only functional one
- **Performance improvements**: 
  - Fixed throttling rate (30fps → 60fps) to match comments
  - Added squared distance comparison to avoid unnecessary sqrt calculations
  - Removed unused `id` parameter in forEach callback
- **Reduced bundle size**: Cleaner code means less JavaScript to parse/execute
