---
title: Site Branding
description: Customize the catalog's appearance for your organization.
---

## Basic branding

Update the `site:` section in `registry-mapping.yaml`:

```yaml
site:
  name: Architecture Catalog           # catalog name (subtitle on homepage)
  company: Acme Corp                   # company name (main heading on homepage)
  description: Acme Corp engineering   # appears on dashboard subtitle
  logo_text: A                         # single character in sidebar logo
  # logo_image: /logo.svg             # optional: path to image in catalog-ui/public/
```

When `company` is set, the homepage shows the company name as the main `h1` heading with the catalog `name` as smaller subtext below it. If `company` is omitted, the `name` is used as the main heading instead.

## Domain colors

Set your brand palette for domain cards:

```yaml
domain_color_palette:
  - "#1e40af"   # your brand blue
  - "#7c3aed"   # your brand purple
  - "#dc2626"   # your brand red
```

Colors are assigned to domains in order of discovery (largest domains first). If you have more domains than colors, the palette cycles.

## CSS design tokens

The catalog UI uses CSS custom properties for all colors. Edit `catalog-ui/src/styles/global.css` to change the palette:

```css
:root {
  --ec-page-bg: 255 255 255;
  --ec-page-text: 30 41 59;
  --ec-page-text-muted: 100 116 139;
  --ec-border: 226 232 240;
  --ec-card-bg: 255 255 255;
}
```

These use the RGB variable pattern (without `rgb()` wrapper) so they can be composed with alpha values: `rgb(var(--ec-page-bg) / 0.5)`.
