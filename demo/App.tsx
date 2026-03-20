import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import { siGithub } from "simple-icons";
import {
  Sun,
  Moon,
  Box,
  LayoutGrid,
  BarChart3,
  Compass,
  Layers,
  Square,
  Bell,
  Clapperboard,
  Gem,
} from "lucide-react";
import {
  Header,
  SideNav,
  type SideNavItem,
  type SideNavLinkComponentProps,
  type SideNavCollapseMode,
} from "../src";
import pkg from "../package.json";

const ButtonPage = lazy(() => import("./pages/ButtonPage"));
const BadgePage = lazy(() => import("./pages/BadgePage"));
const IndicatorPage = lazy(() => import("./pages/IndicatorPage"));
const LabelPage = lazy(() => import("./pages/LabelPage"));
const InputPage = lazy(() => import("./pages/InputPage"));
const DropdownPage = lazy(() => import("./pages/DropdownPage"));
const CardPage = lazy(() => import("./pages/CardPage"));
const ImageCardPage = lazy(() => import("./pages/ImageCardPage"));
const PanelPage = lazy(() => import("./pages/PanelPage"));
const TablePage = lazy(() => import("./pages/TablePage"));
const ListPage = lazy(() => import("./pages/ListPage"));
const TreePage = lazy(() => import("./pages/TreePage"));
const ChatPage = lazy(() => import("./pages/ChatPage"));
const SideNavPage = lazy(() => import("./pages/SideNavPage"));
const AccordionPage = lazy(() => import("./pages/AccordionPage"));
const TabsPage = lazy(() => import("./pages/TabsPage"));
const DialogPage = lazy(() => import("./pages/DialogPage"));
const TooltipPage = lazy(() => import("./pages/TooltipPage"));
const AlertPage = lazy(() => import("./pages/AlertPage"));
const HeaderPage = lazy(() => import("./pages/HeaderPage"));
const NavLinkPage = lazy(() => import("./pages/NavLinkPage"));
const FilmReelPage = lazy(() => import("./pages/FilmReelPage"));
const MiniPlayerPage = lazy(() => import("./pages/MiniPlayerPage"));
const CinePlayerPage = lazy(() => import("./pages/CinePlayerPage"));
const FileExplorerPage = lazy(() => import("./pages/FileExplorerPage"));
const CodeBlockPage = lazy(() => import("./pages/CodeBlockPage"));
const ProgressBarPage = lazy(() => import("./pages/ProgressBarPage"));
const SpinPage = lazy(() => import("./pages/SpinPage"));
const SwitchPage = lazy(() => import("./pages/SwitchPage"));
const CheckboxPage = lazy(() => import("./pages/CheckboxPage"));
const RadioPage = lazy(() => import("./pages/RadioPage"));
const TextBoxPage = lazy(() => import("./pages/TextBoxPage"));
const MasonryPage = lazy(() => import("./pages/MasonryPage"));
const FormPage = lazy(() => import("./pages/FormPage"));

/* ── Sidebar nav items ───────────────────────────────── */

const navItems: SideNavItem[] = [
  {
    label: "Primitives",
    icon: <Box className="h-4 w-4" />,
    children: [
      { label: "Button", path: "button" },
      { label: "Badge", path: "badge" },
      { label: "Indicator", path: "indicator" },
      { label: "Label", path: "label" },
      { label: "Input", path: "input" },
      { label: "Dropdown", path: "dropdown" },
      { label: "Switch", path: "switch" },
      { label: "Checkbox", path: "checkbox" },
      { label: "Radio", path: "radio" },
      { label: "TextBox", path: "textbox" },
      { label: "Form", path: "form" },
    ],
  },
  {
    label: "Layout",
    icon: <LayoutGrid className="h-4 w-4" />,
    children: [
      { label: "Card", path: "card" },
      { label: "Image Card", path: "image-card" },
      { label: "Panel", path: "panel" },
    ],
  },
  {
    label: "Data Display",
    icon: <BarChart3 className="h-4 w-4" />,
    children: [
      { label: "Table", path: "table" },
      { label: "List", path: "list" },
      { label: "Tree", path: "tree" },
      { label: "Chat", path: "chat" },
      { label: "CodeBlock", path: "code-block" },
    ],
  },
  {
    label: "Navigation",
    icon: <Compass className="h-4 w-4" />,
    children: [
      { label: "Header", path: "header" },
      { label: "SideNav", path: "sidenav" },
      { label: "NavLink", path: "nav-link" },
    ],
  },
  {
    label: "Disclosure",
    icon: <Layers className="h-4 w-4" />,
    children: [
      { label: "Accordion", path: "accordion" },
      { label: "Tabs", path: "tabs" },
    ],
  },
  {
    label: "Overlay",
    icon: <Square className="h-4 w-4" />,
    children: [
      { label: "Dialog", path: "dialog" },
      { label: "Tooltip", path: "tooltip" },
    ],
  },
  {
    label: "Feedback",
    icon: <Bell className="h-4 w-4" />,
    children: [
      { label: "Alert / Toast", path: "alert" },
      { label: "ProgressBar", path: "progress-bar" },
      { label: "Spin", path: "spin" },
    ],
  },
  {
    label: "Extras",
    icon: <Clapperboard className="h-4 w-4" />,
    children: [
      { label: "FilmReel", path: "film-reel" },
      { label: "MiniPlayer", path: "mini-player" },
      { label: "CinePlayer", path: "cine-player" },
      { label: "FileExplorer", path: "file-explorer" },
      { label: "Masonry", path: "masonry" },
    ],
  },
];

/* ── NavLink adapter for SideNav ─────────────────────── */

function RouterLink({ to, className, style, children }: SideNavLinkComponentProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        typeof className === "function" ? className({ isActive }) : className
      }
      style={style}
    >
      {children}
    </NavLink>
  );
}

/* ── NavLink adapter for Header ──────────────────────── */

function HeaderLink({
  href,
  className,
  onClick,
  children,
}: {
  href: string;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  children: React.ReactNode;
}) {
  return (
    <NavLink to={href} className={className} onClick={onClick} end>
      {children}
    </NavLink>
  );
}

/* ── Theme toggle ────────────────────────────────────── */

function useTheme() {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("jac-ui-theme") === "dark";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("jac-ui-theme", dark ? "dark" : "light");
  }, [dark]);

  const toggle = useCallback(() => setDark((d) => !d), []);
  return { dark, toggle };
}

/* ── App Shell ───────────────────────────────────────── */

export default function App() {
  const { dark, toggle } = useTheme();
  const [sideNavMode, setSideNavMode] = useState<SideNavCollapseMode>("expanded");

  return (
    <div className="flex h-screen flex-col">
      {/* ── Top bar ──────────────────────── */}
      <Header
        brand={
          <span className="flex items-center gap-2">
            <Gem className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            <span>@jacshuo/onyx</span>
            <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs font-normal text-primary-500 dark:bg-primary-800 dark:text-primary-400">
              v{pkg.version}
            </span>
          </span>
        }
        navItems={[{ label: "Home", href: "/" }]}
        actions={[
          {
            key: "github",
            icon: (
              <svg role="img" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d={siGithub.path} />
              </svg>
            ),
            "aria-label": "GitHub",
            href: "https://github.com/jacshuo",
            external: true,
          },
          {
            key: "theme",
            icon: dark ? <Sun /> : <Moon />,
            "aria-label": "Toggle theme",
            onClick: toggle,
          },
        ]}
        linkComponent={HeaderLink}
        mobileMenu
      />

      <div className="flex flex-1 overflow-hidden">
        {/* ── Sidebar ────────────────────── */}
        <aside
          className={`hidden md:block shrink-0 border-r border-primary-200 bg-white dark:border-primary-700 dark:bg-primary-900 transition-all duration-200 ${
            sideNavMode === "expanded"
              ? "w-48 overflow-y-auto overscroll-y-contain p-3"
              : sideNavMode === "icons"
                ? "w-14 overflow-y-auto overscroll-y-contain p-2"
                : "w-auto p-1"
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
        <main className="flex-1 overflow-y-auto overscroll-y-contain p-4 pb-20 sm:p-6 sm:pb-20 md:p-8">
          <Suspense
            fallback={
              <div className="flex h-40 items-center justify-center text-primary-400 text-sm">
                Loading…
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Navigate to="/button" replace />} />
              <Route path="/button" element={<ButtonPage />} />
              <Route path="/badge" element={<BadgePage />} />
              <Route path="/indicator" element={<IndicatorPage />} />
              <Route path="/label" element={<LabelPage />} />
              <Route path="/input" element={<InputPage />} />
              <Route path="/dropdown" element={<DropdownPage />} />
              <Route path="/switch" element={<SwitchPage />} />
              <Route path="/checkbox" element={<CheckboxPage />} />
              <Route path="/radio" element={<RadioPage />} />
              <Route path="/textbox" element={<TextBoxPage />} />
              <Route path="/card" element={<CardPage />} />
              <Route path="/image-card" element={<ImageCardPage />} />
              <Route path="/panel" element={<PanelPage />} />
              <Route path="/table" element={<TablePage />} />
              <Route path="/list" element={<ListPage />} />
              <Route path="/tree" element={<TreePage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/code-block" element={<CodeBlockPage />} />
              <Route path="/header" element={<HeaderPage />} />
              <Route path="/sidenav" element={<SideNavPage />} />
              <Route path="/nav-link" element={<NavLinkPage />} />
              <Route path="/accordion" element={<AccordionPage />} />
              <Route path="/tabs" element={<TabsPage />} />
              <Route path="/dialog" element={<DialogPage />} />
              <Route path="/tooltip" element={<TooltipPage />} />
              <Route path="/alert" element={<AlertPage />} />
              <Route path="/progress-bar" element={<ProgressBarPage />} />
              <Route path="/spin" element={<SpinPage />} />
              <Route path="/film-reel" element={<FilmReelPage />} />
              <Route path="/mini-player" element={<MiniPlayerPage />} />
              <Route path="/cine-player" element={<CinePlayerPage />} />
              <Route path="/file-explorer" element={<FileExplorerPage />} />
              <Route path="/masonry" element={<MasonryPage />} />
              <Route path="/form" element={<FormPage />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  );
}
