# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development

Serve locally with any static server:
```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

No build step, no dependencies, no package manager.

## Architecture

Pure vanilla HTML/CSS/JS — no framework, no transpiler.

| File | Role |
|------|------|
| `index.html` | All page content (both languages baked in as static HTML) |
| `styles.css` | All visual styles |
| `script.js` | Interactivity only: hero scroll, language toggle, theme toggle, accordion |
| `logo.png` | Site logo (used in nav + brain scene) |

### Bilingual system

Language is controlled by `data-lang` attribute on `<html>` (values: `"es"` / `"en"`).
CSS classes toggle visibility — no JS re-renders:
- `.es-only` — hidden when `data-lang="en"`
- `.en-only` — hidden when `data-lang="es"` (default)
- `.es-block` / `.en-block` — same but for block-level elements

All copy lives directly in `index.html`. To add/edit content, edit the HTML; update both the `.es-only` and `.en-only` sibling spans.

### Theme system

`data-theme` attribute on `<html>` (`""` = light, `"dark"` = dark).
CSS variables in `:root` and `[data-theme="dark"]` in `styles.css` control all colors.

### Accent color

`--accent: #3a3f47` (light mode), `--accent: #8a96a3` (dark mode). Every interactive element, number, dot, and highlight uses `var(--accent)` — change only these two CSS variables to retheme the whole site.

### Hero horizontal scroll

`<section#inicio>` has `height: 500vh`. Inside is a sticky container + a `#hero-track` div (`width: 500vw`) that translates on the X axis as the user scrolls. `script.js:initHeroScroll()` maps scroll progress (0–1) to `translateX`. Each of the 5 `.scene` panels is `100vw` wide.

### Sections

Order in DOM: Hero → Empresas (`#clientes`) → Soluciones (`#soluciones`) → Proceso (`#proceso`) → Proyectos (`#proyectos`) → Contacto (`#contacto`).

The `.sol-card`, `.proy-row`, `.tile`, `.proceso-step` elements are repeated patterns — add new items by duplicating existing markup blocks.

### Placeholder slots

The `empresas-grid` bento contains `.img-slot` tiles marked `RENDER 3D` / `LOGO` — replace their contents with `<img>` tags when real assets are available. The grid uses `grid-column: span N` / `grid-row: span N` for the asymmetric layout; adjust spans to recompose.
