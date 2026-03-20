import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { Routes, Route, NavLink, Navigate, useLocation } from "react-router-dom";
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
const DocsLayout = lazy(() => import("./pages/docs/DocsLayout"));

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

/* ── iOS visual-viewport height fix ─────────────────── */
/**
 * On iOS Safari, `100vh` equals the *layout* viewport and never updates when
 * the virtual keyboard opens. When the keyboard closes, iOS leaves <main>'s
 * scrollTop at whatever value it set while the keyboard was open, producing
 * apparent white-space at the bottom of the page.
 *
 * Strategy:
 *  1. Set `--app-height` once and only grow it (keyboard open never shrinks it,
 *     so no gap appears between content and keyboard).
 *  2. On `focusin` for any form field, capture <main>.scrollTop BEFORE iOS
 *     auto-scrolls to bring the input into view.
 *  3. On `focusout` (with a short debounce to skip focus moving between inputs),
 *     restore that scroll position so the page snaps back cleanly.
 * This avoids relying on window.innerHeight vs visualViewport.height comparison,
 * which breaks on iOS≤14 where both shrink together when the keyboard opens.
 */
function useVisualViewportHeight() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const getMain = () => document.querySelector<HTMLElement>("main");
    let savedScrollTop: number | null = null;
    let dismissTimer: ReturnType<typeof setTimeout> | null = null;

    // Set initial height
    document.documentElement.style.setProperty(
      "--app-height",
      `${window.visualViewport?.height ?? window.innerHeight}px`,
    );

    // Only grow --app-height (desktop resize, landscape→portrait).
    // Never shrink: keeps the container full-height when keyboard opens.
    const onResize = () => {
      const next = window.visualViewport?.height ?? window.innerHeight;
      const cur = parseFloat(
        document.documentElement.style.getPropertyValue("--app-height") || "0",
      );
      if (next > cur || cur === 0) {
        document.documentElement.style.setProperty("--app-height", `${next}px`);
      }
    };

    const isFormField = (el: Element | null): boolean => {
      const t = el?.tagName?.toUpperCase();
      return t === "INPUT" || t === "TEXTAREA" || t === "SELECT";
    };

    // Save <main>.scrollTop the moment any input is focused — this is BEFORE
    // iOS auto-scrolls to bring the input above the keyboard.
    const onFocusIn = (e: FocusEvent) => {
      if (!isFormField(e.target as Element)) return;
      if (dismissTimer !== null) {
        clearTimeout(dismissTimer);
        dismissTimer = null;
      }
      // Keep the FIRST saved value (pre-keyboard); don't overwrite mid-session.
      if (savedScrollTop === null) {
        savedScrollTop = getMain()?.scrollTop ?? 0;
      }
    };

    // When focus leaves a form field, debounce to distinguish "keyboard closed"
    // from "focus moved to the next input".
    const onFocusOut = (e: FocusEvent) => {
      if (!isFormField(e.target as Element)) return;
      dismissTimer = setTimeout(() => {
        dismissTimer = null;
        // Still focused on another input → keyboard is still open, do nothing.
        if (isFormField(document.activeElement)) return;
        // Keyboard dismissed — restore pre-keyboard scroll.
        window.scrollTo(0, 0); // reset any stray iOS window-level scroll
        const top = savedScrollTop;
        savedScrollTop = null;
        if (top !== null) {
          requestAnimationFrame(() => {
            const main = getMain();
            if (main) main.scrollTop = top;
          });
        }
      }, 150);
    };

    const onOrientationChange = () => {
      savedScrollTop = null;
      if (dismissTimer !== null) {
        clearTimeout(dismissTimer);
        dismissTimer = null;
      }
      // Always reset after rotation (portrait↔landscape both directions).
      setTimeout(() => {
        document.documentElement.style.setProperty(
          "--app-height",
          `${window.visualViewport?.height ?? window.innerHeight}px`,
        );
      }, 300);
    };

    window.visualViewport?.addEventListener("resize", onResize);
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onOrientationChange);
    document.addEventListener("focusin", onFocusIn as EventListener);
    document.addEventListener("focusout", onFocusOut as EventListener);

    return () => {
      window.visualViewport?.removeEventListener("resize", onResize);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onOrientationChange);
      document.removeEventListener("focusin", onFocusIn as EventListener);
      document.removeEventListener("focusout", onFocusOut as EventListener);
      if (dismissTimer !== null) clearTimeout(dismissTimer);
    };
  }, []);
}

/* ── App Shell ───────────────────────────────────────── */

export default function App() {
  useVisualViewportHeight();
  const { dark, toggle } = useTheme();
  const [sideNavMode, setSideNavMode] = useState<SideNavCollapseMode>("expanded");
  const location = useLocation();
  const isDocsPage = location.pathname.startsWith("/docs");

  return (
    <div className="flex flex-col" style={{ height: "var(--app-height, 100svh)" }}>
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
        navItems={[
          { label: "Home", href: "/" },
          { label: "Docs", href: "/docs" },
        ]}
        actions={[
          {
            key: "github",
            icon: (
              <svg role="img" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d={siGithub.path} />
              </svg>
            ),
            ariaLabel: "GitHub",
            href: "https://github.com/jacshuo",
            external: true,
          },
          {
            key: "theme",
            icon: dark ? <Sun /> : <Moon />,
            ariaLabel: "Toggle theme",
            onClick: toggle,
          },
        ]}
        linkComponent={HeaderLink}
        mobileMenu
      />

      <div className="flex flex-1 overflow-hidden">
        {/* ── Sidebar ────────────────────── */}
        {!isDocsPage && (
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
        )}

        {/* ── Content ────────────────────── */}
        <main
          className={`flex-1 overflow-hidden ${
            isDocsPage
              ? ""
              : "overflow-y-auto overscroll-y-contain p-4 pb-20 sm:p-6 sm:pb-20 md:p-8"
          }`}
        >
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
              <Route path="/docs" element={<Navigate to="/docs/button" replace />} />
              <Route path="/docs/*" element={<DocsLayout />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  );
}
