# VFX Reference Platform Web Site

This repo hosts the VFX Reference Platform web site hosted at https://vfxplatform.com.

## Table of Contents

1. [Introduction](#introduction)
2. [Quick Start](#quick-start)
3. [Site Architecture](#site-architecture)
4. [Common Tasks](#common-tasks)
   - [Adding a Status Update](#adding-a-status-update)
   - [Adding a New Platform Year](#adding-a-new-platform-year)
   - [Updating Component Versions](#updating-component-versions)
   - [Adding/Editing Notes (Footnotes)](#addingediting-notes-footnotes)
   - [Adding FAQ Entries](#adding-faq-entries)
   - [Modifying Navigation](#modifying-navigation)
5. [YAML Syntax Reference](#yaml-syntax-reference)
6. [Deployment](#deployment)
7. [Configuration Reference](#configuration-reference)
8. [Troubleshooting](#troubleshooting)

---

## Introduction

This website is built using **Jekyll**, a static site generator. Unlike traditional HTML websites where you edit HTML files directly, this site uses a **data-driven architecture**:

- **Content lives in simple text files** (YAML format) in the `_data/` folder
- **Templates automatically generate HTML** from these data files
- **Most updates require no code changes** — just edit the relevant data file

This approach makes content updates straightforward: find the right file, edit the text, and push to `master`. The site rebuilds automatically using the Github Actions workflow defined in .github/workflows.

---

## Quick Start

### Making Updates

For most content updates:

1. Edit the relevant YAML file in `_data/` (see [Common Tasks](#common-tasks) below)
2. Commit and push to the `master` branch
3. GitHub Actions automatically builds and deploys the site
4. Changes appear live within a few minutes

### Local Development (Optional)

If you want to preview changes before pushing, you can run the site locally.

**Prerequisites:**
- Node.js (v18 or later)
- Ruby (v3.0 or later)

**Installation:**
```bash
npm install && bundle install
```

**Running locally:**
```bash
npm run dev
```

This starts the site at `http://localhost:4000` with live reload — changes to files automatically refresh the browser.

---

## Site Architecture

All site content is driven by YAML data files in the `_data/` folder. Here's what each file controls:

```
_data/
├── platforms/           # Platform specifications (one file per year)
│   ├── CY2014.yml
│   ├── CY2015.yml
│   ├── ...
│   └── CY2026.yml
├── components.yml       # Component metadata and categories
├── faq.yml              # FAQ questions and answers
├── navigation.yml       # Main navigation menu links
├── notes.yml            # Technical footnotes referenced from platform data
└── status_updates.yml   # Status updates shown on the homepage
```

**Key point:** You rarely need to touch HTML templates. Almost all routine updates involve editing these YAML files.

---

## Common Tasks

### Adding a Status Update

Status updates appear on the homepage to announce new platform versions, drafts, and other news.

**File:** `_data/status_updates.yml`

**Add new entries at the TOP of the `updates:` list** (newest first):

```yaml
updates:
  - date: "2025-11-05"
    display_date: "5th November 2025"
    content: |
      CY2026 is now Final and will be effective from January 1st. All package
      versions called out by the platform are now released.

  - date: "2025-05-07"
    display_date: "7th May 2025"
    content: |
      CY2026 Draft published. We are currently soliciting feedback...
```

**Required fields:**
- `date`: Used for sorting (format: `YYYY-MM-DD`). Add a letter suffix like `2024-09-02b` if multiple updates on the same day.
- `display_date`: Human-readable date shown on the site
- `content`: The update text. Use `|` for multi-line content. Markdown formatting is supported (links, bold, etc.)

---

### Adding a New Platform Year

When a new calendar year's platform is announced, create a new data file.

**Step 1:** Create a new file `_data/platforms/CY[YEAR].yml`

Copy the structure from the previous year's file as a starting point:

```yaml
year: 2027
status: draft
last_updated: "2026-05-15"

linux:
  gcc:
    version: "14.2"
    min_max: true
  glibc:
    version: "2.28"
    min_max: true

macos:
  deployment_target:
    version: "14.0"
    note: footnote-macos

windows:
  visual_studio:
    version: "Visual Studio 2022 v17.6 or later"
  sdk:
    version: "10.0.22621 or later"

components:
  python:
    version: "3.13.x"
  qt:
    version: "6.8.x"
  # ... (copy all components from previous year)
```

**Step 2:** Update the site configuration

Edit `_config.yml` to set the new current year:

```yaml
current_year: 2027
```

**Status values:**
- `draft` — Platform is under development, not yet finalized
- `final` — Platform is locked and effective

---

### Updating Component Versions

To update a version number for any component (Python, Qt, OpenEXR, etc.):

**File:** `_data/platforms/CY[YEAR].yml`

Find the component and change its version:

```yaml
components:
  python:
    version: "3.13.x"      # Change this line
  qt:
    version: "6.8.x"
```

**Optional fields for components:**

```yaml
components:
  onetbb:
    version: "2022.x"
    min_max: true           # Displays as "minimum/maximum" instead of exact version
    note: footnote-tbb      # References a footnote from notes.yml
    inline_note: "See migration guide"  # Short note displayed inline
```

---

### Adding/Editing Notes (Footnotes)

Notes provide detailed explanations that appear as expandable footnotes, linked from platform tables.

**File:** `_data/notes.yml`

**Structure:**

```yaml
notes:
  - id: footnote-macos
    title: "Notes - macOS"
    from_year: 2018
    content: |
      **Minimum Deployment Target in Xcode**

      Xcode's "Deployment Target" identifies the earliest OS version...

      More information is [available here](https://example.com).

  - id: footnote-gcc9
    title: "Note - gcc 9 and 11"
    from_year: 2021
    to_year: 2024
    content: |
      For users of Red Hat Enterprise Linux...
```

**Fields:**
- `id`: Unique identifier referenced by `note:` in platform data
- `title`: Heading displayed for the footnote
- `from_year`: First platform year this note applies to (inclusive)
- `to_year`: Last platform year this note applies to (inclusive, optional)
- `content`: Markdown-formatted content

**Referencing a note from platform data:**

```yaml
macos:
  deployment_target:
    version: "14.0"
    note: footnote-macos    # Must match an id in notes.yml
```

**Year filtering:** Notes only appear for platform years within their `from_year`/`to_year` range. If `to_year` is omitted, the note applies to all years from `from_year` onward.

---

### Adding FAQ Entries

**File:** `_data/faq.yml`

Add new questions to the `questions:` list:

```yaml
questions:
  - id: my-new-question
    question: "What is the VFX Reference Platform?"
    answer: |
      The VFX Reference Platform is a set of version guidelines...

      For more information, see the [About page](/about/).
```

**Fields:**
- `id`: Unique identifier (used for anchor links)
- `question`: The question text
- `answer`: Markdown-formatted answer (use `|` for multi-line)

---

### Modifying Navigation

**File:** `_data/navigation.yml`

The main navigation menu is a simple list:

```yaml
main:
  - title: Home
    url: /
  - title: Compare
    url: /compare.html
  - title: Linux
    url: /linux/
  - title: FAQ
    url: /FAQ/
  - title: About
    url: /about/
  - title: Contact
    url: /contact/
```

Add, remove, or reorder items as needed. URLs can be:
- Relative paths (`/about/`)
- Full URLs (`https://example.com`)

---

## YAML Syntax Reference

YAML is a human-readable data format. Here are the key rules:

### Indentation

**Use spaces, not tabs.** Indentation indicates structure:

```yaml
parent:
  child: value        # 2 spaces indent
  another_child:
    grandchild: value # 4 spaces indent
```

### Strings

Plain strings usually don't need quotes:

```yaml
version: 3.13.x
title: Home
```

**Use quotes when the string contains special characters** (colons, quotes, etc.):

```yaml
version: "Visual Studio 2022 v17.6 or later"
display_date: "5th November 2025"
```

### Multi-line Text

Use `|` to preserve line breaks:

```yaml
content: |
  This is the first paragraph.

  This is the second paragraph with a [link](https://example.com).

  - Bullet point one
  - Bullet point two
```

### Lists

```yaml
# Simple list
items:
  - first item
  - second item

# List of objects
updates:
  - date: "2025-01-01"
    content: First update
  - date: "2025-02-01"
    content: Second update
```

### Common Mistakes

| Mistake | Problem | Fix |
|---------|---------|-----|
| Using tabs | YAML requires spaces | Convert tabs to spaces (2-space indent) |
| Missing quotes | Special characters break parsing | Wrap in quotes: `"value: with colon"` |
| Wrong indentation | Breaks structure | Align child items under parent |
| Trailing spaces | Can cause issues | Remove whitespace at end of lines |

---

## Deployment

Deployment is **fully automated** via GitHub Actions.

### How It Works

1. Push changes to the `master` branch
2. GitHub Actions automatically:
   - Builds Tailwind CSS
   - Builds the Jekyll site
   - Deploys to GitHub Pages
3. Changes appear live within a few minutes

### Checking Deployment Status

1. Go to the GitHub repository
2. Click the **Actions** tab
3. Look for the latest "Deploy Jekyll with Tailwind" workflow run
4. Green checkmark = success, Red X = failure

### If Deployment Fails

1. Click on the failed workflow run
2. Expand the failed step to see the error message
3. Common issues:
   - YAML syntax errors (missing quotes, wrong indentation)
   - Invalid file references
   - Missing required fields

---

## Configuration Reference

**File:** `_config.yml`

Key settings you might need to change:

```yaml
# The current/active platform year (shown as default in tables)
current_year: 2026

# Number of years shown in main tables (older years shown on history pages)
supported_years_count: 4
```

Other settings (rarely need changing):
- `title`: Site title
- `description`: Site description for SEO
- `url`: Production site URL

**Important:** After changing `_config.yml`, you must restart the local Jekyll server to see changes.

---

## Troubleshooting

### "The site doesn't update after I push"

1. Check GitHub Actions for build errors (see [Deployment](#deployment))
2. Hard refresh your browser (Ctrl+Shift+R / Cmd+Shift+R)
3. Wait a few more minutes — sometimes CDN caching causes delays

### "YAML syntax error"

Use an online YAML validator like [YAML Lint](https://www.yamllint.com/) to check your file. Common fixes:

- Ensure consistent 2-space indentation
- Add quotes around strings with special characters
- Check for missing colons after keys

### "My note isn't appearing"

1. Verify the `id` in `notes.yml` matches the `note:` reference in the platform file
2. Check that the platform year falls within the note's `from_year`/`to_year` range
3. Ensure proper indentation in the platform file

### "Local server won't start"

```bash
# Reinstall dependencies
rm -rf node_modules
npm install
bundle install

# Try running again
npm run dev
```

### "CSS changes aren't showing"

The CSS is built from Tailwind. If running locally:

```bash
# In one terminal
npm run watch:css

# In another terminal
bundle exec jekyll serve --livereload
```

Or just use `npm run dev` which runs both.

---

## Getting Help

For questions about content updates or site maintenance, email feedback [at] vfxplatform.com.

For technical issues with Jekyll or the build process, refer to:
- [Jekyll Documentation](https://jekyllrb.com/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
