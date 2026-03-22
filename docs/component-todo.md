# OnyxUI — Recommended Components To-Do

Components recommended for future addition to the library, grouped by priority.

---

## High Priority

| Component | Category | Rationale |
|---|---|---|
| `Pagination` | Navigation | Essential companion to the existing `Table` component |
| `Slider` | Primitives | Range input — core form primitive missing alongside Input/Checkbox/Radio |
| `Select` | Forms | Styled custom select (Dropdown exists but is not a form-select element) |
| `Drawer` / `Sheet` | Overlay | Slide-in side panel — Dialog exists but not a side-opening variant |
| `Avatar` / `AvatarGroup` | Primitives | User representation with image + initials fallback |
| `Breadcrumb` | Navigation | Path context for nested/hierarchical UIs |

---

## Medium Priority

| Component | Category | Rationale |
|---|---|---|
| `Stepper` | Navigation | Multi-step form / wizard flow indicator |
| `Timeline` | DataDisplay | Chronological event log; complements Chat and List |
| `Stat` / `MetricCard` | DataDisplay | KPI display (value + label + trend delta) — pairs well with Charts |
| `Tag` / `Chip` | Primitives | Removable/selectable tags, distinct from Badge |
| `DatePicker` | Forms | Date input UI (high demand, complex implementation) |
| `ContextMenu` | Overlay | Right-click menu — natural fit alongside Dropdown and Dialog |
| `Popover` | Overlay | Triggered interactive floating content (Tooltip is read-only) |

---

## Lower Priority / Extras-Worthy

| Component | Category | Rationale |
|---|---|---|
| `VirtualList` | Extras | Windowed rendering for large datasets; pairs with Tree and List | ✅ 2026-03-22 |
| `RichTextEditor` | Extras | Complements CodeBlock for user-editable content |
| `OTPInput` | Forms | Segmented code entry for auth UX | ✅ 2026-03-22 |
| `Kbd` | Primitives | `<kbd>` shortcut display — small but polished | ✅ 2026-03-22 |
| `ResizablePanels` | Layout | SplitPane — natural extension of Panel for IDE-like UIs |
| `Rating` | Primitives | Star/icon rating input | ✅ 2026-03-22 |
| `HoverCard` | Overlay | Rich preview on hover (e.g. user profile, link preview) |

---

## Implemented

| Component | Category | Date |
|---|---|---|
| `Skeleton` | Feedback | 2026-03-21 |
| `Toast` | Feedback | 2026-03-21 |
| `CommandPalette` | Extras | 2026-03-21 |
| `VirtualList` | DataDisplay | 2026-03-22 |
| `Rating` | Primitives | 2026-03-22 |
| `Kbd` | Primitives | 2026-03-22 |
| `OTPInput` | Forms | 2026-03-22 |
| `LoginPanel` | Extras | 2026-03-22 |
