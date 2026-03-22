import { lazy, Suspense, useState, useMemo } from "react";
import { Routes, Route, Navigate, NavLink } from "react-router-dom";
import {
  Search,
  X,
  Box,
  LayoutGrid,
  BarChart3,
  Compass,
  Layers,
  Square,
  Bell,
  Clapperboard,
  TrendingUp,
} from "lucide-react";
import { Input, SideNav, type SideNavItem, type SideNavLinkComponentProps } from "../../../src";

/* ── Lazy doc pages ───────────────────────────────────── */

const ButtonDoc = lazy(() => import("./ButtonDoc"));
const BadgeDoc = lazy(() => import("./BadgeDoc"));
const IndicatorDoc = lazy(() => import("./IndicatorDoc"));
const LabelDoc = lazy(() => import("./LabelDoc"));
const InputDoc = lazy(() => import("./InputDoc"));
const TextBoxDoc = lazy(() => import("./TextBoxDoc"));
const CheckboxDoc = lazy(() => import("./CheckboxDoc"));
const RadioDoc = lazy(() => import("./RadioDoc"));
const SwitchDoc = lazy(() => import("./SwitchDoc"));
const DropdownDoc = lazy(() => import("./DropdownDoc"));
const FormDoc = lazy(() => import("./FormDoc"));
const CardDoc = lazy(() => import("./CardDoc"));
const ImageCardDoc = lazy(() => import("./ImageCardDoc"));
const PanelDoc = lazy(() => import("./PanelDoc"));
const MasonryDoc = lazy(() => import("./MasonryDoc"));
const TableDoc = lazy(() => import("./TableDoc"));
const ListDoc = lazy(() => import("./ListDoc"));
const TreeDoc = lazy(() => import("./TreeDoc"));
const ChatDoc = lazy(() => import("./ChatDoc"));
const CodeBlockDoc = lazy(() => import("./CodeBlockDoc"));
const HeaderDoc = lazy(() => import("./HeaderDoc"));
const SideNavDoc = lazy(() => import("./SideNavDoc"));
const NavLinkDoc = lazy(() => import("./NavLinkDoc"));
const AccordionDoc = lazy(() => import("./AccordionDoc"));
const TabsDoc = lazy(() => import("./TabsDoc"));
const DialogDoc = lazy(() => import("./DialogDoc"));
const TooltipDoc = lazy(() => import("./TooltipDoc"));
const AlertDoc = lazy(() => import("./AlertDoc"));
const ProgressBarDoc = lazy(() => import("./ProgressBarDoc"));
const SpinDoc = lazy(() => import("./SpinDoc"));
const FilmReelDoc = lazy(() => import("./FilmReelDoc"));
const MiniPlayerDoc = lazy(() => import("./MiniPlayerDoc"));
const CinePlayerDoc = lazy(() => import("./CinePlayerDoc"));
const FileExplorerDoc = lazy(() => import("./FileExplorerDoc"));
const BarChartDoc = lazy(() => import("./BarChartDoc"));
const LineChartDoc = lazy(() => import("./LineChartDoc"));
const PieChartDoc = lazy(() => import("./PieChartDoc"));
const ScatterChartDoc = lazy(() => import("./ScatterChartDoc"));
const TypewriterTextDoc = lazy(() => import("./TypewriterTextDoc"));
const AvatarDoc = lazy(() => import("./AvatarDoc"));
const SliderDoc = lazy(() => import("./SliderDoc"));
const BreadcrumbDoc = lazy(() => import("./BreadcrumbDoc"));
const PaginationDoc = lazy(() => import("./PaginationDoc"));
const DrawerDoc = lazy(() => import("./DrawerDoc"));
const SkeletonDoc = lazy(() => import("./SkeletonDoc"));
const ToastDoc = lazy(() => import("./ToastDoc"));
const CommandPaletteDoc = lazy(() => import("./CommandPaletteDoc"));
const TagDoc = lazy(() => import("./TagDoc"));
const StatDoc = lazy(() => import("./StatDoc"));
const MetricCardDoc = lazy(() => import("./MetricCardDoc"));
const TimelineDoc = lazy(() => import("./TimelineDoc"));
const ContextMenuDoc = lazy(() => import("./ContextMenuDoc"));
const RibbonBarDoc = lazy(() => import("./RibbonBarDoc"));
const DateTimePickerDoc = lazy(() => import("./DateTimePickerDoc"));
const SplitPanelDoc = lazy(() => import("./SplitPanelDoc"));
const VirtualListDoc = lazy(() => import("./VirtualListDoc"));
const RatingDoc = lazy(() => import("./RatingDoc"));
const KbdDoc = lazy(() => import("./KbdDoc"));
const OTPInputDoc = lazy(() => import("./OTPInputDoc"));
const LoginPanelDoc = lazy(() => import("./LoginPanelDoc"));
const RichTextEditorDoc = lazy(() => import("./RichTextEditorDoc"));

/* ── Docs nav items ───────────────────────────────────── */

const docsNavItems: SideNavItem[] = [
  {
    label: "Primitives",
    icon: <Box className="h-4 w-4" />,
    defaultOpen: true,
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
      { label: "Avatar", path: "avatar" },
      { label: "Slider", path: "slider" },
      { label: "Tag / Chip", path: "tag" },
      { label: "Rating", path: "rating" },
      { label: "Kbd", path: "kbd" },
      { label: "OTPInput", path: "otp-input" },
    ],
  },
  {
    label: "Layout",
    icon: <LayoutGrid className="h-4 w-4" />,
    defaultOpen: true,
    children: [
      { label: "Card", path: "card" },
      { label: "ImageCard", path: "image-card" },
      { label: "Panel", path: "panel" },
      { label: "SplitPanel", path: "split-panel" },
      { label: "Masonry", path: "masonry" },
    ],
  },
  {
    label: "Data Display",
    icon: <BarChart3 className="h-4 w-4" />,
    defaultOpen: true,
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
    defaultOpen: true,
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
    defaultOpen: true,
    children: [
      { label: "Accordion", path: "accordion" },
      { label: "Tabs", path: "tabs" },
    ],
  },
  {
    label: "Overlay",
    icon: <Square className="h-4 w-4" />,
    defaultOpen: true,
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
    defaultOpen: true,
    children: [
      { label: "Alert", path: "alert" },
      { label: "ProgressBar", path: "progress-bar" },
      { label: "Spin", path: "spin" },
      { label: "Skeleton", path: "skeleton" },
      { label: "Toast", path: "toast" },
    ],
  },
  {
    label: "Extras",
    icon: <Clapperboard className="h-4 w-4" />,
    defaultOpen: true,
    children: [
      { label: "TypewriterText", path: "typewriter-text" },
      { label: "CommandPalette", path: "command-palette" },
      { label: "FilmReel", path: "film-reel" },
      { label: "MiniPlayer", path: "mini-player" },
      { label: "CinePlayer", path: "cine-player" },
      { label: "FileExplorer", path: "file-explorer" },
      { label: "Timeline", path: "timeline" },
      { label: "DateTimePicker", path: "date-time-picker" },
      { label: "LoginPanel", path: "login-panel" },
      { label: "RichTextEditor", path: "rich-text-editor" },
    ],
  },
  {
    label: "Charts",
    icon: <TrendingUp className="h-4 w-4" />,
    defaultOpen: true,
    children: [
      { label: "BarChart", path: "bar-chart" },
      { label: "LineChart", path: "line-chart" },
      { label: "PieChart", path: "pie-chart" },
      { label: "ScatterChart", path: "scatter-chart" },
    ],
  },
];

/* ── Static search index (slug → searchable terms) ───── */

const componentSearchIndex: Record<string, string[]> = {
  button: [
    "intent",
    "size",
    "primary",
    "secondary",
    "danger",
    "ghost",
    "link",
    "ButtonHTMLAttributes",
    "xs",
    "sm",
    "md",
    "lg",
  ],
  badge: ["intent", "size", "primary", "secondary", "success", "danger", "warning", "info"],
  indicator: [
    "children",
    "show",
    "content",
    "pulse",
    "intent",
    "placement",
    "top-right",
    "top-left",
    "bottom-right",
    "bottom-left",
  ],
  label: ["intent", "size", "default", "primary", "danger", "LabelHTMLAttributes"],
  input: ["state", "inputSize", "prefix", "suffix", "action", "error", "default", "adornment"],
  textbox: ["state", "size", "showWordCount", "maxWords", "TextareaHTMLAttributes", "textarea"],
  checkbox: [
    "checked",
    "indeterminate",
    "onCheckedChange",
    "label",
    "intent",
    "size",
    "disabled",
    "defaultChecked",
  ],
  radio: [
    "value",
    "name",
    "disabled",
    "onValueChange",
    "orientation",
    "RadioGroup",
    "label",
    "intent",
    "size",
    "vertical",
    "horizontal",
  ],
  switch: [
    "checked",
    "onCheckedChange",
    "checkedContent",
    "uncheckedContent",
    "label",
    "intent",
    "size",
    "defaultChecked",
    "toggle",
  ],
  dropdown: [
    "options",
    "value",
    "onChange",
    "placeholder",
    "multiple",
    "selected",
    "onSelectionChange",
    "DropdownOption",
    "select",
  ],
  form: [
    "layout",
    "size",
    "title",
    "description",
    "footer",
    "onValues",
    "FormItem",
    "FormSection",
    "stacked",
    "inline",
    "required",
    "hint",
    "validation",
    "onValidate",
  ],
  card: [
    "intent",
    "size",
    "CardHeader",
    "CardTitle",
    "CardDescription",
    "CardContent",
    "CardFooter",
    "HorizontalCard",
    "media",
    "mediaPosition",
    "stackOnMobile",
  ],
  "image-card": [
    "src",
    "alt",
    "aspectRatio",
    "ImageCardBody",
    "ImageCardTitle",
    "ImageCardDescription",
    "ImageCardActions",
  ],
  panel: ["intent", "size", "elevated", "PanelHeader", "PanelContent"],
  masonry: [
    "items",
    "columns",
    "columnWidth",
    "gap",
    "onItemClick",
    "MasonryItemData",
    "content",
    "grid",
  ],
  table: [
    "columns",
    "data",
    "onSort",
    "defaultSort",
    "rowActions",
    "SortableTable",
    "DataTable",
    "selectionMode",
    "selectedKeys",
    "onSelectionChange",
    "ColumnDef",
    "sortable",
    "editable",
    "hideBelow",
  ],
  list: ["size", "intent", "striped", "actions", "ListItem"],
  tree: [
    "showLines",
    "showRoot",
    "expandedKeys",
    "defaultExpandedKeys",
    "nodeKey",
    "label",
    "icon",
    "actions",
    "defaultExpanded",
    "expanded",
    "onToggle",
    "TreeItem",
  ],
  chat: [
    "messages",
    "mode",
    "split",
    "left",
    "autoScroll",
    "sender",
    "avatar",
    "content",
    "time",
    "self",
    "ChatMessage",
  ],
  "code-block": [
    "code",
    "language",
    "lineNumbers",
    "editable",
    "onCodeChange",
    "size",
    "theme",
    "filename",
    "collapsible",
    "CodeBlockLanguage",
    "typescript",
    "javascript",
    "tsx",
  ],
  header: [
    "brand",
    "onBrandClick",
    "navItems",
    "actions",
    "linkComponent",
    "height",
    "mobileMenu",
    "navMenuIcon",
    "actionsMenuIcon",
    "HeaderNavItem",
    "HeaderAction",
    "external",
  ],
  sidenav: [
    "items",
    "title",
    "basePath",
    "onItemClick",
    "LinkComponent",
    "collapsible",
    "collapseMode",
    "expanded",
    "icons",
    "mini",
    "showLines",
    "expandedKeys",
    "responsive",
    "mobileBreakpoint",
    "SideNavItem",
  ],
  "nav-link": ["intent", "active", "size", "external", "anchor"],
  accordion: [
    "type",
    "single",
    "multiple",
    "defaultValue",
    "value",
    "onValueChange",
    "size",
    "intent",
    "bordered",
    "AccordionItem",
    "AccordionTrigger",
    "AccordionContent",
  ],
  tabs: [
    "defaultValue",
    "value",
    "onValueChange",
    "intent",
    "pills",
    "underline",
    "TabList",
    "TabTrigger",
    "TabPanels",
    "TabContent",
  ],
  dialog: [
    "open",
    "onOpenChange",
    "modal",
    "closeOnOutsideClick",
    "size",
    "position",
    "center",
    "bottom",
    "DialogContent",
    "DialogHeader",
    "DialogTitle",
    "DialogDescription",
    "DialogFooter",
    "DialogClose",
  ],
  tooltip: ["content", "position", "top", "bottom", "left", "right", "delay", "intent", "maxWidth"],
  alert: [
    "intent",
    "size",
    "success",
    "warning",
    "error",
    "info",
    "useAlert",
    "show",
    "AlertOptions",
    "message",
    "title",
    "position",
    "duration",
    "AlertPosition",
  ],
  "progress-bar": [
    "value",
    "showLabel",
    "indeterminate",
    "animated",
    "duration",
    "intent",
    "size",
    "edge",
    "xs",
    "bar",
  ],
  spin: [
    "spinning",
    "tip",
    "size",
    "intent",
    "useSpin",
    "wrap",
    "start",
    "stop",
    "spinner",
    "loading",
  ],
  "film-reel": [
    "photos",
    "layout",
    "strip",
    "sheet",
    "stack",
    "actions",
    "onAction",
    "showGrain",
    "sheetTitle",
    "sheetLabel",
    "FilmReelPhoto",
    "FilmReelAction",
    "metadata",
    "camera",
  ],
  "mini-player": [
    "playlist",
    "initialTrack",
    "position",
    "entrance",
    "theme",
    "docked",
    "visible",
    "onVisibleChange",
    "onTrackChange",
    "onLike",
    "autoPlay",
    "shuffle",
    "loop",
    "accent",
    "MiniPlayerTrack",
    "audio",
    "cover",
  ],
  "cine-player": [
    "playlist",
    "initialTrack",
    "autoPlay",
    "shuffle",
    "loop",
    "onTrackChange",
    "onPlayChange",
    "accent",
    "CinePlayerMedia",
    "poster",
    "subtitle",
    "video",
  ],
  "file-explorer": [
    "files",
    "title",
    "defaultView",
    "list",
    "grid",
    "dockable",
    "dockSide",
    "visible",
    "resizable",
    "onFileOpen",
    "onSelectionChange",
    "onNavigate",
    "onDelete",
    "onClose",
    "actions",
    "FileExplorerItem",
    "extension",
    "mimeType",
  ],
  "bar-chart": [
    "series",
    "ChartSeries",
    "orientation",
    "grouped",
    "stacked",
    "horizontal",
    "vertical",
    "barRadius",
    "barPadding",
    "groupPadding",
    "xAxis",
    "yAxis",
    "y2Axis",
    "y2Series",
    "AxisConfig",
    "legend",
    "animateOnMount",
  ],
  "line-chart": [
    "series",
    "ChartSeries",
    "smooth",
    "area",
    "showDots",
    "strokeWidth",
    "xAxis",
    "yAxis",
    "y2Axis",
    "y2Series",
    "AxisConfig",
    "legend",
    "animateOnMount",
    "bezier",
    "curve",
  ],
  "pie-chart": [
    "data",
    "PieSlice",
    "donut",
    "donutThickness",
    "startAngle",
    "padAngle",
    "labelType",
    "percent",
    "centerLabel",
    "centerSubLabel",
    "explodeOnHover",
    "explodeOffset",
    "legend",
    "animateOnMount",
  ],
  "scatter-chart": [
    "series",
    "ChartSeries",
    "dotRadius",
    "dotOpacity",
    "clusters",
    "jitter",
    "jitterAmount",
    "linkedLines",
    "xAxis",
    "yAxis",
    "AxisConfig",
    "legend",
    "animateOnMount",
    "scatter",
    "bubble",
  ],
  avatar: [
    "src",
    "alt",
    "initials",
    "size",
    "xs",
    "sm",
    "md",
    "lg",
    "xl",
    "shape",
    "circular",
    "rounded",
    "square",
    "status",
    "online",
    "offline",
    "busy",
    "away",
    "AvatarGroup",
    "max",
    "overlap",
  ],
  slider: [
    "mode",
    "single",
    "range",
    "min",
    "max",
    "step",
    "intent",
    "size",
    "disabled",
    "showValue",
    "formatValue",
    "label",
    "value",
    "defaultValue",
    "onChange",
    "SliderRange",
    "primary",
    "secondary",
    "success",
    "danger",
    "warning",
  ],
  breadcrumb: [
    "items",
    "separator",
    "homeIcon",
    "LinkComponent",
    "BreadcrumbItem",
    "label",
    "href",
    "icon",
    "chevron",
  ],
  pagination: [
    "totalPages",
    "currentPage",
    "onPageChange",
    "siblingCount",
    "showFirstLast",
    "showPageCount",
    "size",
    "sm",
    "md",
    "lg",
    "page",
  ],
  drawer: [
    "open",
    "onOpenChange",
    "side",
    "left",
    "right",
    "top",
    "bottom",
    "size",
    "backdrop",
    "closeOnBackdropClick",
    "DrawerSide",
    "DrawerHeader",
    "DrawerBody",
    "DrawerFooter",
    "DrawerClose",
    "panel",
    "slide",
  ],
  skeleton: [
    "variant",
    "text",
    "circular",
    "rectangular",
    "rounded",
    "animation",
    "pulse",
    "wave",
    "none",
    "width",
    "height",
    "lines",
    "placeholder",
    "loading",
  ],
  toast: [
    "ToastProvider",
    "useToast",
    "title",
    "description",
    "variant",
    "default",
    "success",
    "danger",
    "warning",
    "info",
    "duration",
    "dismissible",
    "action",
    "position",
    "top-right",
    "top-left",
    "top-center",
    "bottom-right",
    "bottom-left",
    "bottom-center",
    "onDismiss",
    "dismiss",
    "dismissAll",
    "ToastOptions",
    "ToastVariant",
    "ToastPosition",
    "ToastAction",
  ],
  "command-palette": [
    "open",
    "onOpenChange",
    "commands",
    "CommandItem",
    "CommandGroup",
    "placeholder",
    "hotkey",
    "maxItems",
    "id",
    "label",
    "onSelect",
    "description",
    "icon",
    "shortcut",
    "group",
    "keywords",
    "disabled",
    "search",
    "palette",
    "cmdk",
  ],
  tag: [
    "intent",
    "size",
    "variant",
    "solid",
    "outline",
    "soft",
    "primary",
    "secondary",
    "success",
    "danger",
    "warning",
    "info",
    "icon",
    "dot",
    "removable",
    "onRemove",
    "disabled",
    "chip",
    "pill",
    "label",
  ],
  stat: [
    "title",
    "value",
    "prefix",
    "suffix",
    "icon",
    "trend",
    "trendValue",
    "description",
    "intent",
    "size",
    "up",
    "down",
    "flat",
    "statistics",
    "dashboard",
    "metric",
  ],
  "metric-card": [
    "value",
    "title",
    "from",
    "decimals",
    "animateDuration",
    "formatter",
    "prefix",
    "suffix",
    "icon",
    "trend",
    "trendValue",
    "description",
    "intent",
    "size",
    "countup",
    "counter",
    "animation",
    "number",
    "animated",
    "easing",
  ],
  timeline: [
    "items",
    "orientation",
    "vertical",
    "horizontal",
    "activeIndex",
    "animated",
    "lineStyle",
    "solid",
    "dashed",
    "TimelineItem",
    "title",
    "description",
    "timestamp",
    "status",
    "complete",
    "active",
    "pending",
    "error",
    "icon",
    "media",
    "badge",
    "scroll",
    "IntersectionObserver",
  ],
  "context-menu": [
    "items",
    "children",
    "disabled",
    "onOpenChange",
    "ContextMenuItem",
    "key",
    "label",
    "icon",
    "shortcut",
    "danger",
    "separator",
    "submenu",
    "nested",
    "longpress",
    "right-click",
    "Electron",
    "mobile",
    "portal",
  ],
  "ribbon-bar": [
    "tabs",
    "defaultTab",
    "defaultMode",
    "defaultOpen",
    "sticky",
    "full",
    "compact",
    "icons",
    "RibbonTab",
    "RibbonGroup",
    "RibbonItem",
    "RibbonMode",
    "collapsible",
    "command",
    "toolbar",
    "office",
    "groups",
  ],
  "date-time-picker": [
    "value",
    "defaultValue",
    "onChange",
    "mode",
    "date",
    "time",
    "datetime",
    "minDate",
    "maxDate",
    "disabled",
    "placeholder",
    "format",
    "use24Hour",
    "showSeconds",
    "locale",
    "onOpen",
    "onClose",
    "drum",
    "scroll",
    "calendar",
    "frosted",
    "glass",
    "OffsetUnit",
    "OffsetDirection",
    "DateTimePickerProps",
    "DateTimeMode",
    "picker",
    "wheel",
  ],
  "typewriter-text": [
    "text",
    "mode",
    "typewriter",
    "stream",
    "instant",
    "speed",
    "cursor",
    "cursorChar",
    "thinking",
    "streaming",
    "delay",
    "onComplete",
    "as",
    "polymorphic",
    "LLM",
    "token",
    "copilot",
    "animate",
  ],
};

/* ── Search filter ────────────────────────────────────── */

function filterNavItems(items: SideNavItem[], query: string): SideNavItem[] {
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

/* ── Router link adapter ──────────────────────────────── */

function DocRouterLink({ to, className, style, children }: SideNavLinkComponentProps) {
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

/* ── Loading fallback ─────────────────────────────────── */

function DocFallback() {
  return (
    <div className="flex h-40 items-center justify-center text-sm text-primary-400">Loading…</div>
  );
}

/* ── DocsLayout ───────────────────────────────────────── */

export default function DocsLayout() {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredNavItems = useMemo(() => filterNavItems(docsNavItems, searchQuery), [searchQuery]);
  const noResults = searchQuery.trim() !== "" && filteredNavItems.length === 0;

  return (
    <div className="flex h-full overflow-hidden">
      {/* ── Docs sidebar ──────────────────── */}
      <aside className="hidden md:flex md:w-52 md:shrink-0 md:flex-col overflow-y-auto overscroll-y-contain border-r border-primary-200 bg-white p-3 dark:border-primary-700 dark:bg-primary-900">
        {/* Search input */}
        <div className="mb-3">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search docs…"
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
        {noResults && (
          <p className="px-2 py-4 text-center text-xs text-secondary-500">No results</p>
        )}
        <SideNav
          items={filteredNavItems}
          title={searchQuery ? undefined : "API Reference"}
          basePath="/docs/"
          LinkComponent={DocRouterLink}
          showLines
          mobileDrawerSlot={
            <>
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search docs…"
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

      {/* ── Docs content ──────────────────── */}
      <main className="flex-1 overflow-y-auto overscroll-y-contain p-4 pb-20 md:p-8">
        <Suspense fallback={<DocFallback />}>
          <Routes>
            <Route index element={<Navigate to="button" replace />} />
            <Route path="button" element={<ButtonDoc />} />
            <Route path="badge" element={<BadgeDoc />} />
            <Route path="indicator" element={<IndicatorDoc />} />
            <Route path="label" element={<LabelDoc />} />
            <Route path="input" element={<InputDoc />} />
            <Route path="textbox" element={<TextBoxDoc />} />
            <Route path="checkbox" element={<CheckboxDoc />} />
            <Route path="radio" element={<RadioDoc />} />
            <Route path="switch" element={<SwitchDoc />} />
            <Route path="dropdown" element={<DropdownDoc />} />
            <Route path="form" element={<FormDoc />} />
            <Route path="card" element={<CardDoc />} />
            <Route path="image-card" element={<ImageCardDoc />} />
            <Route path="panel" element={<PanelDoc />} />
            <Route path="split-panel" element={<SplitPanelDoc />} />
            <Route path="virtual-list" element={<VirtualListDoc />} />
            <Route path="masonry" element={<MasonryDoc />} />
            <Route path="table" element={<TableDoc />} />
            <Route path="list" element={<ListDoc />} />
            <Route path="tree" element={<TreeDoc />} />
            <Route path="chat" element={<ChatDoc />} />
            <Route path="code-block" element={<CodeBlockDoc />} />
            <Route path="header" element={<HeaderDoc />} />
            <Route path="sidenav" element={<SideNavDoc />} />
            <Route path="nav-link" element={<NavLinkDoc />} />
            <Route path="accordion" element={<AccordionDoc />} />
            <Route path="tabs" element={<TabsDoc />} />
            <Route path="dialog" element={<DialogDoc />} />
            <Route path="tooltip" element={<TooltipDoc />} />
            <Route path="alert" element={<AlertDoc />} />
            <Route path="progress-bar" element={<ProgressBarDoc />} />
            <Route path="spin" element={<SpinDoc />} />
            <Route path="film-reel" element={<FilmReelDoc />} />
            <Route path="mini-player" element={<MiniPlayerDoc />} />
            <Route path="cine-player" element={<CinePlayerDoc />} />
            <Route path="file-explorer" element={<FileExplorerDoc />} />
            <Route path="bar-chart" element={<BarChartDoc />} />
            <Route path="line-chart" element={<LineChartDoc />} />
            <Route path="pie-chart" element={<PieChartDoc />} />
            <Route path="scatter-chart" element={<ScatterChartDoc />} />
            <Route path="typewriter-text" element={<TypewriterTextDoc />} />
            <Route path="avatar" element={<AvatarDoc />} />
            <Route path="slider" element={<SliderDoc />} />
            <Route path="breadcrumb" element={<BreadcrumbDoc />} />
            <Route path="pagination" element={<PaginationDoc />} />
            <Route path="drawer" element={<DrawerDoc />} />
            <Route path="skeleton" element={<SkeletonDoc />} />
            <Route path="toast" element={<ToastDoc />} />
            <Route path="command-palette" element={<CommandPaletteDoc />} />
            <Route path="tag" element={<TagDoc />} />
            <Route path="stat" element={<StatDoc />} />
            <Route path="metric-card" element={<MetricCardDoc />} />
            <Route path="timeline" element={<TimelineDoc />} />
            <Route path="context-menu" element={<ContextMenuDoc />} />
            <Route path="ribbon-bar" element={<RibbonBarDoc />} />
            <Route path="date-time-picker" element={<DateTimePickerDoc />} />
            <Route path="rating" element={<RatingDoc />} />
            <Route path="kbd" element={<KbdDoc />} />
            <Route path="otp-input" element={<OTPInputDoc />} />
            <Route path="login-panel" element={<LoginPanelDoc />} />
            <Route path="rich-text-editor" element={<RichTextEditorDoc />} />
            <Route path="*" element={<Navigate to="button" replace />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}
