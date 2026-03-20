---
name: project-architecture
description: >
  Deep architecture reference for OnyxUI (@jacshuo/onyx). Load when you need to understand
  the full project structure, build pipeline, style system internals, component category system,
  export strategy, release workflow, or testing infrastructure. Keywords: architecture, project structure,
  build system, tsup, webpack, style system, tokens, CVA, export barrel, release pipeline, CI/CD,
  component categories, demo routing, test setup, postcss, tailwind v4 configuration.
---

# OnyxUI — Project Architecture Reference

## 1. Repository Identity

| Field | Value |
|---|---|
| Package name | `@jacshuo/onyx` |
| Current version | See `package.json` |
| Description | Cross-platform React UI component library — web & Electron |
| GitHub repo | `https://github.com/jacshuo/OnyxUI` |
| Demo URL | `https://jacshuo.github.io/OnyxUI` |
| License | See `LICENSE` file |
| Peer deps | `react >=18.0.0`, `react-dom >=18.0.0` |

Runtime dependencies bundled into the library:
`class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`, `shiki`

---

## 2. Directory Layout

```
/
├── src/
│   ├── components/          UI components (9 category folders)
│   ├── styles/              Design tokens, Tailwind CSS entry points, CVA theme barrel
│   ├── lib/utils.ts         cn() helper (clsx + tailwind-merge)
│   └── __tests__/           27+ test files (Vitest + jsdom)
├── demo/
│   ├── App.tsx              SPA shell (Header + SideNav + React Router routes)
│   ├── main.tsx             Webpack entry point
│   ├── demo.css             Demo-specific global styles
│   └── pages/              One <Component>Page.tsx per component (all lazy-loaded)
├── scripts/
│   └── build-css.mjs        PostCSS CSS build for library output
├── dist/                    Library build output (ESM + CJS, published to npm)
├── dist-demo/               Demo site build output (deployed to GitHub Pages)
└── .github/
    ├── agents/              6 AI agent mode files (*.agent.md)
    ├── instructions/        component-generation.instructions.md (auto-applied)
    ├── skills/              changelog-writer/, component-audit/, project-architecture/
    ├── prompts/             4 slash command prompts (*.prompt.md)
    └── workflows/           ci.yml, release.yml
```

---

## 3. Component Category System

9 categories, each a subfolder under `src/components/` with its own `index.ts` barrel:

| Category | Components |
|---|---|
| **Primitives** | Badge, Button, Checkbox, Dropdown, DropdownButton, Indicator, Input, Label, Radio, Switch, TextBox |
| **Layout** | Card, ImageCard, Panel |
| **DataDisplay** | Chat, CodeBlock, List, Table, Tree |
| **Navigation** | Header, NavLink, SideNav |
| **Disclosure** | Accordion, Tabs |
| **Overlay** | Dialog, Tooltip |
| **Feedback** | Alert, ProgressBar, Spin |
| **Extras** | CinePlayer, FileExplorer, FilmReel, Masonry, MiniPlayer |
| **Forms** | Form |

### Per-component file structure (canonical pattern)
```
src/components/<Category>/<ComponentName>/
├── index.ts          export * from "./<ComponentName>"
├── <ComponentName>.tsx   implementation (CVA props + cn() for className)
└── <ComponentName>.css   component-local CSS (can be empty placeholder)
```

### CVA variant convention
- Variant functions live in `src/styles/theme/<category>.ts`, NOT inside the component file
- Always use semantic tokens: `bg-primary-500 text-danger-600` etc.
- Never use raw Tailwind palette names: `bg-slate-500 text-rose-600` etc.
- `defaultVariants` must always be set

---

## 4. Style System

### File inventory

| File | Purpose |
|---|---|
| `src/styles/tokens/core.css` | `@theme {}` block — semantic ↔ Tailwind palette mapping |
| `src/styles/tokens/animations-shared.css` | Animation tokens, `@keyframes`, `@utility` |
| `src/styles/tokens.css` | Entry: imports `core.css` + `animations-shared.css` |
| `src/styles/base.css` | `@import "tailwindcss"` + tokens + dark variant (for dev) |
| `src/styles/index.css` | Full library bundle: Tailwind + tokens + all component CSS |
| `src/styles/tailwind.css` | Consumer integration: `@source ".."` + tokens + dark variant |
| `src/styles/theme.css` | Legacy compat: imports tokens + all component CSS |
| `src/styles/theme.ts` | TypeScript barrel — re-exports all CVA variant functions |
| `src/styles/components/` | Extra large component CSS files (CinePlayer, FileExplorer, etc.) |

### Semantic color mapping (tokens/core.css)

| Semantic scale | Tailwind base palette |
|---|---|
| `primary-{50–900}` | `slate` |
| `secondary-{50–900}` | `gray` |
| `success-{50–900}` | `emerald` |
| `danger-{50–900}` | `rose` |
| `warning-{50–900}` | `orange` |

### Tailwind v4 configuration

- **No `tailwind.config.js`** — Tailwind v4 is configured entirely in CSS files
- `@import "tailwindcss"` appears in `base.css` and `index.css`
- Design tokens in `@theme {}` blocks inside `tokens/core.css`
- Dark mode: `@custom-variant dark (&:where(.dark, .dark *))` — class-based, source is `.dark` on root element, NOT `darkMode: 'class'` config

### Theme barrel (src/styles/theme.ts)

Re-exports all CVA variant functions organized by domain:
- `./theme/primitives` → button, badge, indicator, input, label, checkbox, radio, switchTrack variants
- `./theme/layout` → card, panel variants
- `./theme/data-display` → table, list, listItem, treeItem, codeBlock variants
- `./theme/disclosure` → accordion (3 parts), tab (2 parts) variants
- `./theme/overlay` → dialogContent, tooltip variants
- `./theme/navigation` → navLink variants
- `./theme/feedback` → progressBar, spin, alert variants
- `./theme/form` → form, formItem, formValidation variants

---

## 5. Build Pipeline

### Library build: tsup

**Entry points** (auto-discovered + static):
- `src/index.ts` → `dist/index.{js,cjs,d.ts}`
- `src/lib/utils.ts` → `dist/utils.{js,cjs,d.ts}`
- `src/styles/theme.ts` → `dist/theme.{js,cjs,d.ts}`
- Per category: `src/components/<Cat>/index.ts` → `dist/<Cat>/index.{js,cjs,d.ts}`
- Per component: `src/components/<Cat>/<Name>/index.ts` → `dist/<Cat>/<Name>.{js,cjs,d.ts}`

**Key tsup settings:** `format: ["esm", "cjs"]`, `treeshake: true`, `minify: true`, `splitting: false`, `experimentalDts: true`

**Externalized (not bundled):** react, react-dom, class-variance-authority, clsx, lucide-react, tailwind-merge, shiki + all `@shikijs/langs/*` sub-paths

### CSS build: scripts/build-css.mjs

Runs PostCSS on `src/styles/index.css` → `dist/styles.css`. Also copies token and component CSS files.

### Demo build: webpack + PostCSS

**Dev server:** `webpack.dev.config.cjs` → port 3001, hot reload, `eval-source-map`, `ForkTsCheckerWebpackPlugin`

**Production:** `webpack.demo.config.cjs` → `dist-demo/assets/`, `publicPath: /OnyxUI/`, HtmlWebpackPlugin with 404.html for SPA routing, `InjectBase` plugin for GitHub Pages `<base href>`, code splitting (react chunk, lucide chunk, vendor chunk).

Both webpack configs use PostCSS with `@tailwindcss/postcss` (the single-plugin Tailwind v4 integration).

### TypeScript config

- `tsconfig.json` — base config: `target: ES2020`, `module: ESNext`, `moduleResolution: bundler`, `jsx: react-jsx`, `strict: true`, path alias `@` → `src/`, includes `src/**/*` and `demo/**/*`
- `tsconfig.build.json` — extends base, `emitDeclarationOnly: true`, `include: src/**/*` only (excludes demo and tests)

---

## 6. Export Strategy (src/index.ts)

Three parallel consumption patterns:

```ts
// 1. Flat named — tree-shakeable, preferred
import { Button, Alert } from "@jacshuo/onyx"

// 2. Category namespace
import { Primitives } from "@jacshuo/onyx"
Primitives.Button

// 3. Default Onyx object
import Onyx from "@jacshuo/onyx"
Onyx.Primitives.Button

// 4. Deep path — maximum tree-shaking
import { Button } from "@jacshuo/onyx/Primitives/Button"
```

`"sideEffects": ["*.css"]` in package.json — all JS exports are tree-shakeable.

Package exports map also exposes:
- `@jacshuo/onyx/theme` → CVA variants barrel
- `@jacshuo/onyx/utils` → `cn()` only
- `@jacshuo/onyx/styles.css` → compiled CSS bundle

---

## 7. Demo Site Architecture

**Entry:** `demo/main.tsx` → mounts `<App />` wrapped in `<BrowserRouter>`

**Shell (`demo/App.tsx`):**
- `<Header>` component with `Gem` lucide icon as logo, version badge from `package.json`, GitHub link using `simple-icons` SVG
- `<SideNav>` with `navItems` array organizing all components by category (8 groups), rendered as collapsible sidebar
- `<Routes>` — React Router v6, all pages `React.lazy()` loaded inside `<Suspense>`
- Theme toggle (dark/light class on `<html>`)

**Navigation categories in sidebar:**
Primitives, Layout, Data Display, Navigation, Disclosure, Overlay, Feedback, Extras (in this order)

**Page convention (`demo/pages/<Name>Page.tsx`):**
- Import components from `../src` (not from npm — local dev)
- Use `helpers.tsx` for shared demo primitives (section titles, prop tables, etc.)
- Show all variants, states, and props visually

---

## 8. Testing Infrastructure

**Runner:** Vitest (not Jest) with `globals: true` — no need to import `describe`, `it`, `expect`

**Environment:** jsdom

**Setup file (`src/__tests__/setup.ts`):** imports `@testing-library/jest-dom/vitest`, stubs `ResizeObserver`

**Config highlights:**
- `test.css: false` — CSS not processed in tests (avoids PostCSS complexity)
- Coverage thresholds: 60% statements/lines, 50% branches/functions
- Path alias `@` → `/src` (same as tsconfig)

**Test file location:** `src/__tests__/<ComponentName>.test.tsx`  
**Naming pattern:** `describe("<ComponentName>") { it("<behavior description>") }`

**Special test files:**
- `exports.test.ts` — verifies public surface of `src/index.ts`
- `theme.test.ts` — verifies CVA variant outputs
- `utils.test.ts` — tests `cn()` helper

---

## 9. CI/CD Workflow

### ci.yml — Continuous Integration
- **Trigger:** push or PR to `main`
- **Matrix:** Node.js 20 and 22
- **Steps:** `npm ci` → `typecheck` → `test` → `dist`
- **Concurrency:** cancel-in-progress on same ref

### release.yml — Release Pipeline
- **Trigger:** manual `workflow_dispatch`
- **Input:** `bump` choice (`patch` | `minor` | `major`, default: `patch`)
- **Permissions:** `contents: write`, `pages: write`, `id-token: write`
- **Job sequence:**
  1. `version` — `npm version $bump`, commit + tag + push to main
  2. `publish` (needs: version) — `npm ci` + `test` + `dist` + `npm publish --access public`
  3. `github-release` (needs: version + publish) — creates GitHub Release with tarball + zip artifacts, `generate_release_notes: true`
  4. `deploy-demo` (needs: version + publish) — `npm run build:demo` → GitHub Pages

Jobs 3 and 4 run in parallel after job 2 succeeds.

---

## 10. Agent System

6 AI agent mode files in `.github/agents/`:

| Agent | File | Scope |
|---|---|---|
| Component Expansion | `component-expansion.agent.md` | New components from scratch |
| Component Enhancer | `component-enhancer.agent.md` | Iterate existing components + demo updates |
| Bug Hunter | `bug-hunter.agent.md` | Reproduce + fix bugs, validate with tests |
| Refactor | `refactor.agent.md` | Architecture cleanup, maintainability |
| Dependencies Maintainer | `dependencies-maintainer.agent.md` | npm audit, version upgrades |
| Release Orchestrator | `release-orchestrator.agent.md` | Trigger + monitor release workflow via gh CLI |

**Always-on instructions:** `.github/instructions/component-generation.instructions.md`  
→ Auto-applied to `src/components/**/*.tsx`, `demo/pages/**/*.tsx`, `demo/App.tsx`, `src/index.ts`, `src/styles/**/*.css`

**Skills:** `.github/skills/<name>/SKILL.md` — on-demand reference documents  
**Prompts:** `.github/prompts/<name>.prompt.md` — appear as `/slash-commands` in Copilot Chat

---

## 11. Key Conventions

- **No optional chaining on props** — prefer explicit defaults via `defaultVariants` in CVA
- **Semantic tokens only** — `primary-*`, `secondary-*`, `success-*`, `danger-*`, `warning-*`
- **Component file count** — always exactly 3 files (index.ts + .tsx + .css)
- **Category barrel** — every category has `src/components/<Cat>/index.ts` re-exporting all components in that folder
- **Husky hooks** — pre-commit hooks active via `husky` + `prepare` script
- **No Tailwind config file** — Tailwind v4 is 100% CSS-driven
- **`cn()` always last** — `cn(variants({...}), className)` for proper class merging
- **All brand icons via simple-icons** — `import { siGithub } from "simple-icons"` (devDependency, demo-only)
