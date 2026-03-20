---
description: "Use when creating or modifying UI components, component demo pages, routing/category wiring, component styles, and release/debug delegation in this repo. Enforces tree-shaking, Tailwind CSS v4 strategy, responsive multi-platform UX, creative animation quality, demo-page requirements, and agent handoff rules."
name: "Onyx Component Generation Rules"
applyTo: ["src/components/**/*.tsx", "demo/pages/**/*.tsx", "demo/App.tsx", "src/index.ts", "src/styles/**/*.css"]
---
# Onyx Component Generation Rules

## Agent task routing (consult first)

| Task type | Delegate to |
|---|---|
| New component (source + demo + tests) | `Onyx Component Expansion Agent` |
| Enhance / iterate existing component or demo | `Onyx Component Enhancer Agent` |
| Bug fix / reproduce / debug | `Onyx Bug Hunter Agent` |
| Dependency audit / upgrade / security | `Onyx Dependencies Maintainer Agent` |
| Refactor / architecture cleanup | `Onyx Refactor Agent` |
| Release / publish / CI pipeline | `Onyx Release Orchestrator Agent` |

> **Conflict protocol**: if a user command conflicts with this instruction or the selected agent definition, pause immediately, present the conflict, and ask for explicit text resolution before continuing. Never silently pick a side.

---

## 1. Tree-shaking and exports

- Every component must be tree-shakeable and side-effect-free.
- Export each component and its types individually from `src/index.ts` — never bundle unrelated modules together.
- `index.ts` barrel files must be export-only; no business logic, rendering, or side effects.

## 2. File organization

Simple components may be a single file. Heavy/complex components must use a folder:

```
ComponentName/
├── index.ts               # export-only barrel
├── ComponentName.tsx      # main view / composition
├── ComponentName.logic.ts # state & interaction orchestration
├── ComponentName.hooks.ts # component-specific hooks
├── ComponentName.utils.ts # pure helpers
├── ComponentName.css      # component-local styles (when needed)
└── types.ts               # public + internal types
```

- Soft file size limit: ~500 lines per file.
- Components already in `Extras` stay there unless an explicit migration is requested.

**Complexity evaluation** — assess holistically across all related files:

| Signal | Weight |
|---|---|
| Total code size across related files | baseline |
| Logic complexity (branching, state orchestration) | high |
| Third-party dependency weight | high |
| API surface breadth (props / modes / events / variants) | medium |
| Animation complexity (multi-stage, state-coupled) | medium |
| Performance cost (re-render pressure, large data sets) | medium |

When borderline, prefer `Extras` for maintainability and discoverability.

## 3. CSS strategy (Tailwind CSS v4+)

- Use Tailwind CSS v4+ utilities directly on elements.
- Component-local styles go in a component-scoped CSS file when needed.
- Shared design tokens → `src/styles/tokens.css`; foundational styles → `src/styles/base.css`.
- Never duplicate or move token/base definitions into component CSS.
- Components must **not** reference raw color names or tightly coupled hardcoded class names — use semantic tokens.
- New reusable token names: `组件缩写+语义化类名` so consumers can override.

## 4. Responsive and cross-platform parity

- All components must support responsive layouts.
- Every interaction on desktop must have a mobile equivalent (and vice versa).
- Document cross-platform interaction decisions inside the component demo page.

## 5. Animation quality

- Animations must be visually appealing and creative.
- Never sacrifice readability, accessibility, or interaction clarity for visual effects.

## 6. Demo page requirements

- File name: `ComponentNamePage.tsx` in `demo/pages/`.
- Every public prop / variant / state must have at least one demo block.
- Use one scenario + one representative code snippet per section.
- Snippets may omit boilerplate loops with comments, but API call style must be explicit and correct.
- Match existing demo page visual style and helper patterns.

## 7. Verification gate

After any component or demo change, run all of the following and fix failures before marking done:

```
npm run build
npm test
npm run dev   # open in editor-browser and visually confirm
```

## 8. Delivery checklist

Before concluding, verify every item:

- [ ] Tree-shaking-friendly module structure and exports
- [ ] Tailwind CSS v4+ styling; no hardcoded color tokens
- [ ] Responsive layout and cross-platform interaction parity validated
- [ ] Animation quality reviewed
- [ ] Demo category correct (`Extras` if heavy/complex)
- [ ] `ComponentNamePage` covers all public API surfaces with examples
- [ ] Editor-browser visual verification completed
- [ ] CHANGELOG update prompted (for component source changes)
