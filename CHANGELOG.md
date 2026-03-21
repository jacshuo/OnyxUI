# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

---

## [2.2.0] — 2026-03-21

### Fixed

- **Slider / SliderRange**: resolve WCAG label-for mismatch — extract `id` from spread props onto a sr-only `<input type="range">` so `htmlFor` on `<label>` targets a real labelable element; remove stray `id` from thumb `<div role="slider">`
- **Dropdown**: resolve WCAG label-for mismatch when used inside `FormItem` — sr-only `<input type="text">` added before the trigger div in non-editable mode so the injected `id` reaches a native labelable element
- **FormPage**: remove `<div>` wrappers around `<Switch>` inside `<FormItem>` — wrappers were interceting the injected `id`, preventing it from reaching Switch's native `<input>`

### Changed

- **SideNav**: fix mobile drawer drag reliability — migrate drag listeners from element to `window` level; add `swallowClick` guard to prevent accidental nav-link activations immediately after a drag release; correct `mobileDrawerSlot` prop passthrough
- **README**: comprehensive rewrite — correct component count (55+), add Chart category section, update dev port to 3001, correct build commands, add Forms & Accessibility wiring guide, add SideNav mobile drawer documentation, add Charts / CommandPalette usage examples, refresh all component tables

---

## [2.1.0] — 2026-03-21

### Added

- **Avatar**: new Primitives component — image or initials fallback, size variants (xs–2xl), intent-coloured ring, status dot (online/away/busy/offline), and group stacking via `AvatarGroup`
- **Breadcrumb**: new Navigation component — accessible `<nav>` with configurable separator, a `maxItems` collapse-to-ellipsis, and optional icon support
- **CommandPalette**: new Extras component — full-screen search modal with grouped results, keyboard navigation (↑↓ Enter Esc), fuzzy filtering, shortcut badge, and empty/loading states
- **ContextMenu**: new Overlay component — right-click / long-press context menu with separator, nested sub-menu, and keyboard dismiss support
- **Drawer**: new Overlay component — slide-in panel from four sides (`top|bottom|left|right`), controlled open state, modal backdrop, and size variants
- **MetricCard**: new DataDisplay component — KPI card with value, label, trend arrow (up/down), delta chip, and optional sparkline slot
- **Pagination**: new Navigation component — page control bar with first/prev/next/last, page-size selector, compact mode, and total-items label
- **RibbonBar**: new Navigation component — Office-style tabbed toolbar with icon-button groups, separators, and responsive collapse to mini mode
- **Select**: new Forms component — single and multi-select dropdown with search, grouped options, creatable mode, and value chip rendering
- **Skeleton**: new Feedback component — content placeholder with pulse animation for text lines, circles, rectangles, and cards; stacks via `SkeletonGroup`
- **Slider**: new Primitives component — single-thumb and range (dual-thumb) slider with step, marks, formatted tooltip, and vertical orientation
- **Stat**: new DataDisplay component — simple stat display with large value, label, and optional icon or badge chip
- **Tag**: new Primitives component — inline lozenge tag with intent variants, close button, and `onRemove` callback
- **Timeline**: new Extras component — vertical/horizontal event timeline with `active` holo spinning border animation, `complete`/`error` ambient glow, image banner/sidebar (`imagePosition`), mosaic gallery (`images[]`), action buttons (`actions` / `TimelineAction`), and entrance animations via IntersectionObserver
- **Toast**: new Feedback component — imperative toast via `useToast()`, supporting `success|warning|error|info` intents, configurable position (6 positions), duration, dismiss, and stacking
- **DateTimePicker**: new Extras component — iOS/Android drum-roll scroll picker with `date` / `time` / `datetime` modes, calendar grid view, quick-offset input (`n day/week/month/year from now`), frosted-glass popover (`backdrop-blur`), mobile bottom-sheet, accent-color highlight band, AM/PM support, locale via `Intl`, min/max constraints, no external date-library dependency, full `--dtp-*` CSS token overrides

### Changed

- **Timeline**: `image` prop supports both full-width banner (`imagePosition="top"`) and fixed sidebar (`imagePosition="left"`) layouts
- **Timeline**: `images[]` renders a responsive mosaic gallery (1→full-width, 2→two-col, 3→left-spanning + two-right, 4→2×2, overflow shows +N tile)
- **Timeline**: active card holo border uses CSS-registered `@property --tl-angle` + `conic-gradient` mask technique — no element rotation, works on any aspect ratio
- **Timeline**: all holo and glow colours are overridable via 10 `--tl-*` CSS custom properties in `:root`
- **docs**: added **CSS Token Overrides** section to 12 API reference pages — Accordion, Alert, Badge, CodeBlock, Dialog, Form, Header, Indicator, List, Table, Tooltip, Tree — documenting every `:root` CSS custom property and its default value

### Fixed

- **TimelineDoc**: rewrote stale API reference; removed `timestamp`, `media`, `badge` (non-existent props); corrected to `date`, `image`/`images`/`svg`, `imagePosition`, `actions`; added `TimelineAction` props table and CSS token section

---

## [2.0.0] — 2026-03-20

### Added

- **TypewriterText**: new Extras component — renders text with a Copilot-style typewriter animation, supporting three modes: `typewriter` (full-replay on each text change), `stream` (append-only, designed for live LLM token streams), and `instant` (no animation)
- **TypewriterText**: `thinking` prop — displays a blinking block cursor before the first token arrives (model-is-thinking state)
- **TypewriterText**: `streaming` prop — keeps cursor blinking while the parent is still receiving data; fades cursor out when flipped to `false`
- **TypewriterText**: polymorphic `as` prop — renders as any HTML element (`span`, `p`, `div`, `pre`, `code`, `h1`–`h6`, `label`, `li`)
- **TypewriterText**: `cursorChar`, `speed`, `delay`, and `onComplete` props for full control over animation behaviour
- **TypewriterText**: complete demo page at `/typewriter-text` with AI chat simulation, speed, cursor, and thinking-state showcases
- **TypewriterText**: doc page added to API Reference under Extras, with prop table and usage examples for all three modes
- **TypewriterText**: 25 unit tests covering instant, typewriter, and stream modes, cursor state machine, and barrel exports

---

## [1.4.1] — 2026-03-20


### Added

- **FileExplorer**: touch drag support — title bar now responds to `touchstart`/`touchmove` for dragging on mobile
- **FileExplorer**: touch resize — all 8 resize handles now fire `onTouchStart`, with enlarged hit targets (edges 12 px, corners 24 px) for reliable finger interaction

### Changed

- **FileExplorer**: rolling `vpSize` state tracks live viewport dimensions; `displayW`/`displayH`/`displayX`/`displayY` derived at render time so the window clamps continuously as the browser is resized without destroying the stored `size`/`pos`
- **FileExplorer**: breakpoint-aware initial size and snap-on-crossing — xs (< 480 px) near-fullscreen, sm (480–639 px) mobile portrait, md (640–1023 px) tablet centered, lg (≥ 1024 px) 720 × 520 centered
- **FileExplorer**: properties panel in narrow mode (< 500 px wide) now uses frosted-glass style — `backdrop-filter: blur(20px) saturate(160%)` with 82 % opaque background and drop shadow instead of a flat transparent surface

### Fixed

- **FileExplorer**: window reverted to mobile size after switching back to desktop — `vpSize` state now drives clamping at render time so the stored desired size restores correctly when viewport widens
- **FileExplorer**: viewport narrowing had no effect on window size — continuous clamping via derived `displayW`/`displayH` replaces the breakpoint-only `setSize` approach
- **MiniPlayer**: expanded demo playlist from 5 to 10 tracks (Mixkit CDN — reliable CORS-friendly sources)
- **CinePlayer**: expanded demo playlist from 6 to 10 clips (Google gtv-videos-bucket with matching poster images); fixed title toast showing simultaneously with title bar on load

---

## [1.4.0] — 2026-03-20

### Added

- **SideNav**: add swipe-to-close gesture for mobile drawer via touch events
- **ProgressBar**: `edge="top|bottom"` now uses `createPortal` to render at document root, fixing `position:fixed` clipping inside `overflow:auto` containers on iOS
- Add full inline `CodeExample` code snippets to all 35 demo pages
- Add complete docs pages for all components (`demo/pages/docs/`)

### Fixed

- **ProgressBar**: apply `right-0` to `edge` variants so the bar spans the full viewport width
- **CodeBlock**: use `var(--color-syntax-bg)` CSS variable for background color for correct dark-mode theming
- **TextBox**: change default border from `border-secondary-300` to `border-secondary-400` for improved visibility
- **Demo site**: add `min-w-0` to `Section` helper to prevent CSS Grid blowout from `<pre>` blocks on mobile
- **Demo site**: prevent iOS Safari auto-zoom on input focus by setting `font-size: 16px` on touch devices via `hover: none and pointer: coarse` media query in `index.css` and `base.css`
- **Demo site**: eliminate residual blank space after iOS keyboard dismissal — `useVisualViewportHeight` hook now uses `focusin`/`focusout` events to save and restore `<main>.scrollTop` around keyboard open/close cycles

---

## [1.3.1] — 2026-03-19

### Changed

- **Demo site**: add inline code-snippet display to all 35 demo pages — every demo section now shows a representative `CodeBlock` powered by the library's own `CodeBlock` component via a shared `CodeExample` helper in `demo/pages/helpers.tsx`. Boilerplate is omitted but API call style is always explicit.

### Fixed

- **shiki restored to `dependencies`** — `1.3.0` incorrectly declared `shiki` as an optional peer dependency, which required consumers to manually install it before `CodeBlock` would work. `shiki` is now back in `dependencies` and is installed automatically. The package size remains ~1.7 MB because `shiki` is still declared as `external` in the tsup build config and is never bundled into the library output.

### Docs

- Removed the `shiki` manual-install note from the `CodeBlock` section in README (no longer needed).

---

## [1.3.0] — 2026-03-19

### Fixed

- **Critical: shiki grammars no longer bundled** — In `1.2.0`, all shiki language grammars were accidentally included in the library bundle, inflating the published package from ~1.7 MB to **13.4 MB**. `shiki` and every `@shikijs/langs/*` entry are now declared as `external` in the tsup build config so they are never bundled into the library output.

### Docs

- Updated README import paths to reflect the category-scoped subpath structure (e.g. `@jacshuo/onyx/Extras/CinePlayer`).
- Fixed `Header` component example in README (corrected `title` → `brand` prop, updated `actions` format).
- Fixed `CinePlayer` import path in README.

### Deprecated

> **⚠️ `1.2.0` is deprecated.** The published package was accidentally bloated to **13.4 MB** due to shiki language grammars being bundled into the library. Please upgrade to `>=1.3.1` immediately. The package size is restored to **~1.7 MB**.

---

## [0.2.0] — 2026-03-18

### Added

- **6 new form / feedback components** — `Checkbox`, `Radio` (with `RadioGroup`), `Switch`, `TextBox`, `ProgressBar`, `Spin`.
  - **Checkbox** — Controlled & uncontrolled, indeterminate state, 5 color intents, 3 sizes.
  - **Radio / RadioGroup** — Context-based grouping, controlled & uncontrolled, intents, sizes, disabled per-item or group-wide.
  - **Switch** — Toggle with optional `checkedContent` / `uncheckedContent` labels inside the track, intents, sizes.
  - **TextBox** — Multi-line textarea with live word count, `maxWords` limit, CJK-aware counting (each CJK character = 1 word), error state, 3 sizes.
  - **ProgressBar** — Determinate & indeterminate modes, animated shine effect, `showLabel`, 4 sizes (xs/sm/md/lg), 4 intents, `edge="top"|"bottom"` for page-fixed positioning.
  - **Spin** — Overlay spinner with portal support, wraps children and dims them while `spinning`, optional `tip` text, 3 sizes.
- **`NavLink` component** — Styled anchor / button for navigation bars with `active` state support.
- **`CodeBlock` component** — Syntax-highlighted code viewer with built-in copy button, line numbers, collapsible blocks, filename header, and theme support (`dark` / `light` / `system`). Zero external dependencies — uses a custom token-based highlighter supporting JSX, TypeScript, CSS, HTML, JSON, bash, SQL, Python, Go, Rust, C#, Java, and YAML.
- **16 new unit tests** — Added test coverage for all previously untested components: Card, Chat, CinePlayer, Dropdown, DropdownButton, FileExplorer, FilmReel, Header, ImageCard, List, MiniPlayer, Panel, SideNav, Table, TextBox, Tree. Total tests: 309.
- **Demo pages** for all new components: Checkbox, Radio, Switch, TextBox, ProgressBar, Spin.

### Enhanced

- **Alert** — New `AlertIcon` and `AlertContent` sub-components for flexible icon + content layouts.
- **Dropdown** — `defaultValue` (single mode) and `defaultSelected` (multiple mode) props for uncontrolled usage; internal state management when running uncontrolled.
- **Table (`SortableTable` / `DataTable`)** — `rowActions` render prop to display action buttons per row; `TableEmpty` sub-component with customizable icon and text.
- **Tree** — `actions` prop on `TreeItem` for hover-revealed action buttons on each node.
- **List** — `ListItem` now supports an `actions` slot for inline action buttons.

### Changed

- Design tokens expanded in `tokens.css` for checkbox, radio, switch, progress bar, and spin components.
- Variant definitions added to `theme.ts` for all new components (`checkboxVariants`, `radioVariants`, `switchTrackVariants`, `progressBarVariants`, `spinVariants`).

---

## [0.1.9] — 2026-03-18

### Added

- **`NavLink` component** — Navigation link with active state styling.
- **`CodeBlock` component** — Syntax-highlighted code viewer with copy button, line numbers, collapsible sections, and zero-dependency custom tokenizer.

### Fixed

- Flaky `Tooltip` test — wrapped timer advances in `act()`.
- Added `@source` directive for consumers using their own Tailwind setup.

---

## [0.1.8] — 2026-03-18

### Added

- **Per-component subpath exports** — Every component is now importable from its own entry point (e.g., `@jacshuo/onyx/Button`, `@jacshuo/onyx/Dialog`). Barrel import from `@jacshuo/onyx` still works.
- **Modular CSS** — CSS is split into independent files:
  - `styles.css` — full pre-compiled bundle (backward compatible)
  - `styles/base.css` — Tailwind utilities + core design tokens (no component extras)
  - `styles/tokens.css` — raw `@theme` tokens only (for projects with their own Tailwind setup)
  - `styles/CinePlayer.css`, `styles/MiniPlayer.css`, `styles/FileExplorer.css`, `styles/FilmReel.css` — per-component keyframes and design tokens
- **`.env` support** — Dev server port is now configurable via `DEV_PORT` in `.env` (defaults to 8080). Added `.env.example`.
- **Auto-discovery** — `tsup.config.ts` auto-discovers components from `src/components/`; no manual list needed when adding new components.

### Changed

- **Build system migrated from Webpack to tsup** (esbuild-based). Per-component ESM entries with code splitting; shared code extracted to `dist/chunks/`. CJS output also per-component.
- **Tree-shaking** fully enabled — `splitting: true`, `treeshake: true`, and `sideEffects: ["*.css"]` ensure bundlers can eliminate unused code.
- **`package.json` exports map** uses wildcard subpath patterns (`./*`) instead of listing every component — scales automatically as new components are added.
- Updated README with new import strategies (full, per-component, CSS options) and updated project structure.

### Removed

- `webpack.config.cjs` — Library builds now use tsup; only demo webpack configs remain.

### Build output (before → after)

| | Before (0.1.7) | After (0.1.8) |
|---|---|---|
| ESM | 1 file, 104.5 KB | 53 files, 117.3 KB total (0.08–0.23 KB per component entry, shared chunks) |
| CJS | 1 file, 112.5 KB | 53 files, 145 KB total |
| DTS | 1 file | 27 files, 43.2 KB |
| CSS | 1 file, 102 KB | 7 files: full (102 KB), base (95 KB), tokens (4.2 KB), 4 component CSS (0.6–2.5 KB each) |

---

## [0.1.7] — 2026-03-18

### Added

- **ESLint** — Flat config (`eslint.config.js`) with `typescript-eslint`, `eslint-plugin-react`, `react-hooks`, `react-refresh`, and Prettier integration.
- **Prettier** — Enforced consistent formatting (double quotes, trailing commas, 100-char width, LF line endings).
- **Husky + lint-staged** — Pre-commit hook automatically lints and formats staged `.ts`/`.tsx` files.
- New npm scripts: `lint`, `lint:fix`, `format`, `format:check`.

### Fixed

- ~2,100 formatting inconsistencies auto-fixed (quote style, trailing commas, spacing).
- Ternary-as-statement patterns replaced with `if/else` blocks (`CinePlayer`, `FileExplorer`, `FilmReel`, `MiniPlayer`, `Table`).
- Empty interfaces in `ImageCard` converted to type aliases.
- Unescaped HTML entities in `DialogPage` demo.
- Constant truthiness expression in `utils.test.ts`.

---

## [0.1.6] — 2026-03-18

### Changed

- **Semantic color system enforced across all components** — Replaced all hardcoded Tailwind color classes (`blue-*`, `gray-*`, `red-*`, `green-*`, `amber-*`) with semantic design tokens (`primary-*`, `secondary-*`, `danger-*`, `success-*`, `warning-*`) defined in `theme.css`. This makes theme customization truly one-stop: override the five semantic palettes in `theme.css` and every component follows.
  - **Chat** — Sender bubble now uses `primary-500/600` instead of `blue-500/600`.
  - **Dropdown** — Checkbox, badge, placeholder, and "Add item" CTA migrated from `blue-*`/`gray-*` to `primary-*`/`secondary-*`.
  - **DropdownButton** — Same checkbox/CTA/input fixes as Dropdown.
  - **Input** — Focus ring, error state, prefix/suffix/action areas all use semantic tokens.
  - **Table (DataTable)** — Toolbar buttons, selection highlight, editable cell, confirm/cancel icons, and checkboxes/radios all migrated.
  - **theme.ts (CVA variants)** — `badgeVariants`, `inputVariants`, and `alertVariants` now reference semantic colors exclusively.
- **Tests updated** to assert against semantic class names instead of raw color names.

### Fixed

- `package-lock.json` sync issue that caused CI `npm ci` to fail (`@noble/hashes` version mismatch).

### Notes

- **FileExplorer**, **FilmReel**, **MiniPlayer**, and **CinePlayer** are exempt from this change — they use their own component-level CSS custom properties (`--fe-*`, `--mp-*`, `--cp-*`) defined in `theme.css`.

---

## [0.1.5] — 2026-03-18

### Changed

- Renamed package from `@jac-ui/react` to `@jacshuo/onyx`.
- Updated all demo pages, README badges, install instructions, and issue templates to reflect the new name.

---

## [0.1.4] — 2026-03-18

### Added

- **"Why Onyx?" section** in README highlighting the desktop-first philosophy.
- **Roadmap section** in README explaining current responsiveness status and inviting community contributions.
- Enhanced **Features list** with keyboard-first and composable API highlights.

---

## [0.1.3] — 2026-03-17

### Added

- First successful automated release of `@jacshuo/onyx` to npm.
- Demo site deployed to GitHub Pages.
- GitHub Release with `.tar.gz` and `.zip` artifacts.
