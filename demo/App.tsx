import { useState, useEffect, useCallback, useMemo, lazy, Suspense } from "react";
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
  Search,
  X,
} from "lucide-react";
import {
  Header,
  SideNav,
  Input,
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
const SplitPanelPage = lazy(() => import("./pages/SplitPanelPage"));
const VirtualListPage = lazy(() => import("./pages/VirtualListPage"));
const RatingPage = lazy(() => import("./pages/RatingPage"));
const KbdPage = lazy(() => import("./pages/KbdPage"));
const OTPInputPage = lazy(() => import("./pages/OTPInputPage"));
const LoginPanelPage = lazy(() => import("./pages/LoginPanelPage"));
const RichTextEditorPage = lazy(() => import("./pages/RichTextEditorPage"));

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
      { label: "Rating", path: "rating" },
      { label: "Kbd", path: "kbd" },
      { label: "OTPInput", path: "otp-input" },
    ],
  },
  {
    label: "Layout",
    icon: <LayoutGrid className="h-4 w-4" />,
    children: [
      { label: "Card", path: "card" },
      { label: "Image Card", path: "image-card" },
      { label: "Panel", path: "panel" },
      { label: "SplitPanel", path: "split-panel" },
    ],
  },
  {
    label: "Data Display",
    icon: <BarChart3 className="h-4 w-4" />,
    children: [
      { label: "Table", path: "table" },
      { label: "List", path: "list" },
      { label: "VirtualList", path: "virtual-list" },
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
      { label: "LoginPanel", path: "login-panel" },
      { label: "Rich Text Editor", path: "rich-text-editor" },
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

/* ── Demo component search index ────────────────────── */

const componentSearchIndex: Record<string, string[]> = {
  button: [
    "click",
    "primary",
    "secondary",
    "danger",
    "ghost",
    "link",
    "loading",
    "icon",
    "size",
    "disabled",
    "variant",
    "intent",
  ],
  badge: ["count", "dot", "status", "notification", "pill", "intent", "color"],
  tag: ["chip", "label", "removable", "close", "intent", "color", "pill"],
  indicator: ["dot", "pulse", "status", "online", "busy", "away", "offline"],
  label: ["form", "text", "required", "optional", "htmlFor"],
  input: [
    "text",
    "password",
    "search",
    "prefix",
    "suffix",
    "clearable",
    "disabled",
    "error",
    "form",
    "field",
  ],
  dropdown: ["select", "menu", "multi", "search", "filterable", "creatable", "group", "option"],
  switch: ["toggle", "on", "off", "boolean", "controlled", "disabled"],
  checkbox: ["checked", "indeterminate", "form", "disabled", "group"],
  radio: ["group", "option", "form", "disabled", "selected"],
  textbox: ["textarea", "multiline", "rows", "resize", "autosize", "form"],
  form: ["validation", "submit", "fieldset", "layout", "control", "label", "error"],
  avatar: ["image", "initials", "fallback", "size", "ring", "status", "group", "stack"],
  slider: ["range", "dual", "thumb", "step", "marks", "tooltip", "vertical"],
  card: ["container", "shadow", "border", "layout", "header", "footer"],
  "image-card": ["photo", "thumbnail", "cover", "aspect", "overlay", "media"],
  panel: ["container", "section", "box", "surface", "padding"],
  "virtual-list": [
    "virtual",
    "list",
    "window",
    "windowing",
    "scroll",
    "performance",
    "large",
    "dataset",
    "infinite",
    "rows",
    "virtualization",
    "recycle",
    "fixed",
    "variable",
    "height",
    "horizontal",
  ],
  "split-panel": [
    "split",
    "pane",
    "resize",
    "divider",
    "desktop",
    "vscode",
    "layout",
    "sidebar",
    "drag",
    "horizontal",
    "vertical",
    "visibility",
    "collapsible",
    "persist",
  ],
  table: ["data", "rows", "columns", "sort", "pagination", "selectable", "striped"],
  list: ["items", "ordered", "unordered", "avatar", "icon", "divider"],
  tree: ["hierarchy", "nested", "expand", "collapse", "folder", "node"],
  chat: ["message", "bubble", "avatar", "timestamp", "thread", "LLM", "AI"],
  "code-block": ["syntax", "highlight", "copy", "shiki", "language", "theme"],
  stat: ["KPI", "metric", "number", "label", "icon", "value"],
  "metric-card": ["KPI", "trend", "delta", "sparkline", "up", "down"],
  header: ["navbar", "top bar", "logo", "brand", "nav", "actions", "mobile"],
  sidenav: ["sidebar", "navigation", "menu", "collapse", "icons", "links"],
  "nav-link": ["link", "active", "router", "anchor", "navigation"],
  breadcrumb: ["path", "trail", "navigation", "separator", "collapse"],
  pagination: ["pages", "next", "prev", "first", "last", "page size", "total"],
  "ribbon-bar": ["toolbar", "office", "tabs", "groups", "buttons", "collapse"],
  accordion: ["expand", "collapse", "panel", "faq", "disclosure"],
  tabs: ["tab", "panel", "switch", "active", "indicator"],
  dialog: ["modal", "popup", "overlay", "confirm", "alert", "close"],
  tooltip: ["hover", "popover", "hint", "placement", "arrow"],
  drawer: ["slide", "panel", "side", "overlay", "bottom sheet", "right", "left"],
  "context-menu": ["right click", "long press", "menu", "actions", "submenu"],
  alert: ["toast", "notification", "success", "error", "warning", "info", "dismiss"],
  toast: ["notification", "snackbar", "position", "duration", "success", "error"],
  "progress-bar": ["loading", "percent", "fill", "indeterminate", "animated"],
  spin: ["loading", "spinner", "circular", "indeterminate"],
  skeleton: ["loading", "placeholder", "pulse", "shimmer", "text", "circle"],
  "film-reel": ["video", "media", "reel", "film", "gallery", "scroll"],
  "mini-player": ["audio", "video", "player", "media", "controls", "compact"],
  "cine-player": ["video", "cinema", "player", "fullscreen", "controls", "media"],
  "file-explorer": ["files", "tree", "folder", "directory", "search", "explorer"],
  masonry: ["grid", "columns", "layout", "responsive", "gallery", "waterfall"],
  "typewriter-text": ["animate", "type", "cursor", "word", "LLM", "AI", "token"],
  "command-palette": ["search", "shortcut", "keyboard", "spotlight", "actions", "Cmd+K"],
  timeline: ["events", "history", "vertical", "horizontal", "date", "step"],
  "date-time-picker": [
    "date",
    "time",
    "picker",
    "calendar",
    "scroll",
    "drum roll",
    "iOS",
    "Android",
    "datetime",
    "month",
    "year",
    "hour",
    "minute",
    "second",
  ],
  rating: ["star", "rate", "review", "score", "half", "precision", "intent", "fill", "icon"],
  kbd: ["keyboard", "shortcut", "key", "symbol", "group", "press", "hotkey", "combo"],
  "otp-input": [
    "one-time",
    "code",
    "verification",
    "pin",
    "digit",
    "slot",
    "paste",
    "mask",
    "alphanumeric",
    "2fa",
    "two-factor",
  ],
  "login-panel": [
    "login",
    "register",
    "auth",
    "authentication",
    "sign in",
    "sign up",
    "otp",
    "forgot",
    "password",
    "social",
    "form",
    "panel",
  ],
  "rich-text-editor": [
    "rich text",
    "editor",
    "wysiwyg",
    "markdown",
    "tiptap",
    "formatting",
    "richtext",
    "toolbar",
    "ribbon",
    "bold",
    "italic",
    "heading",
    "preview",
  ],
  linechart: ["chart", "graph", "line", "trend", "data", "recharts"],
  barchart: ["chart", "graph", "bar", "histogram", "data", "recharts"],
  piechart: ["chart", "graph", "pie", "donut", "slice", "recharts"],
  scatterchart: ["chart", "graph", "scatter", "bubble", "points", "recharts"],
};

/* ── Demo nav search filter ──────────────────────────── */

function filterDemoNavItems(items: SideNavItem[], query: string): SideNavItem[] {
  if (!query.trim()) return items;
  const q = query.toLowerCase();
  return items.reduce<SideNavItem[]>((acc, group) => {
    if (!group.children) return acc;
    const filteredChildren = group.children.filter((child) => {
      if (child.label.toLowerCase().includes(q)) return true;
      const terms = componentSearchIndex[child.path ?? ""] ?? [];
      return terms.some((t) => t.toLowerCase().includes(q));
    });
    if (filteredChildren.length > 0) {
      acc.push({ ...group, children: filteredChildren, defaultOpen: true });
    }
    return acc;
  }, []);
}

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
  const [searchQuery, setSearchQuery] = useState("");
  const filteredNavItems = useMemo(() => filterDemoNavItems(navItems, searchQuery), [searchQuery]);
  const noResults = searchQuery.trim() !== "" && filteredNavItems.length === 0;
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
              className={`hidden md:flex md:flex-col shrink-0 border-r border-primary-200 bg-white dark:border-primary-700 dark:bg-primary-900 transition-all duration-200 ${
                sideNavMode === "expanded"
                  ? "w-48 overflow-y-auto overscroll-y-contain p-3"
                  : sideNavMode === "icons"
                    ? "w-14 overflow-y-auto overscroll-y-contain p-2"
                    : "w-auto p-1"
              }`}
            >
              {sideNavMode === "expanded" && (
                <div className="mb-3 shrink-0">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search components…"
                    prefix={<Search size={14} />}
                    suffix={
                      searchQuery ? (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="flex items-center text-primary-400 hover:text-primary-600 dark:hover:text-primary-300"
                          aria-label="Clear search"
                        >
                          <X size={14} />
                        </button>
                      ) : null
                    }
                    inputSize="sm"
                    className="w-full"
                  />
                </div>
              )}
              {noResults && (
                <p className="px-2 py-4 text-center text-xs text-secondary-500">No results</p>
              )}
              <SideNav
                items={filteredNavItems}
                title={searchQuery ? undefined : "UI Components"}
                basePath="/"
                LinkComponent={RouterLink}
                collapsible
                collapseMode={sideNavMode}
                onCollapseModeChange={setSideNavMode}
                mobileDrawerSlot={
                  <>
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search components…"
                      prefix={<Search size={14} />}
                      suffix={
                        searchQuery ? (
                          <button
                            onClick={() => setSearchQuery("")}
                            className="flex items-center text-primary-400 hover:text-primary-600 dark:hover:text-primary-300"
                            aria-label="Clear search"
                          >
                            <X size={14} />
                          </button>
                        ) : null
                      }
                      inputSize="sm"
                      className="w-full"
                    />
                    {noResults && (
                      <p className="mt-2 text-center text-xs text-secondary-500">No results</p>
                    )}
                  </>
                }
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
                <Route path="/split-panel" element={<SplitPanelPage />} />
                <Route path="/virtual-list" element={<VirtualListPage />} />
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
                <Route path="/rating" element={<RatingPage />} />
                <Route path="/kbd" element={<KbdPage />} />
                <Route path="/otp-input" element={<OTPInputPage />} />
                <Route path="/login-panel" element={<LoginPanelPage />} />
                <Route path="/rich-text-editor" element={<RichTextEditorPage />} />
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
