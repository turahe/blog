# Biome Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace ESLint and Prettier with Biome for lint + format while keeping Prettier-equivalent style and `npm run lint` in CI.

**Architecture:** Add `@biomejs/biome` and `biome.json` matching current Prettier options; retarget npm scripts and lint-staged; remove ESLint/Prettier packages and configs; one-time `biome check --write` normalize; fix remaining diagnostics until lint is clean.

**Tech Stack:** `@biomejs/biome`, existing Husky + lint-staged, GitHub Actions via `npm run lint`.

**Spec:** `docs/superpowers/specs/2026-07-17-biome-migration-design.md`

## Global Constraints

- Replace both ESLint and Prettier (full swap).
- Drop `prettier-plugin-tailwindcss` (no Tailwind class sorting in this migration).
- Lint target remains `src` (`biome check src`).
- Format is repo-wide with ignores (`biome format`).
- Preserve style: no semicolons (`asNeeded`), single quotes, line width 100, 2-space indent, trailing commas `es5`.
- Do not newly lint `__tests__` / `tests` / `scripts` in the first pass.
- CI keeps calling `npm run lint` (no workflow command rename required).

## File Structure

| File | Responsibility |
| --- | --- |
| `biome.json` | Formatter + linter + ignores |
| `package.json` | Scripts, deps, lint-staged |
| `package-lock.json` | Lockfile after install/uninstall |
| `eslint.config.mjs` | Delete |
| `prettier.config.js` | Delete |
| `README.md` | Badges |
| `src/lib/mdx/options.ts`, `src/components/admin/editor/PostSettingsPanel.tsx`, `src/components/Link.tsx`, `src/app/seo.tsx`, `jest.setup.js` | Remove/replace eslint comments |

---

### Task 1: Install Biome and add `biome.json`

**Files:**
- Create: `biome.json`
- Modify: `package.json` (add `@biomejs/biome` only in this task — or install via npm)
- Modify: `package-lock.json`

**Interfaces:**
- Produces: working `npx biome --version` and a valid `biome.json`

- [ ] **Step 1: Install Biome**

```bash
npm install -D @biomejs/biome
```

Expected: `@biomejs/biome` appears under `devDependencies`.

- [ ] **Step 2: Create `biome.json`**

Create `biome.json` at the repo root:

```json
{
  "$schema": "https://biomejs.dev/schemas/2.0.0/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "files": {
    "ignoreUnknown": true,
    "includes": ["**/*"],
    "excludes": [
      "**/node_modules",
      "**/.next",
      "**/out",
      "**/dist",
      "**/build",
      "**/coverage",
      "**/__tests__",
      "**/tests",
      "**/src/generated",
      "**/scripts",
      "**/cache",
      "**/.docker",
      "**/.worktrees",
      "**/playwright-report",
      "**/test-results",
      "**/package-lock.json"
    ]
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "semicolons": "asNeeded",
      "trailingCommas": "es5",
      "bracketSpacing": true
    }
  },
  "json": {
    "formatter": {
      "trailingCommas": "none"
    }
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "correctness": {
        "noUnusedVariables": "warn",
        "noUnusedImports": "warn"
      },
      "suspicious": {
        "noExplicitAny": "off"
      },
      "style": {
        "noNonNullAssertion": "off"
      },
      "a11y": {
        "useValidAnchor": "off"
      }
    }
  },
  "assist": {
    "enabled": true,
    "actions": {
      "source": {
        "organizeImports": "on"
      }
    }
  }
}
```

If Biome rejects `$schema` version or `files.excludes` key name for the installed major version, adjust to that version’s schema (`files.ignore` vs `excludes`, etc.) using `npx biome rage` / docs — keep the same ignore list and formatter semantics.

- [ ] **Step 3: Smoke-check Biome reads config**

```bash
npx biome check src --max-diagnostics=5
```

Expected: runs (may report many errors — OK). Must not fail with “invalid configuration” only. If config invalid, fix `biome.json` before committing.

- [ ] **Step 4: Commit**

```bash
git add biome.json package.json package-lock.json
git commit -m "$(cat <<'EOF'
chore: add Biome with Prettier-compatible config

Introduce @biomejs/biome and biome.json ahead of removing ESLint/Prettier.
EOF
)"
```

---

### Task 2: Retarget scripts and remove ESLint/Prettier packages

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Delete: `eslint.config.mjs`
- Delete: `prettier.config.js`

**Interfaces:**
- Consumes: `biome.json` from Task 1
- Produces: scripts that invoke Biome; no eslint/prettier deps

- [ ] **Step 1: Update `package.json` scripts and lint-staged**

Replace these script values:

```json
"lint": "biome check src",
"lint:fix": "biome check --write src",
"format": "biome format --write .",
"format:check": "biome format .",
"format:lint": "npm run format && npm run lint:fix",
```

Leave `validate` as `npm run lint && npm run typecheck && npm run test`.

Replace `lint-staged` with:

```json
"lint-staged": {
  "*.{js,jsx,ts,tsx,json,css,md,mdx}": [
    "biome check --write --files-ignore-unknown=true --no-errors-on-unmatched"
  ]
}
```

- [ ] **Step 2: Remove ESLint/Prettier dependencies**

```bash
npm uninstall \
  eslint \
  eslint-config-next \
  eslint-config-prettier \
  eslint-plugin-jsx-a11y \
  eslint-plugin-prettier \
  @eslint/eslintrc \
  @eslint/js \
  @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser \
  prettier \
  prettier-plugin-tailwindcss \
  globals
```

Also remove from `package.json` `overrides` the entries:

```json
"@typescript-eslint/eslint-plugin": "^8.61.1",
"@typescript-eslint/parser": "^8.61.1",
```

Leave other overrides untouched.

- [ ] **Step 3: Delete old config files**

```bash
rm eslint.config.mjs prettier.config.js
```

- [ ] **Step 4: Verify package.json no longer references eslint/prettier**

```bash
node -e "const p=require('./package.json'); const s=JSON.stringify(p); if(/eslint|prettier/i.test(s)) { console.error(s.match(/eslint|prettier/gi)); process.exit(1) } console.log('clean')"
```

Expected: `clean` (allow Biome itself only — should not match). If `format:lint` or comments still say prettier, fix.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json
git add -u eslint.config.mjs prettier.config.js
git commit -m "$(cat <<'EOF'
chore: switch lint/format scripts from ESLint/Prettier to Biome

Remove ESLint and Prettier dependencies and configs; wire lint-staged to Biome.
EOF
)"
```

---

### Task 3: Normalize formatting and clear auto-fixable issues

**Files:**
- Modify: many under `src/` (and other formatted files) via Biome write
- Modify eslint-comment sites listed below

**Interfaces:**
- Consumes: Biome scripts from Task 2

- [ ] **Step 1: Remove obsolete ESLint comments**

In these files, delete the eslint comment lines (keep surrounding code):

1. `src/lib/mdx/options.ts` — remove `// eslint-disable-next-line @typescript-eslint/no-explicit-any`
2. `src/components/admin/editor/PostSettingsPanel.tsx` — same
3. `src/app/seo.tsx` — same
4. `src/components/Link.tsx` — remove `/* eslint-disable jsx-a11y/anchor-has-content */`
5. `jest.setup.js` — remove `/* eslint-env jest */` (file is ignored by Biome lint scope for `src`, but comment is dead)

If Biome later flags `any`, keep `noExplicitAny` off (already in `biome.json`).

- [ ] **Step 2: Format repo + auto-fix `src`**

```bash
npm run format
npm run lint:fix
```

Expected: writes complete. May still leave non-auto-fixable diagnostics.

- [ ] **Step 3: Commit formatting**

```bash
git add -A
git status
git commit -m "$(cat <<'EOF'
style: apply Biome format and safe autofixes

Normalize the tree to Biome formatter output after the ESLint/Prettier removal.
EOF
)"
```

If there is nothing to commit, skip with a note in the task report.

---

### Task 4: Make `npm run lint` clean

**Files:**
- Modify: whatever `biome check src` still flags (source only)
- Possibly: `biome.json` rule tweaks if a rule is noisy and conflicts with established Next patterns (prefer fixing code; only disable with a one-line comment in the commit message why)

**Interfaces:**
- Success = `npm run lint` exit code 0

- [ ] **Step 1: Capture remaining diagnostics**

```bash
npm run lint 2>&1 | tee /tmp/biome-lint.txt; echo EXIT:$?
```

- [ ] **Step 2: Fix diagnostics until clean**

For each error group:

- Prefer code fix
- For Next `Link` / anchor a11y false positives: adjust `a11y` rules in `biome.json` (already has `useValidAnchor: off`; extend similarly if needed)
- Do not reintroduce ESLint

Re-run:

```bash
npm run lint
```

Expected: EXIT 0

- [ ] **Step 3: Verify format check**

```bash
npm run format:check
```

Expected: EXIT 0 (or format any stragglers and re-check)

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
fix: resolve Biome lint findings in src

Get npm run lint green under the new Biome configuration.
EOF
)"
```

---

### Task 5: Docs + final verification

**Files:**
- Modify: `README.md` (badges section)

- [ ] **Step 1: Update README badges**

Replace the ESLint and Prettier badge lines with a single Biome badge, for example:

```markdown
[![Biome](https://img.shields.io/badge/Biome-Lint_&_Format-60A5FA?style=for-the-badge&logo=biome)](https://biomejs.dev/)
```

Remove the old ESLint and Prettier badge lines.

- [ ] **Step 2: Final verification commands**

```bash
npm run lint
npm run format:check
node -e "const p=require('./package.json'); const d={...p.dependencies,...p.devDependencies}; const bad=Object.keys(d).filter(k=>/eslint|prettier/i.test(k)); if(bad.length){console.error(bad);process.exit(1)}; console.log('deps clean')"
grep -n "npm run lint" .github/workflows/*.yml
```

Expected:

- lint exit 0
- format:check exit 0
- `deps clean`
- CI workflows still reference `npm run lint`

- [ ] **Step 3: Commit README (and any leftover fixes)**

```bash
git add README.md
git commit -m "$(cat <<'EOF'
docs: point README badges at Biome

Reflect the ESLint/Prettier replacement in project badges.
EOF
)"
```

---

## Plan self-review

| Spec requirement | Task |
| --- | --- |
| Add Biome + config matching Prettier | 1 |
| Scripts lint/format/format:lint | 2 |
| Remove ESLint/Prettier deps + configs | 2 |
| lint-staged → Biome | 2 |
| Ignore tests/scripts/generated | 1 (`biome.json`) |
| Clean eslint comments | 3 |
| One-time normalize | 3 |
| Lint clean | 4 |
| README badges | 5 |
| CI keeps `npm run lint` | 2 + 5 verify |
| No Tailwind sorter | intentional omission |

No TBD placeholders. Schema key names may need a one-line adjust for installed Biome major — Task 1 Step 2 documents that escape hatch.
