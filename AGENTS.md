# AGENTS GUIDE

This repository is a Vue 3 + Element Plus admin dashboard inspired by V2Board. This guide gives agentic contributors the commands they need, a quick architectural map, and the implicit style expectations that keep the UI consistent and reliable.

## 1. Commands

### Environment setup
- `npm install` (or `bun install`/`pnpm install` once their lockfiles exist) to install dependencies listed in `package.json`.
- Re-run install whenever `package.json`, `package-lock.json`, or `bun.lock` changes.

### Development server
- `npm run dev` starts Vite with HMR on the default port (5173). Add `-- --host 0.0.0.0 --port <port>` to bind elsewhere.
- Pass `VITE_API_BASE_URL`/`VITE_DASHBOARD_SECURE_PATH` via `.env` or `env` prefix when hitting a real backend; defaults point to `https://example.invalid`.

### Production build
- `npm run build` produces the optimized bundle inside `dist/`.
- `npm run preview` serves the production build for local verification.
- Inspect `dist/assets` after building to ensure hashed JS/CSS files ship expected size and there are no missing chunks.

### Testing & validation
- No lint/test scripts are defined yet. When tests arrive, run `npx vitest run path/to/file.test.js` (or `vitest run`) to target a single spec.
- Consider `vitest --watch` for iterative development and `vitest --runInBand` for deterministic execution.
- Add linting (ESLint + Prettier) before expanding the codebase; keep rules compatible with Vue 3 and script setup syntax.

## 2. Architectural orientation
- Entry: `src/main.js` wires Vue, Pinia, Element Plus, and the router before mounting to `#root`.
- Router: `src/router/index.js` defines the login route plus the admin shell (`AdminLayout.vue`) with child pages (`DashboardPage`, `UsersPage`, etc.).
- Layout: `AdminLayout.vue` renders the sidebar/navigation cards with computed menu items.
- Services: `src/services/*` compose API URLs (`buildDashboardApiUrl`, `buildCommonApiUrl`), add `t` query stamps, and centralize fetch logic.
- Stores: Pinia stores under `src/stores` (admin, auth) manage state, call services, and expose reactive refs for pages and components.
- Components: Organized under `src/components/dashboard`, `src/components/settings`, and `src/components/common` by concern, each focusing on a single dashboard card or shared widget.

## 3. Code style guidelines

### Imports & modules
- Stick to ESM syntax (`import ... from ...`). External libs (Vue/Pinia/Element Plus) appear first, then internal services/stores, and finally local components.
- Prefer relative paths that climb at most two levels when possible; avoid deep `../../../` chains by reorganizing directories or creating index files.
- Keep `import` order alphabetical within each group for readability.

### Formatting & whitespace
- Use two spaces for indentation in `.vue`, `.js`, and `.css` files.
- Use single quotes in scripts unless the string contains an apostrophe; templates may use double quotes for attributes for legibility.
- Keep template attributes wrapped across lines once there are three or more props/events; align the continuation for each attribute (same column indentation).
- Break up long method chains (filters, computed maps) with line breaks after each chained call.

### Naming conventions
- Vue components/pages: PascalCase (e.g., `DashboardPage`, `IncomeOverviewCard`). File names match the component names.
- Stores/composables: `useXyzStore` (e.g., `useAdminStore`, `useAuthStore`).
- Reactive refs, methods, helpers: camelCase (`dashboardStatsLoading`, `formatDateValue`).
- Props/events in templates: kebab-case (`@change-range`, `:overview`).
- Constants that truly never change outside module scope may stay `UPPER_SNAKE_CASE` (e.g., `DEFAULT_API_ORIGIN`).

### Vue-specific patterns
- Prefer `<script setup>` whenever the component can be expressed declaratively; only fall back to `defineComponent` when you need to expose options.
- Call Pinia stores at the top of `<script setup>` (`const adminStore = useAdminStore()`) and avoid referencing them directly inside template logic (prefer computed helpers if necessary).
- Keep templates lean by offloading rich logic to components or composables; use slots for repeating structures (e.g., cards with alerts).

### Error handling & API calls
- Wrap every async call in `try/catch`; set dedicated error refs (e.g., `dashboardStatsError.value`) and show `el-alert` messages when an error string exists.
- Inspect response status before parsing JSON and throw informative `Error` instances when things fail (`throw new Error('登录失败，请检查邮箱或密码')`).
- Default to safe placeholder data via helper factories (`createEmptyIncomeOverview`, `createEmptyQueueStats`) so components never render `undefined`.
- When a response returns `{ status, message }`, consider both `status !== 'success'` and numeric `code !== 0` before accepting the payload.

### Types & declarations
- Use `const` for values that never reassign (presets, static navigation arrays, plan samples) and `let` only when reassignment is needed (e.g., temporary formatting variables).
- Represent repeated UI structures through data arrays/objects rather than duplicating markup; templates loop over the data and render cards.
- Keep helper functions pure and referentially transparent; prefer parameterized factories over shared mutable state.

### Styling & CSS
- Global styles live in `src/styles.css`; local component styles (when needed) should use `<style scoped>` to prevent bleeding.
- Favor CSS custom properties for theming (define colors/spacing once and reuse). Keep layout consistent: grid/stack classes (`page-stack`, `hero-grid`).
- When adding new cards, maintain the same class names and Element Plus variants (`el-alert`, `el-card`, `el-table`) already used.

## 4. Contributing pointers for agents
- When adding new data tables, build dedicated services that return normalized data and expose loading/error refs from Pinia stores.
- Enhance existing cards by creating single-responsibility components and wiring props/events explicitly (no implicit global state).
- Always validate new API endpoints with Postman/cURL and reflect required headers (authorization) in the service helpers.
- Keep translations or copy in plain text for now but consider centralizing into a future `i18n` solution.

## 5. Cursor/Copilot guidance
- There are no `.cursor` or `.cursorrules` files in this repo, and no `.github/copilot-instructions.md` exists at the moment. Follow general repository conventions until specific cursor/Copilot guidance is supplied.

## 6. Next steps for agents
- Run the dev server, explore each view, and identify gaps where more tests or validation would help.
- When introducing shared logic (e.g., new service functions), ensure their formatting/naming align with the guidelines above.
- Consider augmenting this guide if new architectural patterns are introduced.
