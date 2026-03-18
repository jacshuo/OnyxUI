<p align="center">
  <img src="https://img.shields.io/npm/v/@jacshuo/onyx?color=8b5cf6&style=flat-square" alt="npm version" />
  <img src="https://img.shields.io/npm/l/@jacshuo/onyx?style=flat-square" alt="license" />
  <img src="https://img.shields.io/github/actions/workflow/status/jacshuo/OnyxUI/ci.yml?branch=main&style=flat-square&label=CI" alt="CI" />
  <img src="https://img.shields.io/npm/dm/@jacshuo/onyx?color=10b981&style=flat-square" alt="downloads" />
</p>

<p align="right">
  <a href="./README.md">English</a> | <strong>中文</strong>
</p>

# @jacshuo/onyx

基于 Tailwind CSS v4 构建的 **React UI 组件库** —— 同时面向响应式 Web 应用与 Electron 桌面应用。提供支持 Tree-shaking 的 ESM + CJS 双格式产物、按组件拆分的子路径导出、模块化 CSS 以及完整的 TypeScript 类型声明。

源自对**精致跨端体验**的热忱，Onyx 在手机屏幕到 4K 显示器之间提供一致的视觉表现 —— 暗色模式、键盘导航与触摸交互，从第一天起就已内置，绝非事后补丁。

> **在线演示 →** [jacshuo.github.io/OnyxUI](https://jacshuo.github.io/OnyxUI)

---

## 为什么选择 Onyx？

- **原生响应式** —— 每个组件都能从手机屏幕自适应到 4K 显示器，无需你多写一行媒体查询。Header 自动折叠为汉堡菜单，侧边栏滑入图标或抽屉模式，Dialog 变身底部弹层 —— 全部内置。`sm` / `md` / `lg` 尺寸变体与语义化 CSS Token 让密度调整变得轻而易举。
- **桌面与 Electron 一等公民** —— Onyx 以 Electron 和桌面应用为核心使用场景精心打磨，针对键盘导航、指针交互和高密度布局做了专项优化 —— 这正是大多数移动优先的组件库难以胜任的地方。
- **开箱即用，生产就绪** —— 暗色模式、设计 Token、无障碍访问、触摸手势和键盘快捷键，从第一行代码起就已就绪，而非日后拼凑。
- **极小体积，完全掌控** —— 无运行时 CSS-in-JS。只有 Tailwind CSS v4 工具类与 CSS 自定义属性。通过覆盖 Token 即可定制任意细节，无需 eject，无需与样式优先级斗争。
- **丰富的专项组件** —— 除常规的按钮和表单之外，Onyx 还提供 `CinePlayer`、`MiniPlayer`、`FileExplorer` 和 `DataTable` —— 这些在通用组件库中几乎找不到，却是媒体类和桌面级应用不可或缺的存在。

---

## 特性一览

- 🎨 **30+ 组件** —— 从 Button → DataTable → CinePlayer → CodeBlock 应有尽有
- 📱 **默认响应式** —— 内置断点布局、触摸友好的点击区域，以及自适应组件模式（汉堡导航、抽屉侧边栏、底部弹层对话框）
- 🌗 **深色 / 浅色模式** —— 基于 class 切换，开箱即用
- 🎯 **CSS 变量设计 Token** —— 通过 CSS 自定义属性覆盖任意设计决策，包括在媒体查询断点处按需调整
- ⚡ **Tailwind CSS v4** —— 零配置，`@theme` Token，支持 `color-mix()` 强调色
- 📦 **支持 Tree-shaking** —— 每个组件独立 ESM 入口，按需引入，打包体积精准可控
- 🗂️ **按需导入** —— 子路径导出（`@jacshuo/onyx/Button`），最大程度控制打包产物
- 🎨 **模块化 CSS** —— 完整包、仅基础包或按组件单独引入 CSS，随心选择
- 🖥️ **跨平台** —— 为 Web 与 Electron 桌面应用共同设计
- ⌨️ **键盘优先** —— CinePlayer、FileExplorer 等组件内置完善的键盘快捷键
- 👆 **触摸与手势支持** —— tap-to-reveal、focus-visible 状态，以及覆盖所有交互组件的触摸优化体验
- 🔤 **完整 TypeScript** —— 每个 prop、事件与变体均有类型声明
- 🧩 **可组合 API** —— 复合组件模式（如 `Dialog` → `DialogContent` + `DialogHeader` + `DialogFooter`），自由拼装所需 UI

---

## 安装

```bash
npm install @jacshuo/onyx
# 或
pnpm add @jacshuo/onyx
# 或
yarn add @jacshuo/onyx
```

### 对等依赖

```bash
npm install react react-dom
```

> 需要 **React ≥ 18.0.0**。

---

## 快速上手

**第一步：引入样式表**（在应用入口处引入一次即可）：

```tsx
// main.tsx 或 App.tsx
import '@jacshuo/onyx/styles.css';
```

**第二步：使用组件：**

```tsx
import { Button, Card, CardHeader, CardTitle, CardContent } from '@jacshuo/onyx';

function App() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hello World</CardTitle>
      </CardHeader>
      <CardContent>
        <Button intent="primary">开始使用</Button>
      </CardContent>
    </Card>
  );
}
```

---

## 导入方式

Onyx 支持多种导入风格，按需选择最适合你的打包器和性能要求的方式。

### 整体导入（最简单）

从统一入口导入所有组件。现代打包器（Vite、Next.js、webpack 5）会自动 Tree-shake 掉未使用的组件。

```tsx
import { Button, Dialog, Tabs } from '@jacshuo/onyx';
import '@jacshuo/onyx/styles.css';
```

### 按组件导入（最彻底的 Tree-shaking）

从各组件的独立子路径导入。即使打包器的 Tree-shaking 能力有限，也能保证只打入实际使用的代码。

```tsx
import { Button } from '@jacshuo/onyx/Button';
import { Dialog, DialogContent } from '@jacshuo/onyx/Dialog';
import { Tabs, TabList, TabTrigger } from '@jacshuo/onyx/Tabs';
```

### CSS 引入选项

| 导入路径 | 体积 | 说明 |
|---|---|---|
| `@jacshuo/onyx/styles.css` | ~102 KB | 完整预编译包 —— 包含所有工具类与组件 CSS，最省心的选择。 |
| `@jacshuo/onyx/styles/base.css` | ~95 KB | Tailwind 工具类 + 核心设计 Token，不含组件专属关键帧。 |
| `@jacshuo/onyx/styles/tailwind.css` | ~4 KB | **仅适用于已有 Tailwind CSS v4 项目。** 包含 `@source` 指令、Token 与暗色模式变体。 |
| `@jacshuo/onyx/styles/tokens.css` | ~4 KB | 仅提供原始 `@theme` Token，不含 `@source` 或 Tailwind 导入。 |
| `@jacshuo/onyx/styles/CinePlayer.css` | ~2.5 KB | CinePlayer 关键帧及 `--cp-*` 设计 Token |
| `@jacshuo/onyx/styles/MiniPlayer.css` | ~2.2 KB | MiniPlayer 关键帧及 `--mp-*` 设计 Token |
| `@jacshuo/onyx/styles/FileExplorer.css` | ~1.6 KB | FileExplorer `--fe-*` 设计 Token |
| `@jacshuo/onyx/styles/FilmReel.css` | ~0.6 KB | FilmReel 关键帧 |

#### 与已有的 Tailwind CSS v4 项目集成

如果你的项目已经运行 Tailwind CSS v4，只想引入 Token 而不需要完整预编译包，**必须**使用 `tailwind.css`，以便 Tailwind 能扫描组件库的 JS 文件中的类名：

```css
/* 你的应用 CSS 入口 */
@import "tailwindcss";
@import "@jacshuo/onyx/styles/tailwind.css";

/* 可选：单独引入组件专属 CSS */
@import "@jacshuo/onyx/styles/CinePlayer.css";
```

> **为什么这样做？** Onyx 组件在 JavaScript 中（通过 CVA）使用 Tailwind 工具类。没有 `@source` 指令，你的 Tailwind 构建不会扫描这些类名，导致样式缺失。`tailwind.css` 中包含的 `@source ".."` 会告知 Tailwind v4 扫描组件库的编译产物。
>
> **不要**单独使用 `tokens.css` —— 它只提供设计 Token，不含 `@source` 指令，组件样式将不完整。

**示例 —— 仅使用 CinePlayer 的最小化配置：**

```tsx
import '@jacshuo/onyx/styles/base.css';
import '@jacshuo/onyx/styles/CinePlayer.css';
import { CinePlayer } from '@jacshuo/onyx/CinePlayer';
```

---

## 组件列表

### 基础元素

| 组件 | 说明 |
|---|---|
| **Button** | 六种意图（primary / secondary / danger / warning / ghost / outline）× 三种尺寸（sm / md / lg） |
| **Input** | 带变体支持的样式化文本输入框 |
| **Label** | 表单标签，支持尺寸变体 |
| **Badge** | 内联状态徽标 |
| **Indicator** | 包裹任意元素并在角落叠加圆点或数字角标 |
| **Dropdown** | 单选与多选下拉框 |
| **DropdownButton** | 带下拉菜单的按钮 |

### 布局

| 组件 | 说明 |
|---|---|
| **Card** | Card / CardHeader / CardTitle / CardDescription / CardContent / CardFooter |
| **HorizontalCard** | 图片与内容并排的横向卡片 |
| **ImageCard** | 图片优先的卡片，支持悬停操作区 |
| **Panel** | 带标题的可折叠面板 |

### 数据展示

| 组件 | 说明 |
|---|---|
| **Table** | 基础表格原语（Table / TableHeader / TableBody / TableRow 等） |
| **SortableTable** | 支持点击列头排序 |
| **DataTable** | 功能完整的数据表格，含排序、多选、分页 |
| **List / ListItem** | 样式化列表组件 |
| **Tree / TreeItem** | 可展开的树形视图 |
| **Chat** | 聊天消息列表，区分发送与接收样式 |
| **CodeBlock** | 基于 Shiki 的语法高亮代码块，支持 20+ 语言、行号显示与实时编辑模式 |

### 导航

| 组件 | 说明 |
|---|---|
| **SideNav** | 支持图标、分组和多种折叠模式的可折叠侧边栏 |
| **Header** | 带导航项与操作按钮的应用顶栏 |
| **NavLink** | 语义化文字链接（`<a>`），自动识别外链、支持意图 / 尺寸 / 下划线变体 |
| **Tabs** | 带滑动指示器动画的标签页 |

### 展开收起

| 组件 | 说明 |
|---|---|
| **Accordion** | 可展开折叠的手风琴区块 |
| **Tabs** | TabList / TabTrigger / TabPanels / TabContent |

### 浮层

| 组件 | 说明 |
|---|---|
| **Dialog** | 支持层叠、背景点击关闭、ESC 处理的模态对话框 |
| **Tooltip** | 可配置位置的悬停提示 |
| **Alert** | 基于 `useAlert()` Hook 的 Toast 提示系统 |

### 特色组件

| 组件 | 说明 |
|---|---|
| **FilmReel** | 电影感相册，含灯箱效果 |
| **MiniPlayer** | 浮动迷你音乐播放器，支持停靠、播放列表、随机与循环 |
| **CinePlayer** | 全功能视频播放器，含影院模式、播放列表、键盘快捷键 |
| **FileExplorer** | 科幻风格文件浏览器，支持拖拽、调整尺寸、停靠、多选、Delete 键删除 |

---

## 主题定制

### 暗色模式

组件库采用 Tailwind 的**基于 class** 的暗色模式。将 `class="dark"` 加到 `<html>` 或任意祖先元素即可：

```html
<html class="dark">
  <!-- 所有 OnyxUI 组件将以暗色模式渲染 -->
</html>
```

### 强调色

许多组件接受 `accent` prop（任意 CSS 颜色字符串）：

```tsx
<MiniPlayer accent="#3b82f6" playlist={tracks} />
<CinePlayer accent="#f43f5e" playlist={videos} />
<FileExplorer accent="#10b981" files={files} />
```

### CSS 自定义属性

所有组件颜色通过 `:root` 和 `.dark` 中的 CSS 自定义属性定义，完全支持外部覆盖：

```css
/* 覆盖 CinePlayer 颜色 */
:root {
  --cp-bg: #111;
  --cp-text: rgba(255, 255, 255, 0.8);
  --cp-surface-hover: rgba(255, 255, 255, 0.15);
}

/* 覆盖 MiniPlayer 颜色 */
:root {
  --mp-bg: rgba(255, 255, 255, 0.95);
  --mp-text: #1e293b;
}
.dark {
  --mp-bg: rgba(20, 18, 30, 0.95);
  --mp-text: #ffffff;
}

/* 覆盖 FileExplorer 颜色 */
:root {
  --fe-bg: linear-gradient(145deg, #fff, #f8f8fc);
  --fe-text: #475569;
}
```

<details>
<summary><strong>完整 Token 参考</strong></summary>

#### CinePlayer (`--cp-*`)
| Token | 默认值 | 说明 |
|---|---|---|
| `--cp-bg` | `#000000` | 播放器背景 |
| `--cp-panel-bg` | `rgba(0,0,0,0.85)` | 播放列表 / 浮层面板 |
| `--cp-text` | `rgba(255,255,255,0.75)` | 主文字颜色 |
| `--cp-text-muted` | `rgba(255,255,255,0.50)` | 次级文字颜色 |
| `--cp-text-strong` | `#ffffff` | 强调文字颜色 |
| `--cp-border` | `rgba(255,255,255,0.10)` | 边框颜色 |
| `--cp-surface` | `rgba(255,255,255,0.05)` | 表面背景 |
| `--cp-surface-hover` | `rgba(255,255,255,0.10)` | 悬停状态 |
| `--cp-overlay` | `rgba(0,0,0,0.30)` | 遮罩背景 |
| `--cp-seek-track` | `rgba(255,255,255,0.20)` | 进度条轨道 |
| `--cp-seek-buffer` | `rgba(255,255,255,0.15)` | 缓冲区域 |

#### MiniPlayer (`--mp-*`)
| Token | 浅色 | 深色 |
|---|---|---|
| `--mp-bg` | `rgba(255,255,255,0.90)` | `rgba(26,22,37,0.95)` |
| `--mp-text` | `primary-900` | `#ffffff` |
| `--mp-text-muted` | `primary-500` | `rgba(255,255,255,0.50)` |
| `--mp-border` | `rgba(148,163,184,0.60)` | `rgba(255,255,255,0.10)` |
| `--mp-surface` | `rgba(148,163,184,0.50)` | `rgba(255,255,255,0.10)` |
| `--mp-surface-hover` | `rgba(241,245,249,0.60)` | `rgba(255,255,255,0.05)` |
| `--mp-dock-strip` | `rgba(148,163,184,0.40)` | `rgba(255,255,255,0.20)` |

#### FileExplorer (`--fe-*`)
| Token | 浅色 | 深色 |
|---|---|---|
| `--fe-bg` | 渐变白色 | 渐变深色 |
| `--fe-shadow` | 柔和阴影 | 发光阴影 |
| `--fe-text` | `primary-600` | `rgba(255,255,255,0.70)` |
| `--fe-text-strong` | `primary-900` | `#ffffff` |
| `--fe-text-muted` | `primary-400` | `rgba(255,255,255,0.30)` |
| `--fe-border` | `rgba(0,0,0,0.06)` | `rgba(255,255,255,0.06)` |
| `--fe-btn-color` | `rgba(0,0,0,0.45)` | `rgba(255,255,255,0.50)` |

</details>

---

## 响应式设计

Onyx 组件在内部处理响应式行为 —— 你无需自己编写媒体查询，即可获得自适应布局。

### 响应式顶栏

`Header` 在移动端会自动将导航项收起为汉堡菜单抽屉，无需额外配置：

```tsx
import { Header } from '@jacshuo/onyx';

// ≥md 断点：完整导航栏 + 操作按钮
// <md 断点：汉堡菜单（导航）+ 溢出菜单（操作）—— 自动处理
<Header
  title="我的应用"
  navItems={[
    { label: '首页', href: '/' },
    { label: '文档', href: '/docs' },
    { label: '更新日志', href: '/changelog' },
  ]}
  actions={[
    <Button size="sm" intent="primary">登录</Button>,
  ]}
/>
```

### 响应式侧边栏

`SideNav` 提供三种折叠模式。通过一个 state 变量即可实现桌面到移动端的无缝过渡：

```tsx
import { useState } from 'react';
import { SideNav, type SideNavCollapseMode } from '@jacshuo/onyx';

function AppShell() {
  const [mode, setMode] = useState<SideNavCollapseMode>('expanded');

  return (
    <div className="flex h-screen">
      {/* 移动端隐藏；桌面端可折叠 */}
      <aside className="hidden md:block shrink-0">
        <SideNav
          items={navItems}
          collapsible
          collapseMode={mode}
          onCollapseModeChange={setMode}
        />
      </aside>

      {/* 移动端滑入抽屉 */}
      <aside className="md:hidden">
        <SideNav items={navItems} />
      </aside>

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        {/* 页面内容 */}
      </main>
    </div>
  );
}
```

### Dialog —— 移动端底部弹层

`Dialog` 在小屏幕上会自动渲染为从底部滑入的底部弹层，符合移动端用户的操作习惯：

```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, Button } from '@jacshuo/onyx';

// ≥md 断点：居中模态框
// <md 断点：从底部滑入的全宽弹层 —— 无需额外 props
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent size="sm">
    <DialogHeader>
      <DialogTitle>确认操作</DialogTitle>
    </DialogHeader>
    <p>确定要继续执行此操作吗？</p>
    <div className="flex justify-end gap-2">
      <Button intent="ghost" onClick={() => setOpen(false)}>取消</Button>
      <Button intent="primary" onClick={() => setOpen(false)}>确认</Button>
    </div>
  </DialogContent>
</Dialog>
```

### 尺寸变体控制密度

所有组件都提供 `size` prop（`sm` / `md` / `lg`），用于在移动端紧凑布局与桌面端宽松仪表盘之间灵活切换：

```tsx
import { DataTable, Tabs, TabList, TabTrigger } from '@jacshuo/onyx';

// 移动端紧凑模式
<DataTable columns={columns} data={rows} size="sm" />

// 桌面端舒适模式
<DataTable columns={columns} data={rows} size="lg" />

// 混搭尺寸以匹配布局密度
<Tabs defaultValue="a">
  <TabList size="sm">       {/* 紧凑标签页 */}
    <TabTrigger value="a">标签 A</TabTrigger>
    <TabTrigger value="b">标签 B</TabTrigger>
  </TabList>
</Tabs>
```

### 在断点处覆盖 Token

所有尺寸与间距值均为 CSS 自定义属性。在任意断点处覆盖它们，即可实现精准的响应式调整：

```css
/* 默认（移动端优先）表单布局 */
:root {
  --form-label-w-md: 5rem;
  --form-item-gap-md: 0.5rem;
  --form-row-gap-md: 0.75rem;
}

/* 桌面端：更宽的标签列 + 更大的间距 */
@media (min-width: 768px) {
  :root {
    --form-label-w-md: 7rem;
    --form-item-gap-md: 0.75rem;
    --form-row-gap-md: 1.25rem;
  }
}
```

---

## 使用示例

### Button

```tsx
import { Button } from '@jacshuo/onyx';

<Button intent="primary" size="lg">保存</Button>
<Button intent="danger">删除</Button>
<Button intent="ghost">取消</Button>
<Button intent="outline">设置</Button>
```

### Dialog

```tsx
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, Button } from '@jacshuo/onyx';

function ConfirmDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>打开对话框</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>确认操作</DialogTitle>
          </DialogHeader>
          <p>确定要继续执行此操作吗？</p>
          <DialogFooter>
            <Button intent="ghost" onClick={() => setOpen(false)}>取消</Button>
            <Button intent="primary" onClick={() => setOpen(false)}>确认</Button>
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
  { key: 'name', header: '姓名', sortable: true },
  { key: 'email', header: '邮箱', sortable: true },
];

<DataTable columns={columns} data={users} selectionMode="multi" pageSize={10} />
```

### Tabs

```tsx
import { Tabs, TabList, TabTrigger, TabPanels, TabContent } from '@jacshuo/onyx';

<Tabs defaultValue="overview">
  <TabList>
    <TabTrigger value="overview">概览</TabTrigger>
    <TabTrigger value="settings">设置</TabTrigger>
  </TabList>
  <TabPanels>
    <TabContent value="overview">概览内容……</TabContent>
    <TabContent value="settings">设置内容……</TabContent>
  </TabPanels>
</Tabs>
```

### Alert（Toast 提示）

```tsx
import { useAlert, Button } from '@jacshuo/onyx';

function NotifyButton() {
  const alert = useAlert();

  return (
    <Button onClick={() => alert({ title: '已保存！', description: '你的更改已成功保存。', variant: 'success' })}>
      保存
    </Button>
  );
}
```

### NavLink

```tsx
import { NavLink } from '@jacshuo/onyx';

{/* 内部链接 */}
<NavLink href="/about">关于</NavLink>

{/* 自动识别外链 —— 显示图标并自动设置 target="_blank" */}
<NavLink href="https://github.com">GitHub</NavLink>

{/* 禁用外链图标 */}
<NavLink href="https://example.com" external={false}>示例</NavLink>

{/* 变体 */}
<NavLink href="/docs" intent="secondary" size="lg" underline="always">文档</NavLink>
```

### CodeBlock

```tsx
import { CodeBlock } from '@jacshuo/onyx';

{/* 基础语法高亮 */}
<CodeBlock code={`const x = 42;`} language="typescript" />

{/* 显示行号 */}
<CodeBlock code={sourceCode} language="tsx" lineNumbers />

{/* 实时可编辑模式 */}
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
  { title: '大雄兔', src: 'https://example.com/bunny.mp4', subtitle: '开源动画' },
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
  onFileOpen={(f) => console.log('打开', f.name)}
  onDelete={(items) => console.log('删除', items)}
/>
```

---

## 键盘快捷键

### FileExplorer
| 按键 | 操作 |
|---|---|
| `点击` | 选中文件 |
| `Ctrl+点击` | 多选 |
| `Ctrl+A` | 全选 |
| `Delete` | 删除选中项（含确认对话框） |
| `Escape` | 清除选中 |
| `双击` | 打开文件 / 进入目录 |

### CinePlayer
| 按键 | 操作 |
|---|---|
| `空格` | 播放 / 暂停 |
| `←` / `→` | 快退 / 快进 ±5 秒 |
| `↑` / `↓` | 音量 ±5% |
| `F` | 切换全屏 |
| `C` | 切换影院模式 |
| `L` | 切换播放列表 |
| `M` | 静音 / 取消静音 |
| `N` | 下一曲 |
| `P` | 上一曲 |
| `S` | 切换随机播放 |

---

## 本地开发

```bash
# 安装依赖
npm install

# 启动演示站开发服务器（http://localhost:8080）
npm run dev

# 构建组件库产物（dist/）
npm run dist

# 构建演示站（dist-demo/）
npm run build:demo

# 类型检查
npm run typecheck
```

---

## 项目结构

```
OnyxUI/
├── src/
│   ├── components/      # 所有 React 组件
│   ├── lib/utils.ts     # cn() 工具函数（clsx + tailwind-merge）
│   └── styles/
│       ├── index.css    # 完整 CSS 入口（Tailwind + 所有 Token + 所有组件 CSS）
│       ├── base.css     # Tailwind + 核心 Token
│       ├── tokens.css   # @theme 语义 Token 与核心关键帧
│       ├── theme.ts     # CVA 变体定义
│       └── components/  # 按组件单独的 CSS（关键帧与设计 Token）
│           ├── CinePlayer.css
│           ├── MiniPlayer.css
│           ├── FileExplorer.css
│           └── FilmReel.css
├── demo/                # 演示站（GitHub Pages）
│   ├── App.tsx
│   ├── main.tsx
│   └── pages/           # 各组件演示页
├── .github/workflows/
│   ├── ci.yml           # PR/push：类型检查 + 构建
│   └── release.yml      # 手动触发：版本号更新 → npm → GitHub Release → Pages
├── dist/                # 组件库构建产物（ESM + CJS + DTS + CSS）
│   ├── *.js / *.cjs     # 按组件拆分的入口文件
│   ├── chunks/          # 共享代码（tsup 自动提取）
│   ├── styles.css       # 完整预编译 CSS 包
│   └── styles/          # 模块化 CSS 文件
└── dist-demo/           # 演示站构建产物
```

---

## 参与贡献

1. Fork 本仓库
2. 创建功能分支（`git checkout -b feature/my-feature`）
3. 提交你的更改（`git commit -m 'feat: 添加新组件'`）
4. 推送到分支（`git push origin feature/my-feature`）
5. 发起 Pull Request

---

## 许可证

[MIT](./LICENSE) © Shuo Wang
