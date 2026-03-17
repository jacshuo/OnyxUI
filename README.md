<p align="center">
  <img src="https://img.shields.io/npm/v/@jacshuo/onyx?color=8b5cf6&style=flat-square" alt="npm version" />
  <img src="https://img.shields.io/npm/l/@jacshuo/onyx?style=flat-square" alt="license" />
  <img src="https://img.shields.io/github/actions/workflow/status/jacshuo/jac-ui/ci.yml?branch=main&style=flat-square&label=CI" alt="CI" />
  <img src="https://img.shields.io/npm/dm/@jacshuo/onyx?color=10b981&style=flat-square" alt="downloads" />
</p>

# @jacshuo/onyx

A cross-platform **React UI component library** built with Tailwind CSS v4 — designed for web browsers and Electron desktop apps. Ships ESM + CJS bundles with full TypeScript declarations.

Born out of a personal passion for **cross-platform desktop development**, Onyx focuses on delivering a polished, consistent look and feel across Electron and web — the kind of UI toolkit I always wished existed when building desktop apps with web technologies.

> **Live Demo →** [jacshuo.github.io/jac-ui](https://jacshuo.github.io/jac-ui)

---

## Why Onyx?

- **Desktop-first philosophy** — Unlike most React UI libraries that target mobile or generic web, Onyx is crafted with desktop and Electron apps as a first-class concern. Components are optimized for pointer interactions, keyboard navigation, and desktop-sized viewports.
- **Production-ready out of the box** — Dark mode, design tokens, accessibility, and keyboard shortcuts are built in from day one — not bolted on as an afterthought.
- **Minimal footprint, maximum control** — No runtime CSS-in-JS. Just Tailwind CSS v4 utility classes and CSS custom properties. Override any token without ejecting or fighting specificity wars.
- **Rich, specialized components** — Beyond the usual buttons and inputs, Onyx includes `CinePlayer`, `MiniPlayer`, `FileExplorer`, and `DataTable` — components that are hard to find in general-purpose libraries but essential for desktop-class applications.

---

## Features

- 🎨 **30+ components** — from Button → DataTable → CinePlayer
- 🌗 **Dark / Light mode** — class-based, works out of the box
- 🎯 **CSS variable design tokens** — override any color via `--cp-*`, `--mp-*`, `--fe-*` custom properties
- ⚡ **Tailwind CSS v4** — zero config, `@theme` tokens, `color-mix()` accent support
- 📦 **Tree-shakeable** — ESM + CJS dual output, `sideEffects: ["*.css"]`
- 🖥️ **Cross-platform** — built for web & Electron desktop apps
- ⌨️ **Keyboard-first** — comprehensive keyboard shortcuts for CinePlayer, FileExplorer, and more
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

### Navigation

| Component | Description |
|---|---|
| **SideNav** | Collapsible sidebar with icons, sections, and multiple collapse modes |
| **Header** | App header with nav items and action buttons |
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
  <!-- all jac-ui components render in dark mode -->
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

## Release Process

Releases are fully automated via GitHub Actions:

1. Go to **Actions → Release → Run workflow**
2. Choose version bump: `patch` / `minor` / `major`
3. The pipeline will:
   - Bump `package.json` version
   - Commit & tag (e.g. `v0.2.0`)
   - Build & publish to **npm**
   - Create a **GitHub Release** with `.tar.gz` and `.zip` download artifacts
   - Build & deploy the **demo site** to GitHub Pages

### Required Secrets

| Secret | Where | Description |
|---|---|---|
| `NPM_TOKEN` | GitHub repo → Settings → Secrets | npm access token with publish permission |

### GitHub Pages Setup

1. Go to **Settings → Pages**
2. Source: **GitHub Actions**

---

## Project Structure

```
jac-ui/
├── src/
│   ├── components/      # All React components
│   ├── lib/utils.ts     # cn() utility (clsx + tailwind-merge)
│   └── styles/
│       ├── theme.css    # Tailwind theme, keyframes, CSS custom properties
│       └── theme.ts     # CVA variant definitions
├── demo/                # Demo site (GitHub Pages)
│   ├── App.tsx
│   ├── main.tsx
│   └── pages/           # Per-component demo pages
├── .github/workflows/
│   ├── ci.yml           # PR/push: typecheck + build
│   └── release.yml      # Manual: version bump → npm → GitHub Release → Pages
├── dist/                # Library build output
└── dist-demo/           # Demo build output
```

---

## Roadmap

### Responsiveness & Mobile Support

> **Current status: not supported**

Onyx is a **desktop-first** library. All components are currently designed for desktop-sized viewports and pointer-based interactions. Responsive / mobile layouts are **not yet available**.

This is a personal side project, and my day job keeps me quite busy. My primary interest lies in **cross-platform desktop application development** (Electron + web), which is where I spend most of my limited spare time. As a result, responsive design and mobile device support have not been prioritized — and there is **no concrete timeline** for adding them.

That said, responsiveness is absolutely a worthwhile direction. If this is something you need, **pull requests are very welcome!** The rough areas that would benefit from community contributions include:

- **Fluid layouts** — Making `Card`, `DataTable`, `Dialog`, etc. adapt to narrow viewports via container queries or relative units.
- **Responsive typography** — Auto-scaling font sizes and spacing based on viewport width.
- **Touch-friendly interactions** — Larger tap targets, swipe gestures for `CinePlayer` / `MiniPlayer`, touch-optimized drag handles.
- **Adaptive component variants** — `DataTable` → card list on mobile, `SideNav` → slide-over drawer, `Header` → hamburger menu.
- **Breakpoint-aware props** — e.g., `<Button size={{ base: 'sm', md: 'lg' }}>` aligned with Tailwind CSS v4 breakpoints.
- **Mobile-first CSS refactor** — Layering complexity at wider breakpoints instead of overriding desktop defaults.

If you're interested in contributing any of these, check out the [Contributing](#contributing) section — I'd love the help! 🙌

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'feat: add new component'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## License

[MIT](./LICENSE) © Shuo Wang
