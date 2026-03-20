---
name: changelog-writer
description: "Write, format, and insert CHANGELOG.md entries following Keep a Changelog conventions and SemVer. Use for: adding new changelog entries after component changes, bug fixes, refactors, or dependency updates; formatting entries correctly; inserting a version section for an upcoming release; reviewing and cleaning up existing changelog content. Keywords: changelog, CHANGELOG, release notes, version entry, Keep a Changelog, semver."
argument-hint: "Describe what changed (feature/fix/refactor/deps) and the version if known. Or say 'review' to audit existing entries."
user-invocable: true
---
# Changelog Writer

Writes and inserts well-formatted `CHANGELOG.md` entries following [Keep a Changelog](https://keepachangelog.com) conventions.

## When to Use
- After a bug fix, enhancement, new component, refactor, or dependency update
- Before a release when the version section needs to be created or verified
- When existing changelog entries need formatting cleanup

## Changelog Format

This project follows **Keep a Changelog** with **SemVer** headings:

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added
- Short description of new feature or component

### Changed
- Short description of changed behavior or API

### Fixed
- Short description of bug fix

### Removed
- Short description of removed feature (use sparingly)

### Security
- Vulnerability or dependency security fix

### Dependencies
- Upgraded X from vA to vB (fixes CVE-XXXX-XXXX)
```

**Rules:**
- Only include sections that have entries — omit empty sections.
- One bullet per change; keep each bullet under ~120 characters.
- Use imperative present tense: "Add", "Fix", "Upgrade" — not "Added", "Fixed".
- Reference component name, prop name, or affected area in the bullet.
- The most recent version is always at the TOP of the file.

## Procedure

### 1. Determine the version
- Read `package.json` → `version` field for the current version.
- If entries are for the current (unreleased) version, use that version number.
- If the version hasn't been bumped yet, use a `[Unreleased]` heading or the expected next version.

### 2. Classify the change type
Map the change to the correct section:

| Change | Section |
|---|---|
| New component, prop, or API | `Added` |
| Behavior or visual update | `Changed` |
| Bug fix | `Fixed` |
| API removal or deprecation | `Removed` |
| Security or vulnerability fix | `Security` |
| npm dependency upgrade/fix | `Dependencies` |

### 3. Draft the entry
- Start with the affected scope in bold if applicable: `**Button**:`, `**Header**:`, `**deps**:`
- Follow with a short imperative description.
- Example: `- **Button**: add \`loading\` prop with spinner animation`

### 4. Insert into CHANGELOG.md
- Find the existing section for the target version or create one at the top.
- Append bullet under the correct sub-section.
- If creating a new version section, insert it above the previous most-recent version.

### 5. Verify
- Confirm the file starts with the target version at the top.
- Confirm no empty sections remain.
- Confirm formatting is consistent with existing entries.
