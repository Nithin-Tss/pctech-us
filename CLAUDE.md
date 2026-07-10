# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev            # start Astro dev server
npm run build           # production build (runs prebuild checks first, see below)
npm run preview         # preview the production build

npm run lint            # eslint .
npm run lint:fix        # eslint . --fix
npm run format           # prettier --write .
npm run format:check    # prettier --check .
npm run knip             # find unused files/exports/deps
npm run cpd              # jscpd duplicate-code check over src (threshold 5)
```

`npm run build` runs `prebuild` first, which chains `lint`, `format:check`, `knip`, and `cpd` — a build fails if any of these fail, not just on compile errors. There is no test runner/framework configured in this project.

To check a single file, run the tool directly against it, e.g. `npx eslint src/pages/sap.astro` or `npx prettier --check src/components/Header.astro`.

## Architecture

This is an Astro static marketing site (Astro v7, Tailwind v4 via `@tailwindcss/vite`, no other UI framework). Pages are `.astro` files under `src/pages/`; each maps 1:1 to a route by filename.

**Service/platform pages are generated, not hand-built.** `src/pages/{cloud-practices,data-analytics,digital-transformation,rpo,salesforce,servicenow,oracle,sap}.astro` are all thin ~34-line wrappers that import `src/components/ServicePage.astro` and pass it `title`, `tagline`, `intro`, `heroImage`, and a `features` array (each feature has a `title`, `desc`, and `icon` name). `ServicePage.astro` owns all the actual markup: hero banner, overview, feature grid, a services sidebar (hardcoded service list, marks the active one by matching `title`), and the closing "Have a project in mind?" CTA. When adding a new service or platform page, follow this pattern rather than writing new markup — and update the hardcoded service/platform lists in both `ServicePage.astro` and `Header.astro` (and `Footer.astro` if it has its own list) so navigation stays in sync.

**Non-service pages** (`index.astro`, `about-us.astro`, `solutions.astro`, `careers.astro`, `contact-us.astro`, `it-development.astro`) are hand-built and compose `Header`, `Footer`, `PageHero` (hero banner with eyebrow/title/tagline/breadcrumb), and `CtaBanner` (closing call-to-action with heading/body/cta/bgImage) directly instead of going through `ServicePage`.

**Icons** are centralized in `src/components/icons/FeatureIcon.astro` — a single component that switch-renders inline SVG paths based on a `name` prop (e.g. `rocket`, `code`, `gauge`, `db-migrate`, `headset`). There is no icon library; add new icons by adding another `{name === '...' && (...)}` block here.

**Styling**: Tailwind v4 is configured via CSS in `src/styles/global.css` (no `tailwind.config.js`) using `@theme` to define custom design tokens — brand colors (`brand`, `brand-dark`, `brand-stripe`, `cream`, `cream-alt`, `sage`, `sage-dark`, `sage-muted`, `ink`, `ink-muted`, `ink-light`, `mist`), the `Google Sans` font, and a `marquee` animation. Use these theme tokens (`text-brand-dark`, `bg-cream`, etc.) instead of raw hex values or ad-hoc colors. `BaseLayout.astro` is the root HTML shell (doctype, head, fonts, title templated as `{title} | P & C Technology Consulting`) that every page/component ultimately renders into.

Repeated hero-banner background (a diagonal striped gradient over `#2B4D01`/`#24400a`) appears inline in both `ServicePage.astro` and `PageHero.astro` — keep these in sync if the brand pattern changes.
