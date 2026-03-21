<p align="center">
  <img src="https://img.shields.io/npm/v/@jacshuo/onyx?color=8b5cf6&style=flat-square" alt="npm version" />
  <img src="https://img.shields.io/npm/l/@jacshuo/onyx?style=flat-square" alt="license" />
  <img src="https://img.shields.io/github/actions/workflow/status/jacshuo/OnyxUI/ci.yml?branch=main&style=flat-square&label=CI" alt="CI" />
  <img src="https://img.shields.io/npm/dm/@jacshuo/onyx?color=10b981&style=flat-square" alt="downloads" />
</p>

<p align="right">
  <strong>English</strong> | <a href="./README.zh-CN.md">中文</a>
</p>

# @jacshuo/onyx

A **React UI component library** built with Tailwind CSS v4 — crafted for responsive web apps and Electron desktop applications alike. Ships tree-shakeable ESM + CJS bundles with per-component subpath exports, modular CSS, and full TypeScript declarations.

Born from a passion for **polished cross-platform experiences**, Onyx delivers a consistent look and feel from mobile screens to 4K displays — with dark mode, keyboard navigation, and touch interactions built in from day one.

> **Live Demo →** [jacshuo.github.io/OnyxUI](https://jacshuo.github.io/OnyxUI)

---

## Why Onyx?

- **Responsive by design** — Every component adapts from a phone screen to a 4K display without a single extra media query from you. Headers fold to hamburger menus, sidebars slide to icon-only or drawer modes, dialogs become bottom sheets — all built in. Size variants (`sm` / `md` / `lg`) and semantic CSS tokens make density adjustments trivial.
- **Desktop & Electron first-class support** — Onyx is crafted with Electron and desktop apps as a primary use case. Components are optimized for keyboard navigation, pointer interactions, and content-dense layouts that most mobile-first libraries struggle to deliver.
- **Production-ready out of the box** — Dark mode, design tokens, accessibility, touch gestures, and keyboard shortcuts are built in from day one — not bolted on as an afterthought.
- **Minimal footprint, maximum control** — No runtime CSS-in-JS. Just Tailwind CSS v4 utility classes and CSS custom properties. Override any token without ejecting or fighting specificity wars.
- **Rich, specialized components** — Beyond the usual buttons and inputs, Onyx includes `CinePlayer`, `MiniPlayer`, `FileExplorer`, and `DataTable` — components that are hard to find in general-purpose libraries but essential for media-rich and desktop-class applications.

---

## Features

- 🎨 **50+ components** — from Button → DataTable → CinePlayer → CodeBlock
- 📱 **Responsive by default** — built-in breakpoint layouts, touch-friendly tap targets, and adaptive component modes (hamburger nav, drawer sidebar, bottom-sheet dialog)
- 🌗 **Dark / Light mode** — class-based, works out of the box
- 🎯 **CSS variable design tokens** — override any design decision via CSS custom properties, including at media query breakpoints
- ⚡ **Tailwind CSS v4** — zero config, `@theme` tokens, `color-mix()` accent support
- 📦 **Tree-shakeable** — Per-component ESM entries with code splitting; import only what you use
- 🗂️ **On-demand imports** — Subpath exports (`@jacshuo/onyx/Button`) for maximum control
- 🎨 **Modular CSS** — Full bundle, base-only, or per-component CSS — pick exactly what you need
- 🖥️ **Cross-platform** — built for web & Electron desktop apps
- ⌨️ **Keyboard-first** — comprehensive keyboard shortcuts for CinePlayer, FileExplorer, and more
- 👆 **Touch & gesture support** — tap-to-reveal, focus-visible states, and touch-optimized interactions across all interactive components
- 🔤 **Full TypeScript** — every prop, event, and variant is typed
- 🧩 **Composable API** — compound component patterns (e.g., `Dialog` → `DialogContent` + `DialogHeader` + `DialogFooter`) let you assemble exactly what you need

---

## Installation

```bash
npm install @jacshuo/onyx
# or
pnpm add @jacshuo/onyx
# or
yarn add @jacshuo/onyx
```

### Peer Dependencies

```bash
npm install react react-dom
```

> Requires **React ≥ 18.0.0**.

---

## Quick Start

**1. Import the stylesheet** (once, at your app entry point):

```tsx
// main.tsx or App.tsx
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

Onyx supports multiple import styles — pick the one that best fits your bundler and performance requirements.

### Full import (simplest)

Import everything from the barrel entry. Modern bundlers (Vite, Next.js, webpack 5) will tree-shake unused components automatically.

```tsx
import { Button, Dialog, Tabs } from '@jacshuo/onyx';
import '@jacshuo/onyx/styles.css';
```

### Per-component import (maximum tree-shaking)

Import each component from its own subpath. This guarantees only the code you use is included, even with bundlers that don't tree-shake well.

Components are organized under category subpaths (`Primitives`, `Overlay`, `Disclosure`, `DataDisplay`, `Navigation`, `Layout`, `Feedback`, `Forms`, `Extras`):

```tsx
// Individual component
import { Button } from '@jacshuo/onyx/Primitives/Button';
import { Dialog, DialogContent } from '@jacshuo/onyx/Overlay/Dialog';
import { Tabs, TabList, TabTrigger } from '@jacshuo/onyx/Disclosure/Tabs';

// Or import everything from a category at once
import { Button, Input, Badge } from '@jacshuo/onyx/Primitives';
import { Alert } from '@jacshuo/onyx/Feedback';
```

### CSS options

| Import | Size | Description |
|---|---|---|
| `@jacshuo/onyx/styles.css` | ~102 KB | Full pre-compiled bundle — all utilities + all component CSS. Simplest setup. |
| `@jacshuo/onyx/styles/base.css` | ~95 KB | Tailwind utilities + core design tokens. No component-specific keyframes. |
| `@jacshuo/onyx/styles/tailwind.css` | ~4 KB | **For projects with their own Tailwind CSS v4.** Includes `@source` directive, tokens & dark mode variant. |
| `@jacshuo/onyx/styles/tokens.css` | ~4 KB | Raw `@theme` tokens only — no `@source`, no Tailwind import. |
| `@jacshuo/onyx/styles/CinePlayer.css` | ~2.5 KB | CinePlayer keyframes & `--cp-*` design tokens |
| `@jacshuo/onyx/styles/MiniPlayer.css` | ~2.2 KB | MiniPlayer keyframes & `--mp-*` design tokens |
| `@jacshuo/onyx/styles/FileExplorer.css` | ~1.6 KB | FileExplorer `--fe-*` design tokens |
| `@jacshuo/onyx/styles/FilmReel.css` | ~0.6 KB | FilmReel keyframes |

#### Using with your own Tailwind CSS v4 setup

If your project already runs Tailwind CSS v4 and you want to import only the tokens (not the full pre-compiled bundle), you **must** use `tailwind.css` so that Tailwind scans the library's JS files for class names:

```css
/* your app's CSS entry */
@import "tailwindcss";
@import "@jacshuo/onyx/styles/tailwind.css";

/* optionally add per-component CSS for CinePlayer, MiniPlayer, etc. */
@import "@jacshuo/onyx/styles/CinePlayer.css";
```

> **Why?** Onyx components use Tailwind utility classes defined in JavaScript (via CVA). Without `@source`, your Tailwind build won't know about these classes and they won't be generated. The `tailwind.css` file includes `@source ".."` which tells Tailwind v4 to scan the library's compiled JS.
>
> **Do NOT** use `tokens.css` alone — it only provides design tokens without the `@source` directive, so component styles will be incomplete.

**Example — minimal setup with CinePlayer only:**

```tsx
import '@jacshuo/onyx/styles/base.css';
import '@jacshuo/onyx/styles/CinePlayer.css';
import { CinePlayer } from '@jacshuo/onyx/Extras/CinePlayer';
```

---

## Components

### Primitives

| Component | Description |
|---|---|
| **Button** | Primary, secondary, danger, warning, ghost, outline intents with sm/md/lg sizes |
| **Input** | Styled text input with variant support |
| **Label** | Form label with size variants |
| **Badge** | Inline status badges |
| **Dropdown** | Single & multi-select dropdowns |
| **DropdownButton** | Button with a dropdown menu |

### Layout

| Component | Description |
|---|---|
| **Card** | Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter |
| **HorizontalCard** | Side-by-side image + content card |
| **ImageCard** | Image-first card with overlay actions |
| **Panel** | Collapsible panel with header |

### Data Display

| Component | Description |
|---|---|
| **Table** | Basic table primitives (Table, TableHeader, TableBody, TableRow, etc.) |
| **SortableTable** | Click-to-sort column headers |
| **DataTable** | Full-featured data table with sorting, selection, pagination |
| **List / ListItem** | Styled list component |
| **Tree / TreeItem** | Expandable tree view |
| **Chat** | Chat message list with sent/received styling |
| **CodeBlock** | Syntax-highlighted code block powered by Shiki, supports 20+ languages, line numbers, and live editable mode |

### Navigation

| Component | Description |
|---|---|
| **SideNav** | Collapsible sidebar with icons, sections, and multiple collapse modes |
| **Header** | App header with nav items and action buttons |
| **NavLink** | Semantic text link (`<a>`) with auto external-link detection, intent/size/underline variants |
| **Tabs** | Tab bar with sliding indicator animation |

### Disclosure

| Component | Description |
|---|---|
| **Accordion** | Expandable accordion sections |
| **Tabs** | TabList, TabTrigger, TabPanels, TabContent |

### Overlay

| Component | Description |
|---|---|
| **Dialog** | Modal dialog with stacking support, backdrop click, ESC handling |
| **Tooltip** | Hover tooltip with configurable placement |
| **Alert** | Toast-style alert system with `useAlert()` hook |

### Extras

| Component | Description |
|---|---|
| **FilmReel** | Cinematic photo gallery with lightbox |
| **MiniPlayer** | Floating mini music player with dock, playlist, shuffle, loop |
| **CinePlayer** | Full video player with cinema mode, playlist, keyboard shortcuts |
| **FileExplorer** | Sci-fi themed file explorer with drag, resize, dock, multi-select, Delete key |

---

## Theming

### Dark Mode

The library uses Tailwind's **class-based** dark mode. Add `class="dark"` to your `<html>` or any ancestor element:

```html
<html class="dark">
  <!-- all OnyxUI components render in dark mode -->
</html>
```

### Accent Colors

Many components accept an `accent` prop (any CSS color string):

```tsx
<MiniPlayer accent="#3b82f6" playlist={tracks} />
<CinePlayer accent="#f43f5e" playlist={videos} />
<FileExplorer accent="#10b981" files={files} />
```

### CSS Custom Properties

All component colors are defined as CSS custom properties in `:root` and `.dark`, making them fully overridable:

```css
/* Override CinePlayer colors */
:root {
  --cp-bg: #111;
  --cp-text: rgba(255, 255, 255, 0.8);
  --cp-surface-hover: rgba(255, 255, 255, 0.15);
}

/* Override MiniPlayer colors */
:root {
  --mp-bg: rgba(255, 255, 255, 0.95);
  --mp-text: #1e293b;
}
.dark {
  --mp-bg: rgba(20, 18, 30, 0.95);
  --mp-text: #ffffff;
}

/* Override FileExplorer colors */
:root {
  --fe-bg: linear-gradient(145deg, #fff, #f8f8fc);
  --fe-text: #475569;
}
```

<details>
<summary><strong>Full token reference</strong></summary>

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

Onyx components handle responsive behavior internally — you get adaptive layouts without writing media queries yourself.

### Responsive Header

`Header` automatically collapses nav items into a hamburger drawer on mobile. No extra config needed:

```tsx
import { Header } from '@jacshuo/onyx';

// On ≥md screens: full nav bar + action buttons
// On <md screens:  hamburger menu (nav) + overflow menu (actions) — automatic
<Header
  brand="My App"
  mobileMenu
  navItems={[
    { label: 'Home', href: '/' },
    { label: 'Docs', href: '/docs' },
    { label: 'Changelog', href: '/changelog' },
  ]}
  actions={[
    { icon: <UserIcon />, 'aria-label': 'Sign in', onClick: () => navigate('/login') },
  ]}
/>
```

### Responsive Sidebar

`SideNav` ships with three collapse modes. Wire them to a responsive state to get a desktop-to-mobile transition with one state variable:

```tsx
import { useState } from 'react';
import { SideNav, type SideNavCollapseMode } from '@jacshuo/onyx';

function AppShell() {
  const [mode, setMode] = useState<SideNavCollapseMode>('expanded');

  return (
    <div className="flex h-screen">
      {/* Hidden on mobile; collapsible on desktop */}
      <aside className="hidden md:block shrink-0">
        <SideNav
          items={navItems}
          collapsible
          collapseMode={mode}
          onCollapseModeChange={setMode}
        />
      </aside>

      {/* Slide-over drawer on mobile */}
      <aside className="md:hidden">
        <SideNav items={navItems} />
      </aside>

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        {/* page content */}
      </main>
    </div>
  );
}
```

### Dialog — Bottom Sheet on Mobile

`Dialog` automatically renders as a bottom sheet on small screens, keeping the dismiss-by-swipe pattern users expect on mobile:

```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, Button } from '@jacshuo/onyx';

// On ≥md screens: centered modal dialog
// On <md screens: slides up from bottom as a full-width sheet — no extra props
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent size="sm">
    <DialogHeader>
      <DialogTitle>Confirm Action</DialogTitle>
    </DialogHeader>
    <p>Are you sure you want to proceed?</p>
    <div className="flex justify-end gap-2">
      <Button intent="ghost" onClick={() => setOpen(false)}>Cancel</Button>
      <Button intent="primary" onClick={() => setOpen(false)}>Confirm</Button>
    </div>
  </DialogContent>
</Dialog>
```

### Size Variants for Density Control

All components expose a `size` prop (`sm` / `md` / `lg`) for adapting density to the target context — tight mobile layouts or spacious desktop dashboards:

```tsx
import { DataTable, Button, Tabs, TabList, TabTrigger } from '@jacshuo/onyx';

// Compact for mobile
<DataTable columns={columns} data={rows} size="sm" />

// Comfortable for desktop
<DataTable columns={columns} data={rows} size="lg" />

// Mix sizes to match your layout density
<Tabs defaultValue="a">
  <TabList size="sm">          {/* compact tabs */}
    <TabTrigger value="a">Tab A</TabTrigger>
    <TabTrigger value="b">Tab B</TabTrigger>
  </TabList>
</Tabs>
```

### Token Overrides at Breakpoints

All sizing and spacing values are CSS custom properties. Override them at any breakpoint for precisely tuned responsive behavior:

```css
/* Default (mobile-first) form layout */
:root {
  --form-label-w-md: 5rem;
  --form-item-gap-md: 0.5rem;
  --form-row-gap-md: 0.75rem;
}

/* Wider label column and increased spacing on desktop */
@media (min-width: 768px) {
  :root {
    --form-label-w-md: 7rem;
    --form-item-gap-md: 0.75rem;
    --form-row-gap-md: 1.25rem;
  }
}
```

---

## Usage Examples

### Button

```tsx
import { Button } from '@jacshuo/onyx';

<Button intent="primary" size="lg">Save</Button>
<Button intent="danger">Delete</Button>
<Button intent="ghost">Cancel</Button>
<Button intent="outline">Settings</Button>
```

### Dialog

```tsx
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, Button } from '@jacshuo/onyx';

function ConfirmDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to proceed?</p>
          <DialogFooter>
            <Button intent="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button intent="primary" onClick={() => setOpen(false)}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
```

### DataTable

```tsx
import { DataTable, type ColumnDef } from '@jacshuo/onyx';

type User = { id: number; name: string; email: string };

const columns: ColumnDef<User>[] = [
  { key: 'id', header: 'ID', width: 60 },
  { key: 'name', header: 'Name', sortable: true },
  { key: 'email', header: 'Email', sortable: true },
];

<DataTable columns={columns} data={users} selectionMode="multi" pageSize={10} />
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

### Alert (Toast)

```tsx
import { useAlert, Button } from '@jacshuo/onyx';

function NotifyButton() {
  const alert = useAlert();

  return (
    <Button onClick={() => alert({ title: 'Saved!', description: 'Your changes have been saved.', variant: 'success' })}>
      Save
    </Button>
  );
}
```

### NavLink

```tsx
import { NavLink } from '@jacshuo/onyx';

{/* Internal link */}
<NavLink href="/about">About</NavLink>

{/* Auto-detected external — shows icon + sets target="_blank" automatically */}
<NavLink href="https://github.com">GitHub</NavLink>

{/* Suppress external icon */}
<NavLink href="https://example.com" external={false}>Example</NavLink>

{/* Variants */}
<NavLink href="/docs" intent="secondary" size="lg" underline="always">Docs</NavLink>
```

### CodeBlock

> **Note:** `CodeBlock` uses [Shiki](https://shiki.style/) for syntax highlighting. Shiki is included as a direct dependency and installed automatically with Onyx — no extra steps needed.

```tsx
import { CodeBlock } from '@jacshuo/onyx';

{/* Basic syntax highlighting */}
<CodeBlock code={`const x = 42;`} language="typescript" />

{/* With line numbers */}
<CodeBlock code={sourceCode} language="tsx" lineNumbers />

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

### MiniPlayer

```tsx
import { MiniPlayer } from '@jacshuo/onyx';

const tracks = [
  { title: 'Midnight City', artist: 'M83', src: '/audio/midnight.mp3', cover: '/covers/m83.jpg' },
  { title: 'Intro', artist: 'The xx', src: '/audio/intro.mp3' },
];

<MiniPlayer
  playlist={tracks}
  position="bottom-right"
  accent="#8b5cf6"
  shuffle
  autoPlay
/>
```

### CinePlayer

```tsx
import { CinePlayer } from '@jacshuo/onyx';

const videos = [
  { title: 'Big Buck Bunny', src: 'https://example.com/bunny.mp4', subtitle: 'Open source' },
];

<CinePlayer
  playlist={videos}
  accent="#f43f5e"
  onPlayChange={(playing, index) => console.log(playing, index)}
/>
```

### FileExplorer

```tsx
import { FileExplorer, type FileExplorerItem } from '@jacshuo/onyx';

const files: FileExplorerItem[] = [
  { name: 'src', path: '/src', type: 'directory' },
  { name: 'index.ts', path: '/src/index.ts', type: 'file', size: 2048, extension: '.ts' },
];

<FileExplorer
  files={files}
  accent="#10b981"
  dockable
  onFileOpen={(f) => console.log('Open', f.name)}
  onDelete={(items) => console.log('Delete', items)}
/>
```

---

## Keyboard Shortcuts

### FileExplorer
| Key | Action |
|---|---|
| `Click` | Select file |
| `Ctrl+Click` | Multi-select |
| `Ctrl+A` | Select all |
| `Delete` | Delete selected (with confirmation dialog) |
| `Escape` | Clear selection |
| `Double-click` | Open file / Navigate directory |

### CinePlayer
| Key | Action |
|---|---|
| `Space` | Play / Pause |
| `←` / `→` | Seek ±5s |
| `↑` / `↓` | Volume ±5% |
| `F` | Toggle fullscreen |
| `C` | Toggle cinema mode |
| `L` | Toggle playlist |
| `M` | Mute / Unmute |
| `N` | Next track |
| `P` | Previous track |
| `S` | Toggle shuffle |

---

## Development

```bash
# Install dependencies
npm install

# Start demo dev server (http://localhost:8080)
npm run dev

# Production library build (dist/)
npm run dist

# Build demo site (dist-demo/)
npm run build:demo

# Typecheck
npm run typecheck
```

---

## Project Structure

```
OnyxUI/
├── src/
│   ├── components/      # All React components
│   ├── lib/utils.ts     # cn() utility (clsx + tailwind-merge)
│   └── styles/
│       ├── index.css    # Full CSS entry (Tailwind + all tokens + all component CSS)
│       ├── base.css     # Tailwind + core tokens only
│       ├── tokens.css   # @theme semantic tokens & core keyframes
│       ├── theme.ts     # CVA variant definitions
│       └── components/  # Per-component CSS (keyframes & design tokens)
│           ├── CinePlayer.css
│           ├── MiniPlayer.css
│           ├── FileExplorer.css
│           └── FilmReel.css
├── demo/                # Demo site (GitHub Pages)
│   ├── App.tsx
│   ├── main.tsx
│   └── pages/           # Per-component demo pages
├── .github/workflows/
│   ├── ci.yml           # PR/push: typecheck + build
│   └── release.yml      # Manual: version bump → npm → GitHub Release → Pages
├── dist/                # Library build output (ESM + CJS + DTS + CSS)
│   ├── *.js / *.cjs     # Per-component entry points
│   ├── chunks/          # Shared code (auto-extracted by tsup)
│   ├── styles.css       # Full pre-compiled CSS bundle
│   └── styles/          # Modular CSS files
└── dist-demo/           # Demo build output
```

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'feat: add new component'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

### Community & Security

- Contribution guide: [CONTRIBUTING.md](./CONTRIBUTING.md)
- Code of conduct: [CODE_OF_CONDUCT.md](./.github/CODE_OF_CONDUCT.md)
- Security policy: [SECURITY.md](./.github/SECURITY.md)

---

## License

[MIT](./LICENSE) © Shuo Wang
