# ServicePulse

Two independent packages — `backend/` (NestJS 11 API) and `frontend/` (React 19 + Vite SPA). No root workspace: each package has its own `package.json`, `node_modules`, and lockfile. Run every command from the package directory.

## Backend (`backend/`)

- NestJS 11 + Prisma 7 on SQLite. Entry: `src/main.ts`, default port 3000. `PrismaModule` and `SharedModule` are `@Global()`.
- **Fresh clone requires `npx prisma generate` first.** The Prisma client is generated into `src/generated/prisma/`, which is gitignored, yet source imports it directly (e.g. `src/generated/prisma/client`, `src/generated/prisma/models/...`). Build/lint/tests fail without it.
- Prisma uses `prisma.config.ts` (Prisma 7 style). The schema `prisma/schema.prisma` has **no `url`** — `DATABASE_URL="file:./dev.db"` is defined in `backend/.env`, and the DB file is `backend/dev.db`. Migrations live in `prisma/migrations/`; add to the schema with `npx prisma migrate dev`.
- Commands: `npm run start:dev` (watch), `npm run test` (unit; jest on `src/**/*.spec.ts`), `npm run test:e2e`, `npm run lint`, `npm run build`.
- `npm run lint` auto-fixes (`eslint --fix`) and uses type-aware rules (`recommendedTypeChecked`) that typecheck all TS, including the generated client.
- Domain: CSV upload maps to `SurveyResponse` rows. Core logic is `src/uploads/uploads.service.ts`: headers are lowercased and accent-stripped (`NFD`), matched against Portuguese aliases (`protocolo`, `contato`, `responsavel`, `canal`, `data do contato`, ...); statuses parse from PT (`enviada` → SENT, `respondida` → ANSWERED, `nao respondida` → UNANSWERED). Preserve this mapping and the `CsvParserService` latin1/utf-8 fallback.
- Structural quirk: `backend/common/prisma/prisma.module.ts` lives **outside** `src/` (top-level `common/`), while the service is at `src/common/prisma/prisma.service.ts`; the module imports it via `../../src/...`. Note `PrismaService` instantiates `PrismaClient` with the better-sqlite3 driver adapter and reads `DATABASE_URL` from env.
- Mid-development state: `src/app.module.ts` imports nothing yet (uploads/shared not wired), and `main.ts` has no CORS or global validation pipes. `MetricsService` (`src/shared/services/metrics.service.ts`) computes response rate / satisfaction index.
- Backend tests currently cover only `app.controller.spec.ts`; e2e spec is `test/app.e2e-spec.ts` (config `test/jest-e2e.json`).

## Frontend (`frontend/`)

- Vite 8 + React 19 + TS with MUI 9, TanStack Query/Table, axios, react-router, recharts.
- Commands: `npm run dev`, `npm run build` (runs `tsc -b && vite build`), `npm run lint`, `npm run preview`. No test runner configured.
- Currently just the Vite starter template — `src/App.tsx` is untouched boilerplate and there is no API wiring yet.
