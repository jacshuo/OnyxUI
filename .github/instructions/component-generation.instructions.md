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

## Component file organization
- Components are **not required** to be single-file.
- If a component is heavy/complex, split it into multiple files based on the same heaviness evaluation criteria used in this instruction (code size, dependency weight, logic complexity, API breadth, animation complexity, and performance-cost signals).
- Prefer **folder-based organization** for heavy/complex components.
- Recommended structure (adjust as needed):
  - `ComponentName/index.ts` (public exports)
  - `ComponentName/ComponentName.tsx` (main composition/view entry)
  - `ComponentName/ComponentName.logic.ts` (state/interaction orchestration)
  - `ComponentName/ComponentName.hooks.ts` (component-specific hooks)
  - `ComponentName/ComponentName.utils.ts` (pure helpers)
  - `ComponentName/ComponentName.css` (component-local style when needed)
  - `ComponentName/types.ts` (public/internal types)
- `index.ts` should be export-only (barrel/re-export entry), and should not contain business logic, rendering logic, side effects, or heavy computations.
- File-splitting should improve maintainability and tree-shaking friendliness (clear boundaries for view, logic, hooks, utils, and styles where appropriate).
- Soft limit: keep each file preferably under ~500 lines when practical.
- Existing components already categorized under `Extras` should remain in `Extras` unless there is an explicit migration requirement.

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
- For complex/heavy components, categorize them under `Extras` in `demo/App.tsx`.
- Complexity should be evaluated from **component-related files as a whole** (not only the main file), including component source, hooks/utils tightly coupled to it, and component-local styles.
- Use a weighted assessment instead of a single metric when possible:
  - total code size across related files (baseline signal)
  - logic complexity (branching/state orchestration/interaction flows)
  - dependency weight (number and impact of third-party libraries introduced)
  - API surface breadth (props/modes/events/variants)
  - animation complexity (multi-stage choreography, timing coordination, state-coupled transitions)
  - potential performance cost (frequent re-render pressure, expensive computation paths, high-volume list/grid rendering impact)
- If the component is borderline, prefer placing it in `Extras` for maintainability and discoverability.

## Demo page requirements
- After implementing any component, always create or update the demo page using `ComponentName + Page` naming (e.g., `ButtonPage`).
- Demo page must cover major usage scenarios and API surfaces.
- **Hard requirement**: each public API must have at least one example block in DemoPage.
- Prefer one scenario + one representative code snippet pattern per section.
- Snippets may omit repetitive loops/boilerplate with comments, but API invocation style must be explicit and correct.

## Verification requirement
- After component + demo generation, run local verification and ensure implementation correctness.
- Use VS Code editor-browser to validate demo behavior and interactions.

## Agent delegation rules
- When adding a new component or writing component expansion code, delegate to `Onyx Component Expansion Agent`.
- When debugging/fixing issues, delegate to `Onyx Bug Hunter Agent`.
- When working on npm package/dependency maintenance and vulnerability remediation, delegate to `Onyx Dependencies Maintainer Agent`.
- When executing refactor tasks, delegate to `Onyx Refactor Agent`.
- When asked to commit and publish/release, delegate to `Onyx Release Orchestrator Agent`.

## Conflict resolution protocol
- If the user’s chat command conflicts with this instruction file or with the selected agent definition, pause execution immediately.
- Ask the user for explicit text decision first, then continue according to that decision.
- Do not silently choose one side when a conflict exists.

## Delivery checklist (must satisfy)
- Tree-shaking-friendly export and module structure
- Tailwind CSS v4+ aligned style handling
- Responsive behavior validated on desktop + mobile interactions
- Animation quality reviewed
- Category placement checked (`Extras` if heavy/complex)
- `ComponentNamePage` demo implemented with API-focused examples
- Editor-browser verification completed
