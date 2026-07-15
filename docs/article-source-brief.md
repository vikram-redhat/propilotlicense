# ProPilotLicence — Article Source Brief (for generating the HTML)

Paste this into the chat/tool that generates an article's source HTML (e.g. the
A320 Systems Series articles). It encodes how the site actually publishes these,
so the generated HTML drops in with near-zero adaptation.

You are producing a single self-contained HTML file for one article. A separate
publishing step converts it into the live Next.js page, so follow this contract
exactly — it determines how cleanly the article drops into the site.

## Stack reality (older briefs got this wrong)
- Next.js **16** App Router on Vercel (not 14).
- Content is registered in **`lib/guides.ts`** (a single `GUIDE_SERIES` registry).
  There is **no `lib/blog-posts.ts`** and **no manual `sitemap.ts` editing** — the
  sitemap derives from the registry automatically. Do not reference either.
- Articles live at: `/guides/dgca-exam-guides/<slug>`
  (the "A320 Systems Series" is a conceptual series *within* the `dgca-exam-guides`
  guide series — it is not its own URL segment).

## What to output
A single HTML file. The publisher extracts **only the inner HTML of
`<main class="article-wrap">…</main>`** and renders it verbatim. Therefore:
- DO include everything inside `<main class="article-wrap">`: eyebrow, h1,
  standfirst, byline, series-nav, all sections, diagrams, tables, callouts, CTA,
  disclaimer.
- DO NOT include `<html>`, `<head>`, `<body>`, `<header class="site-header">`, or
  any site nav/footer — the site supplies its own header, footer, and breadcrumb.
- DO NOT use a Google Fonts `@import` — the site uses its own fonts (Outfit for
  headings, system font for body). Any `@import` is stripped.

## Styling contract (this is what makes it theme correctly)
Keep using the **same CSS custom properties and class vocabulary** as the last
article — the publisher's scoped CSS module remaps these variables to the site's
palette tokens, so the article automatically follows the site's light/dark
"palette toggle". Use these variable names (do NOT hardcode hex for chrome, cards,
tables, callouts, pills):

    --ink, --ink-2, --ink-3, --rule, --surface, --surface-2,
    --accent, --accent-lt, --green/--green-bg, --amber/--amber-bg,
    --red/--red-bg, --purple/--purple-bg,
    --normal-c/bg, --alt-c/bg, --direct-c/bg

Reuse these class names so existing styling applies: `diagram-block`,
`diagram-label`, `anim-badge`, `diagram-inner`, `diagram-caption`,
`protection-grid` + `protection-card.normal|partial|none`, `law-table` with
`.feature/.yes/.partial/.no`, `data-table` + `.mono`, `sidestick-grid` +
`sidestick-feature`, `callout.blue|amber|red|green|purple`,
`pill.pill-normal|pill-alt|pill-direct`, `cta-block` + `cta-btn`, `disclaimer`,
`series-nav` (+ `li.current`/`li.upcoming`), `standfirst`, `byline`.

## SVG diagrams
- Inline `<svg viewBox=...>` with `width:100%`. Internal colors may be hardcoded
  hex — those are kept verbatim (they're close to the site blue). Include a
  `<title>` for accessibility.
- Animations: drive them with **classes + `@keyframes`** (e.g. class `sig` for
  signal-flow, `law1/law2/law3` for staged pulses, `pri` for blink). Always
  include a `@media (prefers-reduced-motion: reduce)` rule that disables them.
- Make diagrams legible on mobile (viewBox scales to 100% width; the publisher
  adds horizontal scroll for wide diagrams).

## Provide this metadata block with the article (for the registry)
- slug (e.g. `a320-hydraulic-system`)
- title
- metaTitle (aim ≤ ~60 chars, "… | ProPilotLicence")
- metaDescription (~150–160 chars)
- excerpt (1–2 sentences)
- publishedAt / updatedAt (YYYY-MM-DD)
- reviewedBy: "ProPilotLicence Captain Panel"

## Conventions
- British spelling throughout ("licence", "aluminium", etc.).
- ⚑ flags mark values needing FCOM verification — keep them.
- The series-nav links use `/guides/dgca-exam-guides/<slug>`; upcoming/not-yet-
  published articles can be listed (they'll 404 until published — that's fine).

---

### Publisher-side notes (how the HTML becomes a page — for reference)
For each article the publisher creates a route folder under
`app/guides/dgca-exam-guides/<slug>/`:
- `articleBody.ts` — the inner `<main>` HTML as a `String.raw` export, verbatim.
- `styles.module.css` — the article's `<style>`, scoped under a `.wrap` class
  (class selectors via `:global(...)`, element selectors bare), with the CSS
  variables above **remapped to site tokens** (`--accent → var(--clr-primary)`,
  `--surface → var(--clr-surface)`, greens → `--clr-correct*`, ambers →
  `--clr-amber*`, reds → `--clr-wrong*`, etc.), headings switched to
  `var(--font-outfit)`. Keyframes are module-scoped (not `:global {}` — Turbopack
  rejects that block form); the bundler rewrites `animation-name` to match.
- `page.tsx` — `LandingHeader` + `SiteFooter` + ArticleKit `Breadcrumb` +
  `ArticleSchema` + `buildMetadata`, with `<main className={styles.wrap}
  dangerouslySetInnerHTML={{ __html: ARTICLE_BODY }} />`.
Then add the post to `GUIDE_SERIES` (`dgca-exam-guides`) in `lib/guides.ts`.
Run `npm run build` to confirm the CSS module compiles before pushing.
