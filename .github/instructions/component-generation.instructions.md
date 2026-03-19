---
description: "Use when creating or modifying UI components, component demo pages, routing/category wiring, component styles, and release/debug delegation in this repo. Enforces tree-shaking, Tailwind CSS v4 strategy, responsive multi-platform UX, creative animation quality, demo-page requirements, and agent handoff rules."
name: "Onyx Component Generation Rules"
applyTo: ["src/components/**/*.tsx", "demo/pages/**/*.tsx", "demo/App.tsx", "src/index.ts", "src/styles/**/*.css"]
---
# Onyx Component Generation Rules

## Component packaging and tree-shaking
- Every newly generated component must be tree-shakeable.
- Keep exports granular in `src/index.ts`:
  - export each component/type from its own path
  - avoid patterns that force importing unrelated modules
- Prefer side-effect-free component modules.

## CSS strategy (Tailwind CSS v4+)
- Follow Tailwind CSS v4+ recommended strategy for styling.
- New components should preferably have separable component CSS when needed, while keeping shared design tokens in `tokens.css` and foundational styles in `base.css`.
- Do not move or duplicate shared token/base definitions into component-local CSS.

## Responsive and cross-platform interaction parity
- All new components must support responsive layouts.
- Must consider both desktop and mobile interactions.
- If desktop-only interaction exists, provide a mobile-equivalent fallback/interaction path.
- If mobile-only interaction exists, provide a desktop-equivalent fallback/interaction path.
- Clearly document cross-platform interaction decisions in the component demo scenarios.

## Animation quality
- Animations must be visually appealing and creative while preserving usability and performance.
- Avoid flashy effects that degrade readability, accessibility, or interaction clarity.

## Complexity-based category rule
- For complex/heavy components (for example, source file > 500 lines), categorize them under `Extras` in `demo/App.tsx`.

## Demo page requirements
- After implementing any component, always create or update the demo page using `ComponentName + Page` naming (e.g., `ButtonPage`).
- Demo page must cover major usage scenarios and API surfaces.
- Prefer one scenario + one representative code snippet pattern per section.
- Snippets may omit repetitive loops/boilerplate with comments, but API invocation style must be explicit and correct.

## Verification requirement
- After component + demo generation, run local verification and ensure implementation correctness.
- Use VS Code editor-browser to validate demo behavior and interactions.

## Agent delegation rules
- When adding a new component or writing component expansion code, delegate to `Onyx Component Expansion Agent`.
- When debugging/fixing issues, delegate to `Onyx Bug Hunter Agent`.
- When asked to commit and publish/release, delegate to `Onyx Release Orchestrator Agent`.

## Delivery checklist (must satisfy)
- Tree-shaking-friendly export and module structure
- Tailwind CSS v4+ aligned style handling
- Responsive behavior validated on desktop + mobile interactions
- Animation quality reviewed
- Category placement checked (`Extras` if heavy/complex)
- `ComponentNamePage` demo implemented with API-focused examples
- Editor-browser verification completed
