---
description: "Describe an enhancement or iteration task for an existing UI component or demo page, then delegate to Onyx Component Enhancer Agent."
name: "Enhance Component"
argument-hint: "Component name and what to change"
agent: "Onyx Component Enhancer Agent"
---
Fill in the details below, then I'll delegate to the Component Enhancer Agent.

---

**Target component or area:**
<!-- e.g. Button, HeaderPage, App.tsx navigation -->

**What needs to change?**
<!-- Describe the desired behavior, API addition, visual improvement, or demo update -->

**New / changed props (if any):**
<!-- List new props, changed defaults, or deprecated props -->
<!-- Example:
- loading?: boolean — show spinner, default false
- iconPosition?: 'left' | 'right' — default 'left'
-->

**Backward compatibility requirement:**
<!-- Should existing usage continue to work without changes? (default: yes) -->
<!-- If breaking changes are acceptable, describe why -->

**Acceptance criteria:**
<!-- How will you know it's done correctly? -->
<!-- Example: spinner visible during loading state; existing Button tests still pass -->

**Scope limits (what NOT to change):**
<!-- Anything that should be explicitly left untouched -->

---

> The agent will confirm assumptions for any ambiguous points, implement the minimal change, update tests, run the quality gate (build + test + dev), and suggest a CHANGELOG entry when done.
