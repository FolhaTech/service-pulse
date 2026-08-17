# ServicePulse

Two independent packages — `backend/` (NestJS 11 API) and `frontend/` (React 19 + Vite SPA). No root workspace: each package has its own `package.json`, `node_modules`, and lockfile. Run every command from the package directory.

## Backend (`backend/`)

- NestJS 11 + Prisma 7 on SQLite. Entry: `src/main.ts`, default port 3000. `PrismaModule` and `SharedModule` are `@Global()`.
- **Fresh clone requires `npx prisma generate` first.** The Prisma client is generated into `src/generated/prisma/`, which is gitignored, yet source imports it directly (e.g. `src/generated/prisma/client`, `src/generated/prisma/models/...`). Build/lint/tests fail without it.
- Prisma uses `prisma.config.ts` (Prisma 7 style). The schema `prisma/schema.prisma` has **no `url`** — `DATABASE_URL="file:./dev.db"` is defined in `backend/.env`, and the DB file is `backend/dev.db`. Migrations live in `prisma/migrations/`; add to the schema with `npx prisma migrate dev`.
- Commands: `npm run start:dev` (watch), `npm run test` (unit; jest on `src/**/*.spec.ts`), `npm run test:e2e`, `npm run lint`, `npm run build`.
- `npm run lint` auto-fixes (`eslint --fix`) and uses type-aware rules (`recommendedTypeChecked`) that typecheck all TS, including the generated client.
- `main.ts` already enables CORS, a global `ValidationPipe` (`whitelist + transform`), shutdown hooks, and Swagger/Scalar docs served at `/docs`. `app.module.ts` wires `ConfigModule` (global), `PrismaModule`, `SharedModule`, `UploadsModule`.
- Domain: CSV upload maps to `SurveyResponse` rows. Core logic is `src/uploads/uploads.service.ts`: headers are lowercased and accent-stripped (`NFD`), matched against Portuguese aliases (`protocolo`, `contato`, `responsavel`, `data do contato`, ...); statuses parse from PT (`enviada` → SENT, `respondida` → ANSWERED, `nao respondida` → UNANSWERED). Preserve this mapping and the `CsvParserService` latin1/utf-8 fallback.
- Structural quirk: `backend/common/prisma/prisma.module.ts` lives **outside** `src/` (top-level `common/`), while the service is at `src/common/prisma/prisma.service.ts`; the module imports it via `../../src/...`. Note `PrismaService` instantiates `PrismaClient` with the better-sqlite3 driver adapter and reads `DATABASE_URL` from env.
- Backend tests currently cover only `app.controller.spec.ts`; e2e spec is `test/app.e2e-spec.ts` (config `test/jest-e2e.json`). `MetricsService` (`src/shared/services/metrics.service.ts`) computes response rate / satisfaction index.

## Frontend (`frontend/`)

- Vite 8 + React 19 + MUI 9 + react-router 7, TanStack Query/Table, axios, recharts. No test runner configured.
- Commands: `npm run dev`, `npm run build` (runs `tsc -b && vite build`), `npm run lint`, `npm run format` / `npm run format:check` (Prettier; devDependency).
- Product is the **Juridico Analytics MVP** (mirrors the Google Stitch design system "Lexis Clarity", navy `#1e3a8a`). Routes in `src/App.tsx`: `/analytics/dashboard`, `/analytics/import`, `/analytics/audits`.
- Feature-based architecture, no API layer yet:
  - `src/shared/components/layout/` — `AppShell` (wraps `Header` + `Sidebar`, exports `DRAWER_WIDTH = 260`), navigation paths are hardcoded to `/analytics/*`. Keep header/sidebar text PT and nav in sync with `App.tsx` routes.
  - `src/shared/components/ui/` — **domain-agnostic** design system: `DataTable<T>` (declarative `DataTableColumn<T>` with `render`), `KpiCard`, `PageHeader`, `FilterBar`, `StatusBadge`. Rule: a component used by 2+ features moves here; single-feature components stay in the feature.
  - `src/features/analytics/` — domain components (know about atendentes/avaliações): `AgentPerformanceTable`, `AttentionPanel`, `RatingDistribution`, `EvolutionChart`, pages (`DashboardPage`, `ImportPage`, `AuditPage`), `useDashboardFilters` hook, types in `types/analytics.ts`.
  - No backend wiring: pages render local constants and `useState`-based hooks as stubs. Do not add axios/fetch/mock services while scaffolding UI; expose typed contracts instead.
- Theme is `src/shared/theme.ts` (imported by `src/main.tsx`).
- Strict TS quirks (build fails otherwise): `verbatimModuleSyntax` → use `import type` for types; `erasableSyntaxOnly` → **no TS enums**, use `const` object + union of literals; `noUnusedLocals`/`noUnusedParameters` enabled.
- MUI 9 notes: icon names that changed (use `Help`, `Person`, `NotificationsNone`; `HelpOutline`/`PersonOutline` no longer exist); `Grid` uses the new `size={{ xs, sm, lg }}` prop, not `item`/`xs`; put spacing/layout props in `sx` (e.g. `Stack`/`Typography` reject direct `mt`/`justifyContent`/`fontWeight` props in v9 typings).
- UI copy is Portuguese (identifiers and filenames stay English). No image assets remain from the Vite starter; `src/index.css` only resets margin/min-height for MUI.