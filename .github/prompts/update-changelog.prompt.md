---
description: "Write or insert a CHANGELOG.md entry for a completed change. Use after any component addition, enhancement, bug fix, refactor, or dependency update to produce a correctly formatted entry."
name: "Update Changelog"
argument-hint: "Describe the change: type (fix/feat/refactor/deps), scope, and what changed"
---
#tool:read_file [CHANGELOG.md](../../CHANGELOG.md)
#tool:read_file [package.json](../../package.json)

Using the `/changelog-writer` skill, write a new CHANGELOG entry for the following change and insert it into `CHANGELOG.md`:

**Change type:** <!-- Added / Changed / Fixed / Removed / Security / Dependencies -->

**Scope / component:** <!-- e.g. Button, Header, deps -->

**Description:**
<!-- What changed? Be concise and imperative: "Add loading prop with spinner", "Fix dropdown z-index on iOS" -->

**Version:** <!-- Leave blank to use current package.json version -->

---

The skill will:
1. Determine the correct version section (current or Unreleased).
2. Draft a bullet using Keep a Changelog conventions.
3. Insert it into the correct section — creating a new version heading if needed.
4. Show you the final result for confirmation before saving.
