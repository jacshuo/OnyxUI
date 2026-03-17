# Contributing to @jacshuo/onyx

Thank you for considering a contribution! This document explains how to get started, the project conventions, and how to submit changes.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Project Structure](#project-structure)
- [Coding Guidelines](#coding-guidelines)
- [Testing](#testing)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

---

## Code of Conduct

Be respectful. We follow the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/) code of conduct.

---

## Getting Started

1. **Fork** this repository and clone your fork.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the demo dev server:
   ```bash
   npm run dev
   ```
   The demo site runs at `http://localhost:8080`.

---

## Development Workflow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Branch   │────▶│  Code    │────▶│  Test    │────▶│  PR      │
│  (feat/*) │     │  & Demo  │     │  & Lint  │     │  Review  │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
```

1. Create a branch from `main`:
   ```bash
   git checkout -b feat/my-feature   # or fix/my-bug
   ```
2. Make your changes inside `src/`.
3. If adding a new component, also add a demo page under `demo/pages/`.
4. Run tests and checks:
   ```bash
   npm run test            # unit tests
   npm run typecheck       # TypeScript type checking
   npm run dist            # production build
   ```
5. Commit your changes following the [commit message convention](#commit-messages).
6. Push and open a Pull Request.

---

## Project Structure

```
src/
  components/     # React components (one file per component)
  lib/            # Shared utilities (cn, etc.)
  styles/         # CSS & CVA theme definitions
  __tests__/      # Test files (*.test.ts / *.test.tsx)
demo/
  pages/          # Demo pages (one per component)
  App.tsx         # Demo app shell
  main.tsx        # Demo entry point
```

---

## Coding Guidelines

### General

- **TypeScript** for everything. No `any` unless absolutely unavoidable (and commented).
- **Functional components** only — no class components.
- Export props interfaces/types for all public components.
- Use the `cn()` utility for merging class names (Tailwind + CVA).

### Styling

- Use **Tailwind CSS** utility classes.
- Define variant styles in `src/styles/theme.ts` using **CVA** (Class Variance Authority).
- Support **light & dark mode** via `dark:` variants.
- Avoid inline styles. Use CSS custom properties (defined in `src/styles/theme.css`) for themeable tokens when needed.

### Accessibility

- Use semantic HTML elements (`button`, `label`, `dialog`, etc.).
- Include proper `aria-*` attributes.
- All interactive elements must be keyboard-accessible.
- Test with a screen reader when possible.

### File Naming

| Type | Convention | Example |
|------|-----------|---------|
| Component | PascalCase `.tsx` | `Button.tsx` |
| Test | `ComponentName.test.tsx` | `Button.test.tsx` |
| Utility | camelCase `.ts` | `utils.ts` |
| Demo page | PascalCase `Page.tsx` | `ButtonPage.tsx` |

---

## Testing

We use [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/react).

### Running Tests

```bash
npm run test              # Run all tests once
npm run test:watch        # Watch mode
npm run test:coverage     # With coverage report
```

### Writing Tests

- Place test files in `src/__tests__/`.
- Name them `ComponentName.test.tsx` (or `.test.ts` for non-JSX).
- Test **behavior**, not implementation details.
- Use `screen.getByRole()` and `userEvent` over `fireEvent`.
- Every new component should include at least:
  - Renders correctly
  - Key props work as documented
  - Event handlers fire
  - Accessibility attributes are present

#### Example

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../components/Button';

describe('Button', () => {
  it('fires onClick', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={onClick}>Click</Button>);
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
```

### Coverage Requirements

CI enforces minimum coverage thresholds:

| Metric | Threshold |
|--------|-----------|
| Statements | 60% |
| Branches | 50% |
| Functions | 50% |
| Lines | 60% |

---

## Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type | When to use |
|------|-----------|
| `feat` | New feature or component |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, missing semicolons (no code logic) |
| `refactor` | Code refactoring (no feature change) |
| `test` | Adding or fixing tests |
| `chore` | Build process, CI, tooling |
| `perf` | Performance improvement |

### Examples

```
feat(Dropdown): add cascading sub-menu support
fix(Dialog): prevent z-index overlap with FileExplorer
test(Button): add disabled state tests
docs: update README with CinePlayer examples
chore(ci): add test step to release pipeline
```

---

## Pull Request Process

1. **One PR per feature/fix.** Keep changes focused.
2. **Fill in the PR template** (auto-loaded when you open a PR).
3. **Ensure all CI checks pass** before requesting review:
   - Typecheck
   - Unit tests
   - Production build
4. **Update docs** if your change affects the public API:
   - Component props → update README
   - New component → add to the component table in README
   - New exports → add to `src/index.ts`
5. **Add/update tests** for any new or changed behavior.
6. **Keep commit history clean** — squash fixup commits.
7. A maintainer will review and merge.

### PR Title Format

Use the same [Conventional Commits](#commit-messages) format:

```
feat(ComponentName): short description
fix(ComponentName): short description
```

### Review Checklist (for reviewers)

- [ ] Code follows project style
- [ ] Tests cover the changes
- [ ] No regressions in existing tests
- [ ] Accessibility considered
- [ ] TypeScript types are correct and exported if public
- [ ] Demo page updated (for new/changed components)

---

## Reporting Bugs

Open an [issue](https://github.com/jacshuo/jac-ui/issues/new?template=bug_report.md) with:

- **Description**: What happened vs. what you expected ?
- **Steps to reproduce**: Minimal example
- **Environment**: OS, browser, Node version, package version
- **Screenshots**: If applicable

---

## Suggesting Features

Open an [issue](https://github.com/jacshuo/jac-ui/issues/new?template=feature_request.md) with:

- **Use case**: What problem does this solve?
- **Proposed solution**: Your idea for the API/behavior
- **Alternatives considered**: Other approaches you thought of

---

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).
