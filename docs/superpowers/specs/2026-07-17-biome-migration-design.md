# Replace ESLint + Prettier with Biome

**Date:** 2026-07-17  
**Status:** Approved for planning  
**Approach:** Full swap — Biome for lint and format

## Goal

Remove ESLint and Prettier from the blog repo and use Biome as the single lint + format tool, preserving current style conventions and CI/`npm run lint` entry points.

## Decisions (locked)

| Topic | Decision |
| --- | --- |
| Scope | Replace both ESLint and Prettier |
| Tailwind class sorting | Drop `prettier-plugin-tailwindcss` (no Biome equivalent in this migration) |
| Migration style | One-pass full swap (not gradual lint enablement) |
| Lint target | Keep primary lint scope on `src` (match current `eslint src`) |
| Format scope | Project-wide via Biome (with ignores) |

## Current state

- `eslint.config.mjs` — Flat ESLint 9 + TypeScript + jsx-a11y + prettier plugin
- `prettier.config.js` — `semi: false`, `singleQuote: true`, `printWidth: 100`, Tailwind plugin
- Scripts: `lint`, `lint:fix`, `format`, `format:check`, `format:lint`, `validate`
- lint-staged: eslint --fix + prettier --write
- CI workflows call `npm run lint` (`ci.yml`, `deploy.yml`, `static-export.yml`)

## Target architecture

### Package

- Add: `@biomejs/biome` (devDependency)
- Remove: `eslint`, `eslint-config-next`, `eslint-config-prettier`, `eslint-plugin-jsx-a11y`, `eslint-plugin-prettier`, `@eslint/*`, `@typescript-eslint/*`, `prettier`, `prettier-plugin-tailwindcss`, related `package.json` overrides for typescript-eslint

### Config: `biome.json`

**Formatter** (match Prettier):

- `semicolons`: `asNeeded` / off (no semicolons)
- `quoteStyle`: `single`
- `lineWidth`: `100`
- `indentStyle`: `space`
- `indentWidth`: `2`
- trailing commas: Biome equivalent of Prettier `es5`

**Linter:**

- Enable recommended rules
- Prefer warn (or off) for unused vars noise where Biome is stricter than current warn-level ESLint
- Allow Next.js patterns (e.g. `Link` / JSX a11y equivalents where Biome supports them; accept weaker a11y coverage vs `eslint-plugin-jsx-a11y`)

**Files / ignores:**

- Ignore: `node_modules`, `.next`, `out`, `dist`, `build`, `coverage`, `__tests__`, `tests`, `src/generated`, `scripts`, `cache`, Docker data, lockfiles as appropriate
- Align with current ESLint ignore list; do not newly lint ignored test trees in this migration unless trivial

### Scripts

| Script | New command |
| --- | --- |
| `lint` | `biome check src` |
| `lint:fix` | `biome check --write src` |
| `format` | `biome format --write .` |
| `format:check` | `biome format .` |
| `format:lint` | `npm run format && npm run lint:fix` (format repo-wide; lint-fix `src` only) |
| `validate` | still `lint && typecheck && test` |

### lint-staged

```json
"*.{js,jsx,ts,tsx,json,css,md,mdx}": [
  "biome check --write --files-ignore-unknown=true --no-errors-on-unmatched"
]
```

(Or Biome’s recommended lint-staged snippet; exact flags may follow Biome docs at implement time.)

### Code / docs cleanup

- Delete `eslint.config.mjs`, `prettier.config.js`
- Replace or remove `eslint-disable` / `eslint-env` comments (e.g. `src/lib/mdx/options.ts`, `jest.setup.js`)
- README badges: Biome instead of ESLint + Prettier
- CI: no workflow YAML command change required if `npm run lint` stays

### One-time normalize

- Run `biome check --write` (or format + lint fix) on in-scope files so the tree matches Biome formatter
- Fix remaining lint errors that `--write` cannot auto-fix until `npm run lint` is clean (or document intentional rule disables)

## Out of scope

- Restoring Tailwind class auto-sorting
- Migrating Jest/Playwright configs
- Enabling Biome on `__tests__` / `tests` / `scripts` in the first pass
- Changing TypeScript `tsc` / Prisma tooling

## Success criteria

- `npm run lint` and `npm run format:check` succeed via Biome
- No ESLint or Prettier packages remain in `package.json` / lockfile
- lint-staged and CI still work through the same script names
- Prettier style conventions preserved for day-to-day TS/JS/JSON/CSS/MD
