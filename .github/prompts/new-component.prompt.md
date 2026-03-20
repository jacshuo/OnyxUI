---
description: "Gather requirements for a new UI component and delegate to Onyx Component Expansion Agent. Use to start any new component implementation."
name: "New Component"
argument-hint: "Component name and brief description"
agent: "Onyx Component Expansion Agent"
---
Fill in the details below, then I'll delegate to the Component Expansion Agent to implement end-to-end.

---

**Component name:** <!-- e.g. ColorPicker -->

**What does it do?**
<!-- Brief description of the component's purpose and core behavior -->

**Key props / API surface:**
<!-- List the main props, their types, and default values if known -->
<!-- Example:
- value: string — current color value
- onChange: (value: string) => void — change handler
- format?: 'hex' | 'rgb' — color format, default 'hex'
-->

**Variants / modes / states:**
<!-- List visual variants, modes, or states the component should support -->
<!-- Example: disabled, readonly, error, sizes (sm/md/lg) -->

**Interactions:**
<!-- Describe desktop and mobile interactions -->
<!-- Example: click to open picker, keyboard arrow navigation, touch swipe -->

**Demo category suggestion:**
<!-- Primitives / Layout / Data Display / Navigation / Disclosure / Overlay / Feedback / Extras -->
<!-- Leave blank if unsure — the agent will decide and confirm -->

**Acceptance criteria / constraints:**
<!-- Any specific behavior, accessibility, or style requirements -->
<!-- Example: must meet WCAG AA contrast, must not introduce new dependencies -->

---

> The agent will confirm the demo category, then implement the component, demo page, exports, and unit tests — and run build + tests before finishing.
