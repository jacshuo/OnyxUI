# OnyxUI — Project Quick Reference

**Package:** `@jacshuo/onyx` · Cross-platform React UI component library (web + Electron)  
**Repo:** `https://github.com/jacshuo/OnyxUI` · **Published to:** npm as `@jacshuo/onyx`

## Tech Stack
- React 18+ · TypeScript · Tailwind CSS v4 (no config file; configured via `@theme {}` in CSS)
- CVA (class-variance-authority) · clsx · tailwind-merge · lucide-react · shiki
- Library bundler: **tsup** → `dist/` (ESM + CJS) | Demo bundler: **webpack** → `dist-demo/`
- Tests: **Vitest** + jsdom + @testing-library/react | Path alias: `@` → `src/`

## Key Directories
```
src/components/        9 categories: Primitives, Layout, DataDisplay, Navigation,
                       Disclosure, Overlay, Feedback, Extras, Forms
src/styles/            tokens.css, index.css, base.css, theme.ts (CVA variant barrel)
src/styles/tokens/     core.css (@theme semantic colors), animations-shared.css
src/lib/utils.ts       cn() helper (clsx + tailwind-merge)
src/index.ts           full public export barrel (named + category namespaces + Onyx default)
src/__tests__/         27+ test files (one per component/module)
demo/                  webpack SPA demo site
demo/pages/            one *Page.tsx per component (lazy-loaded via React.lazy)
.github/agents/        6 custom AI agent files
.github/instructions/  component-generation.instructions.md (auto-loaded for src/demo files)
.github/skills/        changelog-writer, component-audit, project-architecture
.github/prompts/       /new-component /enhance-component /update-changelog /quick-release
dist/                  library build output (published to npm)
dist-demo/             demo site build output (GitHub Pages)
```

## Common Commands
```
npm run dev            start dev server on :3001
npm run build          build library (tsup + CSS)
npm run build:demo     build demo site (webpack → dist-demo/)
npm run test           run all tests (vitest run)
npm run typecheck      tsc --noEmit
npm run lint           eslint src demo
```

## Component Structure Pattern
Each component at `src/components/<Category>/<Name>/`:
- `index.ts` — re-export barrel (`export * from "./<Name>"`)
- `<Name>.tsx` — implementation (CVA props + `cn()` for classes)
- `<Name>.css` — component-local CSS (may be empty placeholder)

CVA variants live in `src/styles/theme/<category>.ts`. Always use semantic tokens
(`primary-500`, `danger-600`, etc.) — never raw Tailwind palette names (`slate-500`).

## Design System
Tokens: `src/styles/tokens/core.css` maps semantic scales (primary=slate, secondary=gray,
success=emerald, danger=rose, warning=orange) using Tailwind v4 `@theme {}`.  
Dark mode: class-based (`.dark` — custom variant in CSS, NOT `darkMode: 'class'` config).

## Export Strategy (`src/index.ts`)
Three parallel strategies for consumers:
1. **Flat named exports** — `import { Button, Alert } from "@jacshuo/onyx"` (tree-shakeable)
2. **Category namespaces** — `import { Primitives } from "@jacshuo/onyx"` 
3. **Default `Onyx` object** — `import Onyx from "@jacshuo/onyx"`
4. **Deep path imports** — `import { Button } from "@jacshuo/onyx/Primitives/Button"`

`"sideEffects": ["*.css"]` — all JS is tree-shakeable.

## Release Workflow
Manual GitHub Actions: `release.yml` · Input: `bump` (patch/minor/major)  
Jobs: **version** (bump + tag + push) → **publish** (npm) + **github-release** + **deploy-demo**

## Agent Routing
| Task | Agent |
|---|---|
| Add new component | Onyx Component Expansion Agent |
| Enhance/iterate existing component or demo | Onyx Component Enhancer Agent |
| Bug fix, demo debugging | Onyx Bug Hunter Agent |
| Architecture/code refactor | Onyx Refactor Agent |
| Dependency updates, security | Onyx Dependencies Maintainer Agent |
| Publish a release | Onyx Release Orchestrator Agent |

> For deep architecture details, load the **project-architecture** skill.
