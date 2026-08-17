# ServicePulse — Frontend

SPA em **React 19 + Vite 8 + TypeScript** com **Material UI 9**, que implementa o **Juridico Analytics MVP** — a plataforma de análise de avaliações de atendimento da Assistência Jurídica (design system "Lexis Clarity", azul-marinho `#1e3a8a`).

O frontend consome a API descrita em [../backend/README.md](../backend/README.md), mas **ainda não possui camada de API**: as telas renderizam dados locais e hooks com `useState` como stubs, com contratos tipados prontos para plugar o backend.

## Stack

| Camada | Tecnologia |
|--------|------------|
| Build | Vite 8 (`tsc -b && vite build`) |
| UI | React 19 + Material UI 9 (`@mui/material`, `@mui/icons-material`) + Emotion |
| Roteamento | React Router 7 |
| Dados (futuro) | TanStack Query 5, TanStack Table 9, axios, recharts (instalados) |
| Lint/Format | ESLint 10 (flat config) + Prettier 3 |

## Pré-requisitos

- Node.js 20+ (projeto usa TypeScript 6.0, Vite 8)
- npm

## Configuração inicial

```bash
# 1. Instalar dependências
npm install

# 2. Subir em modo desenvolvimento (HMR)
npm run dev
```

> Este pacote é independente: tem o próprio `package.json`, `node_modules` e lockfile. Rode os comandos a partir da pasta `frontend/`.

## Comandos

```bash
npm run dev           # servidor de desenvolvimento (Vite)
npm run build         # typecheck (tsc -b) + build de produção (vite build) → dist/
npm run lint          # ESLint (flat config)
npm run format        # Prettier --write . (formata todo o repositório)
npm run format:check  # Prettier --check .
npm run preview       # serve o build de produção localmente
```

Não há runner de testes configurado no frontend.

## Rotas

Definidas em `src/App.tsx`:

| Rota | Tela |
|------|------|
| `/` | redireciona para `/analytics/dashboard` |
| `/analytics/dashboard` | Dashboard — Saúde dos Atendimentos |
| `/analytics/import` | Importar dados — upload de CSV |
| `/analytics/audits` | Auditoria de avaliações |
| `*` | redireciona para `/analytics/dashboard` |

As rotas são espelhadas na navegação lateral (`Sidebar`) e no botão "Importar CSV" do `Header` — mantenha os paths em sincronia com `App.tsx`.

## Arquitetura

Arquitetura **feature-based**, dividida em camadas reutilizáveis e de domínio:

```
src/
├── main.tsx                     # entrypoint: ThemeProvider + CssBaseline + BrowserRouter
├── App.tsx                      # rotas
├── index.css                    # reset mínimo (margin/min-height para MUI)
├── shared/
│   ├── theme.ts                 # tema MUI (Inter, navy #1e3a8a, bordas, variantes de título)
│   └── components/
│       ├── layout/              # shell de aplicação
│       │   ├── AppShell.tsx     #   compõe Header + Sidebar + <main>, exporta DRAWER_WIDTH = 260
│       │   ├── Header.tsx       #   topbar (breadcrumb, busca, "Importar CSV", ações)
│       │   └── Sidebar.tsx      #   menu lateral (logo + navegação /analytics/*)
│       └── ui/                  # design system genérico (sem conhecimento de negócio)
│           ├── DataTable.tsx    #   tabela tipada com colunas declarativas
│           ├── KpiCard.tsx      #   cartão de métrica (tone: default/positive/critical)
│           ├── PageHeader.tsx   #   título + subtítulo + ações
│           ├── FilterBar.tsx    #   barra de filtros
│           └── StatusBadge.tsx  #   Chip de status
└── features/
    └── analytics/               # domínio (avaliações / atendentes)
        ├── components/          # AgentPerformanceTable, AttentionPanel,
        │                        # RatingDistribution, EvolutionChart
        ├── hooks/               # useDashboardFilters
        ├── pages/               # DashboardPage, ImportPage, AuditPage
        └── types/               # analytics.ts (DashboardMetric, AgentPerformance, ...)
```

### Regras de camada

- **`shared/ui`** recebe dados por props e **não conhece o domínio** (ex.: `DataTable<T>` não sabe o que é um "atendente").
- **`features/analytics`** conhece o domínio (ex.: `AgentPerformanceTable` sabe que "Índice < 4" é crítico).
- Um componente usado por **2+ features** sobe para `shared/ui`; componente de uma feature só permanece nela.

### Camada de dados

Por decisão de projeto, não existe `axios`/`fetch`/mock services no scaffolding atual. As páginas usam:

- Constantes locais de exemplo (arrays de `AgentPerformance`, `DashboardMetric`, etc.)
- Hooks de estado (`useDashboardFilters`) que expõem os contratos tipados

Para plugar o backend, substitua as constantes por chamadas (TanStack Query + axios) **sem alterar os props dos componentes**.

## Tema e design system

- Tema centralizado em `src/shared/theme.ts`, importado por `src/main.tsx`.
- Paleta: primária `#1e3a8a` (navy), fundo `#f8fafc`, erro `#ba1a1a`, aviso `#f59e0b`, fonte Inter.
- Todos os textos de interface estão em **português**; identificadores, arquivos e imports em inglês.

## Particularidades do TypeScript (build estrito)

O build falha se estas regras forem violadas (`tsconfig.app.json`):

- **`verbatimModuleSyntax`** — importações de tipos exigem `import type`.
- **`erasableSyntaxOnly`** — **proibido usar `enum` do TS**; use objeto `const` + union de literais.
- **`noUnusedLocals` / `noUnusedParameters`** — variáveis e parâmetros não usados quebram o build.
- **`noEmit`** — o Vite cuida do bundle; `tsc -b` é apenas typecheck.

## Particularidades do MUI 9

- **Ícones renomeados**: use `Help`, `Person`, `NotificationsNone` — `HelpOutline`/`PersonOutline` não existem mais.
- **`Grid`** usa a nova API `size={{ xs, sm, lg }}` — não usar `item`/`xs` antigos.
- **Props de layout vão em `sx`**: `Stack`/`Typography` rejeitam props diretas como `mt`, `justifyContent` ou `fontWeight` nas tipagens v9 (ex.: `sx={{ mt: 2 }}`).

## Adicionando uma nova tela

1. Crie o componente de página em `features/analytics/pages/` e exporte no `index.ts`.
2. Adicione a rota em `src/App.tsx` e o item de navegação na `Sidebar`.
3. Reutilize as peças de `shared/ui` (`PageHeader`, `DataTable`, `KpiCard`, `FilterBar`, `StatusBadge`) sempre que possível.
4. Mantenha os textos em português e os nomes técnicos em inglês.
5. Valide com `npm run lint && npm run format && npm run build`.