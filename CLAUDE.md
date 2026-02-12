# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VFX Reference Platform - a Jekyll-based static site documenting reference platform specifications for VFX/animation software. Hosted with Github Pages and published to https://vfxplatform.com. 

**Stack:** Jekyll 4.3 (Ruby), Tailwind CSS 3.4, PostCSS, vanilla JS

## Documentation

The README.md file contains a friendly guide on how to administer the site aimed at the site adminitration team. It should be updated as features are added or changed so that it always accurately reflects up to date instructions on how to update the site content.

## Development Commands

```bash
# Install dependencies
npm install && bundle install

# Development (CSS watch + Jekyll livereload on localhost:4000)
npm run dev

# Production build
npm run build

# Individual commands
npm run build:css      # One-time Tailwind build
npm run watch:css      # Watch mode for CSS
bundle exec jekyll serve --livereload
```

## Architecture

**Data-driven content:** Platform specs live in YAML files, not code. Most updates are data edits.

```
_data/
├── platforms/CY20XX.yml  # Version specs per year (CY2014-CY2026)
├── components.yml        # Component metadata and categories
├── faq.yml              # FAQ Q&A content
├── navigation.yml       # Main navigation menu
└── notes.yml            # Technical footnotes
```

**Key config in `_config.yml`:**
- `current_year: 2026` - Active platform year
- `supported_years_count: 4` - Total number of years shown in tables, except on pages where all platform history is shown.

**Templates:**
- `_includes/platform-table.html` - Main specs table component
- `_layouts/default.html` - Base page layout
- `assets/css/main.css` - Tailwind directives + custom components

## Common Tasks

**Add new platform year:** Create `_data/platforms/CY[YEAR].yml` following existing schema. Tables auto-render it.

**Update component versions:** Edit `_data/platforms/CY[YEAR].yml` - no code changes needed.

**Add FAQ entry:** Append to `_data/faq.yml`

**Add technical note:** Add to `_data/notes.yml`, reference with `note:` key in platform data

## Platform Data Schema

Each `_data/platforms/CY[YEAR].yml` contains:
- `year`, `status`, `last_updated`
- `linux`: gcc/glibc versions with `min_max: true` flag
- `macos`: deployment_target with optional `note:` reference
- `windows`: visual_studio, sdk versions
- `components`: python, qt, pyqt, pyside, numpy, imath, openexr, ptex, opensubdiv, openvdb, alembic, fbx, opencolorio, aces, boost, onetbb, onemkl, cpp_standard

## Deployment

Push to main branch triggers GitHub Actions (`.github/workflows/deploy.yml`) which builds and deploys to GitHub Pages automatically.
