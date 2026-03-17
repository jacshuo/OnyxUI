import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { Sun, Moon, Github, Box, LayoutGrid, BarChart3, Compass, Layers, Square, Bell, Clapperboard } from 'lucide-react';
import { SideNav, type SideNavItem, type SideNavLinkComponentProps, type SideNavCollapseMode } from '../src';

import ButtonPage from './pages/ButtonPage';
import BadgePage from './pages/BadgePage';
import LabelPage from './pages/LabelPage';
import InputPage from './pages/InputPage';
import DropdownPage from './pages/DropdownPage';
import CardPage from './pages/CardPage';
import ImageCardPage from './pages/ImageCardPage';
import PanelPage from './pages/PanelPage';
import TablePage from './pages/TablePage';
import ListPage from './pages/ListPage';
import TreePage from './pages/TreePage';
import ChatPage from './pages/ChatPage';
import SideNavPage from './pages/SideNavPage';
import AccordionPage from './pages/AccordionPage';
import TabsPage from './pages/TabsPage';
import DialogPage from './pages/DialogPage';
import TooltipPage from './pages/TooltipPage';
import AlertPage from './pages/AlertPage';
import HeaderPage from './pages/HeaderPage';
import FilmReelPage from './pages/FilmReelPage';
import MiniPlayerPage from './pages/MiniPlayerPage';
import CinePlayerPage from './pages/CinePlayerPage';
import FileExplorerPage from './pages/FileExplorerPage';

/* ── Sidebar nav items ───────────────────────────────── */

const navItems: SideNavItem[] = [
  {
    label: 'Primitives',
    icon: <Box className="h-4 w-4" />,
    children: [
      { label: 'Button', path: 'button' },
      { label: 'Badge', path: 'badge' },
      { label: 'Label', path: 'label' },
      { label: 'Input', path: 'input' },
      { label: 'Dropdown', path: 'dropdown' },
    ],
  },
  {
    label: 'Layout',
    icon: <LayoutGrid className="h-4 w-4" />,
    children: [
      { label: 'Card', path: 'card' },
      { label: 'Image Card', path: 'image-card' },
      { label: 'Panel', path: 'panel' },
    ],
  },
  {
    label: 'Data Display',
    icon: <BarChart3 className="h-4 w-4" />,
    children: [
      { label: 'Table', path: 'table' },
      { label: 'List', path: 'list' },
      { label: 'Tree', path: 'tree' },
      { label: 'Chat', path: 'chat' },
    ],
  },
  {
    label: 'Navigation',
    icon: <Compass className="h-4 w-4" />,
    children: [
      { label: 'Header', path: 'header' },
      { label: 'SideNav', path: 'sidenav' },
    ],
  },
  {
    label: 'Disclosure',
    icon: <Layers className="h-4 w-4" />,
    children: [
      { label: 'Accordion', path: 'accordion' },
      { label: 'Tabs', path: 'tabs' },
    ],
  },
  {
    label: 'Overlay',
    icon: <Square className="h-4 w-4" />,
    children: [
      { label: 'Dialog', path: 'dialog' },
      { label: 'Tooltip', path: 'tooltip' },
    ],
  },
  {
    label: 'Feedback',
    icon: <Bell className="h-4 w-4" />,
    children: [
      { label: 'Alert / Toast', path: 'alert' },
    ],
  },
  {
    label: 'Extras',
    icon: <Clapperboard className="h-4 w-4" />,
    children: [
      { label: 'FilmReel', path: 'film-reel' },
      { label: 'MiniPlayer', path: 'mini-player' },
      { label: 'CinePlayer', path: 'cine-player' },
      { label: 'FileExplorer', path: 'file-explorer' },
    ],
  },
];

/* ── NavLink adapter for SideNav ─────────────────────── */

function RouterLink({ to, className, style, children }: SideNavLinkComponentProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        typeof className === 'function' ? className({ isActive }) : className
      }
      style={style}
    >
      {children}
    </NavLink>
  );
}

/* ── Theme toggle ────────────────────────────────────── */

function useTheme() {
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('jac-ui-theme') === 'dark';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('jac-ui-theme', dark ? 'dark' : 'light');
  }, [dark]);

  const toggle = useCallback(() => setDark((d) => !d), []);
  return { dark, toggle };
}

/* ── App Shell ───────────────────────────────────────── */

export default function App() {
  const { dark, toggle } = useTheme();
  const [sideNavMode, setSideNavMode] = useState<SideNavCollapseMode>('expanded');

  return (
    <div className="flex h-screen flex-col">
      {/* ── Top bar ──────────────────────── */}
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-primary-200 bg-white px-5 dark:border-primary-700 dark:bg-primary-900">
        <div className="flex items-center gap-6">
          <span className="text-lg font-bold text-primary-800 dark:text-primary-100">
            @jacshuo/onyx
          </span>
          <nav className="flex items-center gap-4 text-sm">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? 'text-primary-900 font-medium dark:text-primary-100'
                  : 'text-primary-500 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-200'
              }
            >
              Home
            </NavLink>
            <a
              href="https://github.com/jacshuo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-500 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-200 flex items-center gap-1"
            >
              <Github className="h-4 w-4" /> About
            </a>
          </nav>
        </div>
        <button
          type="button"
          onClick={toggle}
          className="rounded-md p-1.5 text-primary-500 hover:bg-primary-100 hover:text-primary-700 dark:text-primary-400 dark:hover:bg-primary-800 dark:hover:text-primary-200"
          aria-label="Toggle theme"
        >
          {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Sidebar ────────────────────── */}
        <aside
          className={`shrink-0 border-r border-primary-200 bg-white dark:border-primary-700 dark:bg-primary-900 transition-all duration-200 ${
            sideNavMode === 'expanded'
              ? 'w-48 overflow-y-auto p-3'
              : sideNavMode === 'icons'
                ? 'w-14 overflow-y-auto p-2'
                : 'w-auto p-1'
          }`}
        >
          <SideNav
            items={navItems}
            title="UI Components"
            basePath="/"
            LinkComponent={RouterLink}
            collapsible
            collapseMode={sideNavMode}
            onCollapseModeChange={setSideNavMode}
          />
        </aside>

        {/* ── Content ────────────────────── */}
        <main className="flex-1 overflow-y-auto p-8">
          <Routes>
            <Route path="/" element={<Navigate to="/button" replace />} />
            <Route path="/button" element={<ButtonPage />} />
            <Route path="/badge" element={<BadgePage />} />
            <Route path="/label" element={<LabelPage />} />
            <Route path="/input" element={<InputPage />} />
            <Route path="/dropdown" element={<DropdownPage />} />
            <Route path="/card" element={<CardPage />} />
            <Route path="/image-card" element={<ImageCardPage />} />
            <Route path="/panel" element={<PanelPage />} />
            <Route path="/table" element={<TablePage />} />
            <Route path="/list" element={<ListPage />} />
            <Route path="/tree" element={<TreePage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/header" element={<HeaderPage />} />
            <Route path="/sidenav" element={<SideNavPage />} />
            <Route path="/accordion" element={<AccordionPage />} />
            <Route path="/tabs" element={<TabsPage />} />
            <Route path="/dialog" element={<DialogPage />} />
            <Route path="/tooltip" element={<TooltipPage />} />
            <Route path="/alert" element={<AlertPage />} />
            <Route path="/film-reel" element={<FilmReelPage />} />
            <Route path="/mini-player" element={<MiniPlayerPage />} />
            <Route path="/cine-player" element={<CinePlayerPage />} />
            <Route path="/file-explorer" element={<FileExplorerPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
