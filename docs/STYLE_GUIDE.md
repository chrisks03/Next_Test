## Style Guide

A quick reference for editing typography and colors across the app. Values reflect the current configuration.

### Typography

Source of truth:
- Tailwind font families: `tailwind.config.ts` → `theme.extend.fontFamily`
- Global usage: `src/app/globals.css` and `src/app/layout.tsx`

Fonts (Tailwind classes → font stacks):
- `font-sans`: `['Arial Condensed', 'Arial', 'sans-serif']`
- `font-serif`: `['Times New Roman', 'serif']`

Global application:
- Body text: `font-sans` (`src/app/globals.css`, and `<body className="font-sans">` in `layout.tsx`)
- Headings `h1–h6`: `font-serif` (`src/app/globals.css`)

How to change fonts:
1) Update stacks in `tailwind.config.ts` under `theme.extend.fontFamily`.
2) If you want different defaults, change the utilities used in `src/app/globals.css` (e.g., use `font-serif` on `body`, or apply sizes/weights).

Suggested utility examples (apply in components or globals as needed):
- Headline: `text-3xl md:text-4xl font-serif tracking-tight`
- Subhead: `text-xl md:text-2xl font-serif`
- Body: `text-sm md:text-base font-sans leading-relaxed`
- Caption: `text-xs text-muted-foreground`

### Colors

Source of truth:
- Theme tokens are CSS variables defined in `src/app/globals.css` under `@layer base` → `:root` and `.dark`.
- Tailwind maps these variables in `tailwind.config.ts` under `theme.extend.colors` (e.g., `background: 'hsl(var(--background))'`).

Light theme variables (`:root`):
- `--background`: `0 0% 100%`
- `--foreground`: `222.2 84% 4.9%`
- `--card`: `0 0% 100%`
- `--card-foreground`: `222.2 84% 4.9%`
- `--popover`: `0 0% 100%`
- `--popover-foreground`: `222.2 84% 4.9%`
- `--primary`: `222.2 47.4% 11.2%`
- `--primary-foreground`: `210 40% 98%`
- `--secondary`: `210 40% 96%`
- `--secondary-foreground`: `222.2 84% 4.9%`
- `--muted`: `210 40% 96%`
- `--muted-foreground`: `215.4 16.3% 46.9%`
- `--accent`: `210 40% 96%`
- `--accent-foreground`: `222.2 84% 4.9%`
- `--destructive`: `0 84.2% 60.2%`
- `--destructive-foreground`: `210 40% 98%`
- `--border`: `214.3 31.8% 91.4%`
- `--input`: `214.3 31.8% 91.4%`
- `--ring`: `222.2 84% 4.9%`
- Charts:
  - `--chart-1`: `12 76% 61%`
  - `--chart-2`: `173 58% 39%`
  - `--chart-3`: `197 37% 24%`
  - `--chart-4`: `43 74% 66%`
  - `--chart-5`: `27 87% 67%`

Dark theme variables (`.dark`):
- `--background`: `222.2 84% 4.9%`
- `--foreground`: `210 40% 98%`
- `--card`: `222.2 84% 4.9%`
- `--card-foreground`: `210 40% 98%`
- `--popover`: `222.2 84% 4.9%`
- `--popover-foreground`: `210 40% 98%`
- `--primary`: `210 40% 98%`
- `--primary-foreground`: `222.2 47.4% 11.2%`
- `--secondary`: `217.2 32.6% 17.5%`
- `--secondary-foreground`: `210 40% 98%`
- `--muted`: `217.2 32.6% 17.5%`
- `--muted-foreground`: `215 20.2% 65.1%`
- `--accent`: `217.2 32.6% 17.5%`
- `--accent-foreground`: `210 40% 98%`
- `--destructive`: `0 62.8% 30.6%`
- `--destructive-foreground`: `210 40% 98%`
- `--border`: `217.2 32.6% 17.5%`
- `--input`: `217.2 32.6% 17.5%`
- `--ring`: `212.7 26.8% 83.9%`
- Charts:
  - `--chart-1`: `220 70% 50%`
  - `--chart-2`: `160 60% 45%`
  - `--chart-3`: `30 80% 55%`
  - `--chart-4`: `280 65% 60%`
  - `--chart-5`: `340 75% 55%`

How to change colors:
1) Edit HSL values in `src/app/globals.css` for the relevant variables (light and/or dark).
2) Tailwind classes like `bg-background`, `text-foreground`, `border`, `muted`, `accent`, etc., update automatically via the token mapping in `tailwind.config.ts`.

Common Tailwind color utilities used:
- Backgrounds: `bg-background`, `bg-card`, `bg-popover`, `bg-muted`, `bg-accent`, `bg-primary`, `bg-secondary`
- Text: `text-foreground`, `text-muted-foreground`, `text-primary-foreground`, `text-secondary-foreground`, `text-accent-foreground`
- Borders and rings: `border`, `ring-1 ring-ring`

### Quick checklist
- Change fonts → `tailwind.config.ts` (stacks) and `globals.css` (where applied)
- Change color theme → `globals.css` HSL tokens (both `:root` and `.dark`)
- Verify components pick up changes via Tailwind utilities


