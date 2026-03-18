// ─── Styles (must be imported by the consumer)
// import '@jac/ui/styles/theme.css';

// ─── Utilities
export { cn } from "./lib/utils";

// ─── Theme (CVA variant definitions)
export {
  buttonVariants,
  badgeVariants,
  inputVariants,
  cardVariants,
  panelVariants,
  labelVariants,
  tableVariants,
  listVariants,
  accordionVariants,
  tabListVariants,
  tabTriggerVariants,
  dialogContentVariants,
  tooltipVariants,
  alertVariants,
  navLinkVariants,
  codeBlockVariants,
} from "./styles/theme";

// ─── Primitives
export { Button } from "./components/Button";
export {
  Dropdown,
  type DropdownOption,
  type DropdownProps,
  type DropdownSingleProps,
  type DropdownMultipleProps,
} from "./components/Dropdown";
export {
  DropdownButton,
  type DropdownItem,
  type DropdownButtonProps,
} from "./components/DropdownButton";
export { Badge } from "./components/Badge";
export { Label } from "./components/Label";
export { Input } from "./components/Input";

// ─── Layout
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  HorizontalCard,
} from "./components/Card";
export {
  ImageCard,
  ImageCardBody,
  ImageCardTitle,
  ImageCardDescription,
  ImageCardActions,
} from "./components/ImageCard";
export { Panel, PanelHeader, PanelContent } from "./components/Panel";

// ─── Data Display
export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  SortableTable,
  DataTable,
  type ColumnDef,
  type SortState,
  type SortDirection,
  type SelectionMode,
  type DataTableProps,
} from "./components/Table";
export { List, ListItem } from "./components/List";
export { Tree, TreeItem } from "./components/Tree";
export { Chat, type ChatMessage, type ChatProps } from "./components/Chat";
export { CodeBlock, type CodeBlockLanguage, type CodeBlockProps } from "./components/CodeBlock";

// ─── Navigation
export {
  SideNav,
  type SideNavCollapseMode,
  type SideNavItem,
  type SideNavProps,
  type SideNavLinkComponentProps,
} from "./components/SideNav";
export {
  Header,
  type HeaderProps,
  type HeaderNavItem,
  type HeaderAction,
} from "./components/Header";
export { NavLink } from "./components/NavLink";

// ─── Disclosure
export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./components/Accordion";
export { Tabs, TabList, TabTrigger, TabPanels, TabContent } from "./components/Tabs";

// ─── Overlay
export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "./components/Dialog";
export { Tooltip } from "./components/Tooltip";

// ─── Feedback
export {
  Alert,
  AlertTitle,
  AlertDescription,
  useAlert,
  configureAlertTopOffset,
  type AlertPosition,
  type AlertOptions,
} from "./components/Alert";

// ─── Extras
export {
  FilmReel,
  type FilmReelPhoto,
  type FilmReelAction,
  type FilmReelLayout,
  type FilmReelProps,
} from "./components/FilmReel";

export {
  MiniPlayer,
  type MiniPlayerTrack,
  type MiniPlayerPosition,
  type MiniPlayerEntrance,
  type MiniPlayerProps,
} from "./components/MiniPlayer";

export {
  CinePlayer,
  type CinePlayerMedia,
  type CinePlayerSortKey,
  type CinePlayerProps,
} from "./components/CinePlayer";

export {
  FileExplorer,
  type FileExplorerItem,
  type FileExplorerViewMode,
  type FileExplorerDockSide,
  type FileExplorerInputMode,
  type FileExplorerAction,
  type FileExplorerProps,
} from "./components/FileExplorer";
