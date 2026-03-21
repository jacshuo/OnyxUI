import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { Routes, Route, NavLink, Navigate, useLocation, useNavigate } from "react-router-dom";
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
  ToastProvider,
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
const TypewriterTextPage = lazy(() => import("./pages/TypewriterTextPage"));
const CodeBlockPage = lazy(() => import("./pages/CodeBlockPage"));
const ProgressBarPage = lazy(() => import("./pages/ProgressBarPage"));
const SpinPage = lazy(() => import("./pages/SpinPage"));
const SkeletonPage = lazy(() => import("./pages/SkeletonPage"));
const SwitchPage = lazy(() => import("./pages/SwitchPage"));
const CheckboxPage = lazy(() => import("./pages/CheckboxPage"));
const RadioPage = lazy(() => import("./pages/RadioPage"));
const TextBoxPage = lazy(() => import("./pages/TextBoxPage"));
const MasonryPage = lazy(() => import("./pages/MasonryPage"));
const FormPage = lazy(() => import("./pages/FormPage"));
const ToastPage = lazy(() => import("./pages/ToastPage"));
const CommandPalettePage = lazy(() => import("./pages/CommandPalettePage"));
const AvatarPage = lazy(() => import("./pages/AvatarPage"));
const BreadcrumbPage = lazy(() => import("./pages/BreadcrumbPage"));
const PaginationPage = lazy(() => import("./pages/PaginationPage"));
const SliderPage = lazy(() => import("./pages/SliderPage"));
const DrawerPage = lazy(() => import("./pages/DrawerPage"));
const DocsLayout = lazy(() => import("./pages/docs/DocsLayout"));
const LineChartPage = lazy(() => import("./pages/LineChartPage"));
const BarChartPage = lazy(() => import("./pages/BarChartPage"));
const PieChartPage = lazy(() => import("./pages/PieChartPage"));
const ScatterChartPage = lazy(() => import("./pages/ScatterChartPage"));
const TagPage = lazy(() => import("./pages/TagPage"));
const StatPage = lazy(() => import("./pages/StatPage"));
const MetricCardPage = lazy(() => import("./pages/MetricCardPage"));
const TimelinePage = lazy(() => import("./pages/TimelinePage"));
const ContextMenuPage = lazy(() => import("./pages/ContextMenuPage"));
const RibbonBarPage = lazy(() => import("./pages/RibbonBarPage"));
const DateTimePickerPage = lazy(() => import("./pages/DateTimePickerPage"));

/* ── Sidebar nav items ───────────────────────────────── */

const navItems: SideNavItem[] = [
  {
    label: "Primitives",
    icon: <Box className="h-4 w-4" />,
    children: [
      { label: "Button", path: "button" },
      { label: "Badge", path: "badge" },
      { label: "Tag / Chip", path: "tag" },
      { label: "Indicator", path: "indicator" },
      { label: "Label", path: "label" },
      { label: "Input", path: "input" },
      { label: "Dropdown", path: "dropdown" },
      { label: "Switch", path: "switch" },
      { label: "Checkbox", path: "checkbox" },
      { label: "Radio", path: "radio" },
      { label: "TextBox", path: "textbox" },
      { label: "Form", path: "form" },
      { label: "Avatar", path: "avatar" },
      { label: "Slider", path: "slider" },
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
      { label: "Stat", path: "stat" },
      { label: "MetricCard", path: "metric-card" },
    ],
  },
  {
    label: "Navigation",
    icon: <Compass className="h-4 w-4" />,
    children: [
      { label: "Header", path: "header" },
      { label: "SideNav", path: "sidenav" },
      { label: "NavLink", path: "nav-link" },
      { label: "Breadcrumb", path: "breadcrumb" },
      { label: "Pagination", path: "pagination" },
      { label: "RibbonBar", path: "ribbon-bar" },
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
      { label: "Drawer", path: "drawer" },
      { label: "ContextMenu", path: "context-menu" },
    ],
  },
  {
    label: "Feedback",
    icon: <Bell className="h-4 w-4" />,
    children: [
      { label: "Alert / Toast", path: "alert" },
      { label: "Toast", path: "toast" },
      { label: "ProgressBar", path: "progress-bar" },
      { label: "Spin", path: "spin" },
      { label: "Skeleton", path: "skeleton" },
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
      { label: "TypewriterText", path: "typewriter-text" },
      { label: "CommandPalette", path: "command-palette" },
      { label: "Timeline", path: "timeline" },
      { label: "DateTimePicker", path: "date-time-picker" },
    ],
  },
  {
    label: "Chart",
    icon: <BarChart3 className="h-4 w-4" />,
    children: [
      { label: "LineChart", path: "linechart" },
      { label: "BarChart", path: "barchart" },
      { label: "PieChart", path: "piechart" },
      { label: "ScatterChart", path: "scatterchart" },
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

/* ── iOS keyboard fix ───────────────────────────────── */
/**
 * On iOS Safari/Chrome, focusing an input inside a <form> causes the browser
 * to scroll the *window* (document level) to bring the input into view.
 * This produces a visible dark gap below the app content.
 *
 * Fix: the app shell uses `position: fixed; inset: 0` so it's completely
 * immune to document-level scrolling.  As a safety net, we also listen for
 * any stray window scroll and immediately reset it to (0,0).
 *
 * Scrolling within <main> (overflow-y: auto) still works normally — iOS
 * identifies <main> as the scroll container and scrolls within it to bring
 * the focused input above the keyboard.
 */
function useIOSKeyboardFix() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const resetScroll = () => {
      if (window.scrollY !== 0 || window.scrollX !== 0) {
        window.scrollTo(0, 0);
      }
    };

    // visualViewport 'scroll' fires when iOS shifts the viewport origin.
    window.visualViewport?.addEventListener("scroll", resetScroll);
    window.addEventListener("scroll", resetScroll);

    return () => {
      window.visualViewport?.removeEventListener("scroll", resetScroll);
      window.removeEventListener("scroll", resetScroll);
    };
  }, []);
}

/* ── App Shell ───────────────────────────────────────── */

export default function App() {
  useIOSKeyboardFix();
  const { dark, toggle } = useTheme();
  const [sideNavMode, setSideNavMode] = useState<SideNavCollapseMode>("expanded");
  const location = useLocation();
  const navigate = useNavigate();
  const isDocsPage = location.pathname.startsWith("/docs");

  return (
    <ToastProvider defaultPosition="top-right">
      <div className="fixed inset-0 flex flex-col">
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
            {
              label: "Home",
              href: "/",
              onClick: (e) => {
                e.preventDefault();
                navigate("/");
              },
            },
            {
              label: "Docs",
              href: "/docs/button",
              onClick: (e) => {
                e.preventDefault();
                navigate("/docs/button");
              },
            },
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
                <Route path="/toast" element={<ToastPage />} />
                <Route path="/progress-bar" element={<ProgressBarPage />} />
                <Route path="/spin" element={<SpinPage />} />
                <Route path="/skeleton" element={<SkeletonPage />} />
                <Route path="/film-reel" element={<FilmReelPage />} />
                <Route path="/mini-player" element={<MiniPlayerPage />} />
                <Route path="/cine-player" element={<CinePlayerPage />} />
                <Route path="/file-explorer" element={<FileExplorerPage />} />
                <Route path="/masonry" element={<MasonryPage />} />
                <Route path="/typewriter-text" element={<TypewriterTextPage />} />
                <Route path="/command-palette" element={<CommandPalettePage />} />
                <Route path="/form" element={<FormPage />} />
                <Route path="/linechart" element={<LineChartPage />} />
                <Route path="/barchart" element={<BarChartPage />} />
                <Route path="/piechart" element={<PieChartPage />} />
                <Route path="/scatterchart" element={<ScatterChartPage />} />
                <Route path="/forms/select" element={<Navigate to="/dropdown" replace />} />
                <Route path="/avatar" element={<AvatarPage />} />
                <Route path="/slider" element={<SliderPage />} />
                <Route path="/breadcrumb" element={<BreadcrumbPage />} />
                <Route path="/pagination" element={<PaginationPage />} />
                <Route path="/drawer" element={<DrawerPage />} />
                <Route path="/select" element={<Navigate to="/dropdown" replace />} />
                <Route path="/tag" element={<TagPage />} />
                <Route path="/stat" element={<StatPage />} />
                <Route path="/metric-card" element={<MetricCardPage />} />
                <Route path="/timeline" element={<TimelinePage />} />
                <Route path="/context-menu" element={<ContextMenuPage />} />
                <Route path="/ribbon-bar" element={<RibbonBarPage />} />
                <Route path="/date-time-picker" element={<DateTimePickerPage />} />
                <Route path="/docs" element={<Navigate to="/docs/button" replace />} />
                <Route path="/docs/*" element={<DocsLayout />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
