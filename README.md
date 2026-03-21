<p align="center">
  <img src="https://img.shields.io/npm/v/@jacshuo/onyx?color=8b5cf6&style=flat-square" alt="npm version" />
  <img src="https://img.shields.io/npm/l/@jacshuo/onyx?style=flat-square" alt="license" />
  <img src="https://img.shields.io/github/actions/workflow/status/jacshuo/OnyxUI/ci.yml?branch=main&style=flat-square&label=CI" alt="CI" />
  <img src="https://img.shields.io/npm/dm/@jacshuo/onyx?color=10b981&style=flat-square" alt="downloads" />
  <img src="https://img.shields.io/badge/React-18%2B-61dafb?style=flat-square&logo=react" alt="React 18+" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwindcss" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/TypeScript-strict-3178c6?style=flat-square&logo=typescript" alt="TypeScript" />
</p>

<p align="right">
  <strong>English</strong> | <a href="./README.zh-CN.md">中文</a>
</p>

# @jacshuo/onyx

A **cross-platform React UI component library** built on Tailwind CSS v4 — designed for responsive web apps, content-rich dashboards, and Electron desktop applications. Ships 55+ production-ready components as individually tree-shakeable ESM + CJS bundles with full TypeScript declarations.

Born from a passion for **polished cross-platform experiences**, Onyx delivers a consistent look and feel from mobile screens to 4K displays — with dark mode, keyboard navigation, accessible form wiring, and touch interactions built in from day one.

> **Live Demo →** [jacshuo.github.io/OnyxUI](https://jacshuo.github.io/OnyxUI)

---

## Why Onyx?

### Responsive without compromise
Every component adapts from a phone screen to a 4K display — without a single extra media query from you. Headers fold to hamburger menus, sidebars become draggable mobile drawers, dialogs become bottom sheets, and table layouts reflow gracefully. Size variants (`sm` / `md` / `lg`) and CSS custom property tokens make density adjustments trivial.

### Desktop & Electron — first-class
Onyx treats Electron and desktop apps as primary targets. Components are optimized for keyboard navigation, pointer interactions, content-dense layouts, and drag interactions — territory where most mobile-first libraries underdeliver. `CinePlayer`, `MiniPlayer`, `FileExplorer`, `CommandPalette`, `RibbonBar`, and `FilmReel` are purpose-built for desktop-class applications.

### Accessible by construction
`FormItem` automatically injects `id`, `aria-describedby`, and `aria-invalid` into child controls — no manual wiring. Every interactive component follows WCAG label-for semantics. Screen readers, keyboard users, and autofill all work correctly out of the box.

### Zero-config theming
No build tool plugins. No `tailwind.config.js`. Override any design decision via `@theme {}` tokens or CSS custom properties — including at media query breakpoints. Dark mode is class-based (`.dark` on any ancestor) and works everywhere.

### Minimal footprint, maximum control
No runtime CSS-in-JS. No styled-components. Just Tailwind CSS v4 utility classes and CSS custom properties. Import only what you use — per-component subpath exports ensure unused components never reach your bundle.

---

## Features at a Glance

| | |
|---|---|
| 🧩 **55+ components** | Primitives → Charts → CinePlayer → DataTable, covering the full UI spectrum |
| 📱 **Responsive by default** | Built-in breakpoint layouts, adaptive component modes, touch-friendly tap targets |
| ♿ **Accessible by default** | WCAG label-for, ARIA roles, keyboard navigation, and sr-only wiring throughout |
| 🌗 **Dark / Light mode** | Class-based dark mode, works on any subtree |
| 📊 **Charts included** | BarChart, LineChart, PieChart, ScatterChart — no extra charting library needed |
| ⚡ **Tailwind CSS v4** | Zero config — `@theme` tokens, pure CSS design system |
| 📦 **Tree-shakeable** | Per-component ESM subpath exports — import only what you use |
| 🎨 **Modular CSS** | Full bundle, base-only, or per-component CSS — pick what you need |
| 🖥️ **Electron ready** | Keyboard shortcuts, drag interactions, content-dense layouts |
| 🔤 **Full TypeScript** | Every prop, variant, and event is strictly typed |
| 🧩 **Composable API** | Compound component patterns for full layout control |
| ✅ **519 tests** | 36 test files — Vitest + jsdom + Testing Library |

---

## Installation

```bash
npm install @jacshuo/onyx
# or
pnpm add @jacshuo/onyx
# or
yarn add @jacshuo/onyx
```

Requires **React ≥ 18.0.0** and **react-dom ≥ 18.0.0**.

---

## Quick Start

**1. Import the stylesheet** (once, at your app entry point):

```tsx
import '@jacshuo/onyx/styles.css';
```

**2. Use components:**

```tsx
import { Button, Card, CardHeader, CardTitle, CardContent } from '@jacshuo/onyx';

function App() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hello World</CardTitle>
      </CardHeader>
      <CardContent>
        <Button intent="primary">Get Started</Button>
      </CardContent>
    </Card>
  );
}
```

---

## Import Strategies

Choose the style that fits your bundler and performance requirements.

### Flat import (simplest)

Modern bundlers (Vite, Next.js, webpack 5) tree-shake unused components automatically.

```tsx
import { Button, Dialog, Tabs, Form, FormItem, Input } from '@jacshuo/onyx';
import '@jacshuo/onyx/styles.css';
```

### Per-component import (maximum tree-shaking)

Guarantees only the code you use is included, even with bundlers that don't tree-shake well.

```tsx
import { Button } from '@jacshuo/onyx/Primitives/Button';
import { Dialog, DialogContent } from '@jacshuo/onyx/Overlay/Dialog';
import { LineChart } from '@jacshuo/onyx/Chart/LineChart';
```

### Category namespace

```tsx
import { Primitives, Overlay, Chart } from '@jacshuo/onyx';

<Primitives.Button intent="primary">Save</Primitives.Button>
<Chart.BarChart data={data} />
```

### CSS options

| Import | Description |
|---|---|
| `@jacshuo/onyx/styles.css` | Full pre-compiled bundle — all utilities + all component CSS. Simplest setup. |
| `@jacshuo/onyx/styles/base.css` | Tailwind utilities + core design tokens. No component-specific keyframes. |
| `@jacshuo/onyx/styles/tailwind.css` | **For projects with their own Tailwind CSS v4.** Includes `@source` + tokens + dark variant. |
| `@jacshuo/onyx/styles/tokens.css` | Raw `@theme` tokens only. |
| `@jacshuo/onyx/styles/CinePlayer.css` | CinePlayer keyframes & `--cp-*` tokens |
| `@jacshuo/onyx/styles/MiniPlayer.css` | MiniPlayer keyframes & `--mp-*` tokens |
| `@jacshuo/onyx/styles/FileExplorer.css` | FileExplorer `--fe-*` tokens |
| `@jacshuo/onyx/styles/FilmReel.css` | FilmReel keyframes |

#### Using alongside your own Tailwind CSS v4

```css
/* your app's CSS entry */
@import "tailwindcss";
@import "@jacshuo/onyx/styles/tailwind.css";

/* add per-component CSS as needed */
@import "@jacshuo/onyx/styles/CinePlayer.css";
```

> Use `tailwind.css` — not `tokens.css` — so that Tailwind's scanner picks up class names from Onyx's compiled JS via the included `@source` directive.

---

## Component Library

### Primitives

| Component | Description |
|---|---|
| **Button** | 6 intents (primary, secondary, danger, warning, ghost, outline) × 3 sizes |
| **Input** | Text input with prefix, suffix, action button, and size variants |
| **TextBox** | Textarea with live word/character count and CJK-aware counting |
| **Dropdown** | Single & multi-select with search, grouped options, clearable, and keyboard nav |
| **Checkbox** | Tri-state (checked, unchecked, indeterminate) with label |
| **Radio / RadioGroup** | Grouped radio buttons with intent and size variants |
| **Switch** | Toggle switch with checked/unchecked slot content |
| **Slider / SliderRange** | Single-value and range sliders with keyboard control |
| **Badge** | Inline status badge with dot, outline, and pill variants |
| **Tag / Chip** | Dismissible tag for selections and filters |
| **Label** | Form label with size variants |
| **Avatar** | User avatar with image, initials fallback, and status indicator |
| **Indicator** | Numeric badge overlay for icons and avatars |

### Layout

| Component | Description |
|---|---|
| **Card** | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` |
| **ImageCard** | Image-first card with overlay actions and hover states |
| **Panel** | Collapsible content panel with header |

### Data Display

| Component | Description |
|---|---|
| **Table / DataTable** | Basic table primitives + full-featured sortable/selectable/paginated data table |
| **List / ListItem** | Styled list with leading icon/avatar, title, description, and trailing action |
| **Tree / TreeItem** | Expandable tree view with keyboard navigation |
| **Chat** | Chat message thread with sent/received bubbles and timestamps |
| **CodeBlock** | Shiki-powered syntax highlighting — 20+ languages, line numbers, live-editable mode |
| **MetricCard** | KPI card with trend indicator and sparkline slot |
| **Stat** | Compact statistic display with label, value, and change indicator |

### Navigation

| Component | Description |
|---|---|
| **Header** | App header with responsive hamburger collapse, nav items, and action buttons |
| **SideNav** | Collapsible sidebar — expanded / icon-only / rail modes; mobile drawer with draggable pull-tab and `mobileDrawerSlot` |
| **NavLink** | Semantic link with auto external-link detection, intent/size/underline variants |
| **Breadcrumb** | Breadcrumb trail with truncation |
| **Pagination** | Page number navigation with first/last/prev/next |
| **RibbonBar** | Office-style ribbon toolbar with grouped commands |

### Disclosure

| Component | Description |
|---|---|
| **Accordion** | Expandable sections with animated open/close |
| **Tabs** | `TabList`, `TabTrigger`, `TabPanels`, `TabContent` with sliding indicator |

### Overlay

| Component | Description |
|---|---|
| **Dialog** | Modal dialog — centered on desktop, bottom sheet on mobile; stacking support |
| **Drawer** | Side drawer with responsive swipe-to-dismiss |
| **Tooltip** | Hover tooltip with configurable placement and delay |
| **ContextMenu** | Right-click context menu with submenus |

### Feedback

| Component | Description |
|---|---|
| **Alert / useAlert()** | Toast-style alerts with `useAlert()` hook — success, error, warning, info |
| **ProgressBar** | Determinate and indeterminate progress |
| **Skeleton** | Loading placeholder with pulse animation |
| **Spin** | Spinner with intent and size variants |
| **Toast** | Standalone toast notification |

### Forms

| Component | Description |
|---|---|
| **Form / FormItem / FormSection** | Stacked & inline layouts, card/inset appearance, auto `id`/`aria-describedby` injection, bulk validation via `onValues` |
| **Select** | Native-style accessible select with custom styling |

### Charts

| Component | Description |
|---|---|
| **BarChart** | Vertical/horizontal bar chart with tooltip and legend |
| **LineChart** | Multi-series line chart with area fill option |
| **PieChart** | Pie/donut chart with animated segments |
| **ScatterChart** | Scatter plot with configurable point size and color |

### Extras

| Component | Description |
|---|---|
| **CinePlayer** | Full-featured video player — cinema mode, playlist, keyboard shortcuts, accent color |
| **MiniPlayer** | Floating music player — dock, playlist, shuffle, loop, accent color |
| **FileExplorer** | File manager — drag-select, resize, dock, multi-select, `Delete` key with confirmation |
| **FilmReel** | Cinematic photo gallery with lightbox and keyboard navigation |
| **CommandPalette** | Spotlight-style command palette with fuzzy search |
| **DateTimePicker** | Date and time picker with calendar grid and time sliders |
| **Timeline** | Vertical timeline with icon, status, and time slots |
| **Masonry** | Responsive masonry grid layout |
| **TypewriterText** | Animated typewriter text with configurable speed and cursor |

---

## Forms & Accessibility

`FormItem` is the connectivity layer between labels and controls. It injects `id`, `aria-describedby`, and `aria-invalid` into its first child automatically — every labelable control (`Input`, `TextBox`, `Dropdown`, `Switch`, `Checkbox`, `Slider`) receives correct WCAG label-for wiring without any manual props.

```tsx
import { Form, FormItem, Input, Dropdown, Switch, Button } from '@jacshuo/onyx';

<Form layout="inline">
  <FormItem label="Email" required>
    <Input type="email" placeholder="you@example.com" />
  </FormItem>

  <FormItem label="Role">
    <Dropdown options={roles} placeholder="Select a role…" />
  </FormItem>

  <FormItem label="Notifications">
    {/* id injected directly onto Switch's native <input> */}
    <Switch label="Receive email notifications" />
  </FormItem>
</Form>
```

### Validation

```tsx
<FormItem
  label="Username"
  required
  onValidate={(value) =>
    value.length >= 3
      ? { result: true, reason: 'Username is available.' }
      : { result: false, reason: 'Must be at least 3 characters.' }
  }
>
  <Input placeholder="jane_doe" />
</FormItem>
```

---

## Theming

### Dark Mode

Class-based dark mode — add `.dark` to any ancestor:

```html
<html class="dark">
  <!-- all Onyx components render in dark mode -->
</html>
```

### Override Design Tokens

All colors, spacing, and sizing values are CSS custom properties overridable without ejecting:

```css
/* Widen label column on desktop */
@media (min-width: 768px) {
  :root {
    --form-label-w-md: 9rem;
    --form-item-gap-md: 1rem;
  }
}

/* Retheme CinePlayer */
:root {
  --cp-bg: #0a0a0a;
  --cp-surface-hover: rgba(255, 255, 255, 0.15);
}

/* Retheme MiniPlayer */
:root            { --mp-bg: rgba(255, 255, 255, 0.92); }
.dark            { --mp-bg: rgba(18, 15, 28, 0.96); }
```

### Accent Colors

Media-rich components accept a CSS color string for branding consistency:

```tsx
<CinePlayer  accent="#f43f5e" playlist={videos} />
<MiniPlayer  accent="#8b5cf6" playlist={tracks} />
<FileExplorer accent="#10b981" files={files} />
```

<details>
<summary><strong>Full component token reference</strong></summary>

#### CinePlayer (`--cp-*`)
| Token | Default | Description |
|---|---|---|
| `--cp-bg` | `#000000` | Player background |
| `--cp-panel-bg` | `rgba(0,0,0,0.85)` | Playlist/overlay panel |
| `--cp-text` | `rgba(255,255,255,0.75)` | Primary text |
| `--cp-text-muted` | `rgba(255,255,255,0.50)` | Secondary text |
| `--cp-text-strong` | `#ffffff` | Emphasized text |
| `--cp-border` | `rgba(255,255,255,0.10)` | Border color |
| `--cp-surface` | `rgba(255,255,255,0.05)` | Surface background |
| `--cp-surface-hover` | `rgba(255,255,255,0.10)` | Hover state |
| `--cp-overlay` | `rgba(0,0,0,0.30)` | Overlay backdrop |
| `--cp-seek-track` | `rgba(255,255,255,0.20)` | Seek bar track |
| `--cp-seek-buffer` | `rgba(255,255,255,0.15)` | Buffered region |

#### MiniPlayer (`--mp-*`)
| Token | Light | Dark |
|---|---|---|
| `--mp-bg` | `rgba(255,255,255,0.90)` | `rgba(26,22,37,0.95)` |
| `--mp-text` | `primary-900` | `#ffffff` |
| `--mp-text-muted` | `primary-500` | `rgba(255,255,255,0.50)` |
| `--mp-border` | `rgba(148,163,184,0.60)` | `rgba(255,255,255,0.10)` |
| `--mp-surface` | `rgba(148,163,184,0.50)` | `rgba(255,255,255,0.10)` |
| `--mp-surface-hover` | `rgba(241,245,249,0.60)` | `rgba(255,255,255,0.05)` |
| `--mp-dock-strip` | `rgba(148,163,184,0.40)` | `rgba(255,255,255,0.20)` |

#### FileExplorer (`--fe-*`)
| Token | Light | Dark |
|---|---|---|
| `--fe-bg` | Gradient white | Gradient dark |
| `--fe-shadow` | Soft shadow | Glow shadow |
| `--fe-text` | `primary-600` | `rgba(255,255,255,0.70)` |
| `--fe-text-strong` | `primary-900` | `#ffffff` |
| `--fe-text-muted` | `primary-400` | `rgba(255,255,255,0.30)` |
| `--fe-border` | `rgba(0,0,0,0.06)` | `rgba(255,255,255,0.06)` |
| `--fe-btn-color` | `rgba(0,0,0,0.45)` | `rgba(255,255,255,0.50)` |

</details>

---

## Responsive Design

Onyx handles responsive behavior internally — you don't write breakpoint logic.

### Header — automatic hamburger collapse

```tsx
<Header
  brand="My App"
  mobileMenu
  navItems={[
    { label: 'Home', href: '/' },
    { label: 'Docs', href: '/docs' },
  ]}
  actions={[{ icon: <SearchIcon />, 'aria-label': 'Search', onClick: openSearch }]}
/>
// ≥md: full nav bar   <md: hamburger menu — no extra props
```

### SideNav — mobile drawer with draggable pull-tab

```tsx
<SideNav
  items={navItems}
  collapsible
  mobileDrawerSlot={
    <Input prefix={<SearchIcon />} placeholder="Search…" />
  }
/>
// Desktop: expanded / icon-only / rail collapse modes
// Mobile:  slide-out drawer, draggable repositionable pull-tab
```

### Dialog — bottom sheet on mobile

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent size="sm">
    <DialogHeader><DialogTitle>Confirm</DialogTitle></DialogHeader>
    <p>Are you sure?</p>
    <DialogFooter>
      <Button intent="ghost" onClick={() => setOpen(false)}>Cancel</Button>
      <Button intent="primary" onClick={() => setOpen(false)}>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
// ≥md: centered modal   <md: slides up from bottom
```

### Token overrides at breakpoints

```css
/* Mobile-first defaults */
:root {
  --form-label-w-md: 5rem;
  --form-item-gap-md: 0.5rem;
}

/* Wider labels and more breathing room on desktop */
@media (min-width: 768px) {
  :root {
    --form-label-w-md: 9rem;
    --form-item-gap-md: 1rem;
  }
}
```

---

## Selected Usage Examples

### Charts

```tsx
import { BarChart, LineChart, PieChart } from '@jacshuo/onyx';

<BarChart
  data={[
    { label: 'Jan', value: 420 },
    { label: 'Feb', value: 380 },
    { label: 'Mar', value: 510 },
  ]}
/>

<LineChart
  series={[
    { name: 'Revenue', data: [120, 180, 240, 310] },
    { name: 'Costs',   data: [80,  100, 130, 160] },
  ]}
  labels={['Q1', 'Q2', 'Q3', 'Q4']}
/>

<PieChart
  segments={[
    { label: 'Product A', value: 45 },
    { label: 'Product B', value: 30 },
    { label: 'Other',     value: 25 },
  ]}
  donut
/>
```

### DataTable

```tsx
import { DataTable, type ColumnDef } from '@jacshuo/onyx';

type User = { id: number; name: string; email: string; role: string };

const columns: ColumnDef<User>[] = [
  { key: 'id',    header: 'ID',    width: 60 },
  { key: 'name',  header: 'Name',  sortable: true },
  { key: 'email', header: 'Email', sortable: true },
  { key: 'role',  header: 'Role' },
];

<DataTable
  columns={columns}
  data={users}
  selectionMode="multi"
  pageSize={10}
/>
```

### Alert (Toast)

```tsx
import { useAlert, Button } from '@jacshuo/onyx';

function SaveButton() {
  const alert = useAlert();

  return (
    <Button
      intent="primary"
      onClick={() =>
        alert({ title: 'Saved!', description: 'Your changes have been saved.', variant: 'success' })
      }
    >
      Save
    </Button>
  );
}
```

### Tabs

```tsx
import { Tabs, TabList, TabTrigger, TabPanels, TabContent } from '@jacshuo/onyx';

<Tabs defaultValue="overview">
  <TabList>
    <TabTrigger value="overview">Overview</TabTrigger>
    <TabTrigger value="settings">Settings</TabTrigger>
  </TabList>
  <TabPanels>
    <TabContent value="overview">Overview content…</TabContent>
    <TabContent value="settings">Settings content…</TabContent>
  </TabPanels>
</Tabs>
```

### NavLink

```tsx
import { NavLink } from '@jacshuo/onyx';

{/* Internal link */}
<NavLink href="/about">About</NavLink>

{/* Auto-detected external — shows icon + sets target="_blank" */}
<NavLink href="https://github.com">GitHub</NavLink>

{/* Variants */}
<NavLink href="/docs" intent="secondary" size="lg" underline="always">Docs</NavLink>
```

### CodeBlock

```tsx
import { CodeBlock } from '@jacshuo/onyx';

{/* Syntax highlighting (Shiki — included, no extra install) */}
<CodeBlock code={`const x: number = 42;`} language="typescript" lineNumbers />

{/* Live editable editor */}
function Editor() {
  const [code, setCode] = useState('console.log("hello")');
  return (
    <CodeBlock
      code={code}
      language="typescript"
      editable
      onCodeChange={setCode}
      lineNumbers
    />
  );
}
```

### CommandPalette

```tsx
import { CommandPalette } from '@jacshuo/onyx';

<CommandPalette
  open={open}
  onOpenChange={setOpen}
  commands={[
    { id: 'new-file',   label: 'New File',       icon: <FileIcon />,    action: newFile },
    { id: 'open-prefs', label: 'Preferences',    icon: <SettingsIcon />, action: openPrefs },
    { id: 'git-commit', label: 'Commit Changes', icon: <GitIcon />,     action: commit },
  ]}
/>
```

### MiniPlayer

```tsx
import { MiniPlayer } from '@jacshuo/onyx';

<MiniPlayer
  playlist={[
    { title: 'Midnight City', artist: 'M83', src: '/audio/midnight.mp3', cover: '/covers/m83.jpg' },
    { title: 'Intro',         artist: 'The xx', src: '/audio/intro.mp3' },
  ]}
  position="bottom-right"
  accent="#8b5cf6"
  shuffle
/>
```

### CinePlayer

```tsx
import { CinePlayer } from '@jacshuo/onyx';

<CinePlayer
  playlist={[{ title: 'Product Demo', src: '/video/demo.mp4' }]}
  accent="#f43f5e"
  onPlayChange={(playing, index) => trackAnalytics(playing, index)}
/>
```

### FileExplorer

```tsx
import { FileExplorer, type FileExplorerItem } from '@jacshuo/onyx';

const files: FileExplorerItem[] = [
  { name: 'src',      path: '/src',          type: 'directory' },
  { name: 'index.ts', path: '/src/index.ts', type: 'file', size: 2048, extension: '.ts' },
];

<FileExplorer
  files={files}
  accent="#10b981"
  dockable
  onFileOpen={(f) => openEditor(f.path)}
  onDelete={(items) => confirmDelete(items)}
/>
```

---

## Keyboard Shortcuts

### CinePlayer
| Key | Action |
|---|---|
| `Space` | Play / Pause |
| `← / →` | Seek ±5 s |
| `↑ / ↓` | Volume ±5% |
| `F` | Toggle fullscreen |
| `C` | Toggle cinema mode |
| `L` | Toggle playlist |
| `M` | Mute / Unmute |
| `N / P` | Next / Previous track |
| `S` | Toggle shuffle |

### FileExplorer
| Key | Action |
|---|---|
| `Click` | Select |
| `Ctrl+Click` | Multi-select |
| `Ctrl+A` | Select all |
| `Delete` | Delete selected (with confirmation) |
| `Escape` | Clear selection |
| `Double-click` | Open file / navigate directory |

---

## Development

```bash
npm install          # install dependencies
npm run dev          # demo dev server → http://localhost:3001
npm run build        # library build → dist/
npm run build:demo   # demo site build → dist-demo/
npm run test         # run all 519 tests (Vitest)
npm run typecheck    # tsc --noEmit
npm run lint         # eslint src demo
```

---

## Project Structure

```
src/
├── components/        55+ components across 10 categories
│   ├── Primitives/    Button, Input, Dropdown, Switch, Slider, Checkbox, Radio…
│   ├── Layout/        Card, ImageCard, Panel
│   ├── DataDisplay/   Table, DataTable, List, Tree, Chat, CodeBlock, MetricCard…
│   ├── Navigation/    Header, SideNav, NavLink, Breadcrumb, RibbonBar, Pagination
│   ├── Disclosure/    Accordion, Tabs
│   ├── Overlay/       Dialog, Drawer, Tooltip, ContextMenu
│   ├── Feedback/      Alert, ProgressBar, Skeleton, Spin, Toast
│   ├── Forms/         Form, FormItem, FormSection, Select
│   ├── Extras/        CinePlayer, MiniPlayer, FileExplorer, CommandPalette…
│   └── Chart/         BarChart, LineChart, PieChart, ScatterChart
├── styles/
│   ├── tokens/core.css         @theme semantic color tokens
│   ├── tokens/animations.css   Shared keyframes & animation utilities
│   ├── theme/                  CVA variant functions (one file per category)
│   ├── index.css               Full bundle entry
│   └── tailwind.css            Consumer integration entry
└── __tests__/                  36 test files, 519 tests
demo/                           Interactive demo site (GitHub Pages)
.github/
├── workflows/ci.yml            PR checks: typecheck + build
└── workflows/release.yml       Manual release: patch / minor / major
dist/                           Published library (ESM + CJS + DTS + CSS)
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Commit your changes following [Conventional Commits](https://www.conventionalcommits.org/)
4. Push and open a Pull Request

- Contribution guide: [CONTRIBUTING.md](./CONTRIBUTING.md)
- Security policy: [SECURITY.md](./SECURITY.md)

---

## License

[MIT](./LICENSE) © Shuo Wang
