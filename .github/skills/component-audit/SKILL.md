---
name: component-audit
description: "Audit an existing UI component for quality, compliance, and completeness. Use for: reviewing a component against project rules (tree-shaking, Tailwind v4, responsive parity, animation quality); checking demo page coverage of all public APIs; finding missing unit tests; flagging hardcoded tokens or style violations; assessing whether the component belongs in Extras. Keywords: component audit, component review, quality check, compliance check, demo coverage, test coverage, tree-shaking audit, token audit."
argument-hint: "Name the component to audit (e.g. 'Button', 'Header'). Optionally specify focus areas: api, styles, demo, tests, all."
user-invocable: true
---
# Component Audit

Systematic review of an existing component against all Onyx project rules.

## When to Use
- Before enhancing a component (establish baseline quality)
- After a component has grown significantly and needs a health check
- When you suspect style violations, missing tests, or incomplete demo coverage
- As a pre-release quality gate for recently changed components

## Audit Checklist

Run through each section below. Report findings as: ✅ Pass / ⚠️ Warning / ❌ Fail

### 1. File organization
- [ ] Simple component: single file or appropriate folder split?
- [ ] `index.ts` is export-only (no logic/rendering/side-effects)?
- [ ] Each file is under ~500 lines?
- [ ] Heavy component uses `logic.ts` / `hooks.ts` / `utils.ts` split?

### 2. Tree-shaking and exports
- [ ] Component exported individually from `src/index.ts`?
- [ ] All public types also exported?
- [ ] No barrel re-exports that drag in unrelated modules?
- [ ] No `import * as` patterns that prevent dead-code elimination?

### 3. CSS and tokens
- [ ] No raw color names in className strings?
- [ ] No tightly hardcoded visual values (use semantic tokens)?
- [ ] Shared tokens defined in `src/styles/tokens.css`, not duplicated locally?
- [ ] Tailwind CSS v4+ utilities used correctly?

### 4. Responsive and cross-platform parity
- [ ] Layout is responsive (mobile + desktop)?
- [ ] Every desktop interaction has a mobile equivalent path?
- [ ] Every mobile interaction has a desktop equivalent path?

### 5. Animation quality
- [ ] Animations are visually creative and purposeful?
- [ ] No animations that harm readability, accessibility, or interaction clarity?
- [ ] Reduced-motion considerations present if animations are significant?

### 6. Demo page coverage
- [ ] `ComponentNamePage.tsx` exists in `demo/pages/`?
- [ ] Every public prop has at least one demo block?
- [ ] Every variant/mode has at least one demo block?
- [ ] Edge cases (empty, loading, error, disabled) are demonstrated?
- [ ] Code snippets are explicit and correct (not pseudocode)?

### 7. Unit test coverage
- [ ] Test file exists in `src/__tests__/`?
- [ ] Core props and variants are tested?
- [ ] Interactive behavior (clicks, keyboard, focus) is tested?
- [ ] Edge cases (empty props, null children, boundary values) are tested?

### 8. Demo category placement
- [ ] Component placed in appropriate demo category?
- [ ] If borderline complex, is it in `Extras`?

## Procedure

1. Read `src/components/<Category>/<ComponentName>/` (all files).
2. Read `demo/pages/<ComponentName>Page.tsx`.
3. Read `src/__tests__/<ComponentName>.test.tsx` if it exists.
4. Go through each checklist item above.
5. Summarize findings in a table:

```
| Area | Status | Notes |
|---|---|---|
| File organization | ✅ / ⚠️ / ❌ | ... |
| Tree-shaking | ✅ / ⚠️ / ❌ | ... |
| CSS / tokens | ✅ / ⚠️ / ❌ | ... |
| Responsive parity | ✅ / ⚠️ / ❌ | ... |
| Animation quality | ✅ / ⚠️ / ❌ | ... |
| Demo coverage | ✅ / ⚠️ / ❌ | ... |
| Test coverage | ✅ / ⚠️ / ❌ | ... |
| Category placement | ✅ / ⚠️ / ❌ | ... |
```

6. List actionable findings with severity (Critical / Warning / Suggestion).
7. Ask user whether to fix issues now (delegate to `Onyx Component Enhancer Agent`) or just report.
