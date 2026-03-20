---
description: "Run release preflight checks and trigger a new version release via GitHub Actions. Delegates to Onyx Release Orchestrator Agent. Use when ready to publish a new patch, minor, or major version."
name: "Quick Release"
argument-hint: "Bump type: patch / minor / major"
agent: "Onyx Release Orchestrator Agent"
---
#tool:read_file [package.json](../../package.json)
#tool:read_file [CHANGELOG.md](../../CHANGELOG.md)

Initiate a release for this repository.

---

**Bump type:** <!-- patch / minor / major -->

**Release notes summary (optional):**
<!-- Brief description of what's in this release, used to verify CHANGELOG alignment -->

---

The Release Orchestrator Agent will:

1. **Preflight checks:**
   - Verify `CHANGELOG.md` has a new entry since the last release
   - Verify the top CHANGELOG version matches the target release version (and prompt you to fix or create it if not)
   - Run `npm test`, `npm run build`, `npm run typecheck`
   - Verify `gh auth status`

2. **Confirmation:** Present a go/no-go summary and ask for your explicit approval before triggering anything.

3. **Trigger:** Run the GitHub Actions `Release` workflow with the specified bump type.

4. **Monitor:** Track progress until the workflow completes successfully.

5. **Report:** Provide the final release tag, npm version, and workflow run URL.

> No code will be pushed or workflow triggered without your explicit "yes".
