# ServicePulse — Backend

API REST em **NestJS 11** com **Prisma 7** sobre **SQLite**, responsável pelo importe e armazenamento de avaliações de atendimento do produto **Juridico Analytics** (pesquisas de satisfação exportadas do MktZap).

## Stack

| Camada | Tecnologia |
|--------|------------|
| Runtime | Node.js + TypeScript |
| Framework | NestJS 11 (`@nestjs/core`, `@nestjs/common`, `@nestjs/config`) |
| ORM | Prisma 7 (`prisma-client`, provider `sqlite`) |
| Driver | `@prisma/adapter-better-sqlite3` |
| Banco | SQLite (`backend/dev.db`) |
| Validação | `class-validator` + `class-transformer` (global `ValidationPipe`) |
| Upload | `multer` (multipart, limite 25 MB) |
| CSV | `csv-parse` (latin1/utf-8) |
| Docs | Swagger + Scalar (`@scalar/nestjs-api-reference` em `/docs`) |

## Pré-requisitos

- Node.js 20+ (projeto usa TypeScript 5.7, Jest 30, Nest 11)
- npm

## Configuração inicial

Como o projeto usa o estilo Prisma 7 (`prisma.config.ts`), o schema **não** define `url`. A variável `DATABASE_URL` precisa estar presente no ambiente.

```bash
# 1. Instalar dependências
npm install

# 2. Gerar o Prisma Client (obrigatório — o código importa de src/generated/prisma)
npx prisma generate

# 3. Definir as variáveis de ambiente (o repositório inclui backend/.env)
#    DATABASE_URL="file:./dev.db"

# 4. Aplicar migrations (cria backend/dev.db)
npx prisma migrate dev

# 5. Subir em modo desenvolvimento
npm run start:dev
```

> **Importante:** o Prisma Client é gerado em `src/generated/prisma/` (gitignored). Sem `npx prisma generate`, o build, o lint e os testes falham.

## Comandos

```bash
npm run start:dev      # modo desenvolvimento com watch
npm run start          # inicia sem watch
npm run start:prod     # executa dist/main (após build)
npm run build          # nest build → dist/
npm run lint           # eslint com --fix (type-aware)
npm run format         # prettier --write (src/ e test/)
npm test               # testes unitários (jest, src/**/*.spec.ts)
npm run test:watch     # jest --watch
npm run test:cov       # jest --coverage
npm run test:e2e       # testes e2e (test/jest-e2e.json)
```

## Arquitetura

```
backend/
├── common/prisma/           # PrismaModule (@Global) — fora de src/, intencional
│   └── prisma.module.ts     #   importa PrismaService via ../../src/...
├── prisma/
│   ├── schema.prisma        # schema sem url (DATABASE_URL vem do env)
│   └── migrations/          # migrations SQL aplicadas pelo prisma migrate
├── test/
│   ├── app.e2e-spec.ts      # teste e2e
│   └── jest-e2e.json
└── src/
    ├── main.ts              # bootstrap: CORS, ValidationPipe, shutdown hooks, /docs
    ├── app.module.ts        # ConfigModule (global) + PrismaModule + SharedModule + UploadsModule
    ├── app.controller.ts    # GET /
    ├── common/prisma/       # PrismaService (adapter better-sqlite3, lê DATABASE_URL)
    ├── generated/prisma/    # client gerado (gitignored)
    ├── shared/              # SharedModule (@Global)
    │   ├── services/csv-parser.service.ts   # parse latin1/utf-8
    │   └── services/metrics.service.ts      # taxa de resposta / índice de satisfação
    └── uploads/             # UploadsModule
        ├── uploads.controller.ts
        ├── uploads.service.ts
        └── uploads.module.ts
```

- `PrismaModule` e `SharedModule` são `@Global()`, disponíveis sem import.
- `ConfigModule` é global e carrega `backend/.env`.
- O `PrismaService` instancia `PrismaClient` com o adapter `@prisma/adapter-better-sqlite3` e lê `DATABASE_URL` do ambiente.

## Modelo de dados (Prisma)

`prisma/schema.prisma` define:

- **Upload** — registro de cada importação: `filename`, `rowCount`, `skipped`, `status` (`PROCESSING | COMPLETED | FAILED`).
- **SurveyResponse** — linha de avaliação: `protocol` (único), `contactedAt`, `sentAt`, `answeredAt`, `status` (`SENT | ANSWERED | UNANSWERED`), `score`, `scoreLabel` e relações com `Contact`, `Responsible`, `Channel`, `Survey`.
- **Contact / Responsible / Channel / Survey** — entidades de apoio criadas com `upsert` durante o import.

## Endpoints

### `GET /`

Resposta simples de health check (`Hello World`).

### `POST /uploads`

Importa um arquivo CSV (multipart, campo `file`, limite 25 MB).

```bash
curl -X POST http://localhost:3000/uploads \
  -F "file=@avaliacoes.csv"
```

Fluxo executado pelo `UploadsService.processCsv()`:

1. Cria um `Upload` com status `PROCESSING`.
2. Faz o parse do buffer (fallback latin1/utf-8 via `CsvParserService`).
3. Para cada linha, mapeia os campos por aliases em português, cria/atualiza `Responsible`, `Channel`, `Survey`, `Contact` (com cache em memória) e monta o `SurveyResponse`.
4. Descarta linhas sem `protocolo` e remove protocolos duplicados (`skipped`).
5. Grava com `createMany` e marca o `Upload` como `COMPLETED`.

### `GET /uploads`

Lista todas as importações ordenadas por data (`uploadedAt desc`).

## Mapeamento de campos do CSV

Os cabeçalhos são **minúsculos e sem acentos** (normalização `NFD`) e casados contra aliases:

| Campo do modelo | Aliases aceitos |
|-----------------|-----------------|
| `protocol` | `protocolo` |
| `contactName` | `contato` |
| `surveyName` | `pesquisa`, `nome da pesquisa`, `nome` |
| `channelName` | `canal` |
| `responsibleName` | `responsavel` |
| `contactedAt` | `data do contato` |
| `sentAt` | `enviado em` |
| `answeredAt` | `respondido em` |
| `score` | `nota` |
| `scoreLabel` | `rotulo da nota`, `classificacao`, `rotulo` |
| `status` | `status`, `situacao` |
| `phone` | `telefone`, `celular`, `fone` |

Status (parse do valor em português):

| Valor no CSV | `ResponseStatus` |
|--------------|------------------|
| `enviada` / `enviado` | `SENT` |
| `respondida` / `respondido` | `ANSWERED` |
| `nao respondida` / `nao respondido` | `UNANSWERED` |
| (outro) | `UNANSWERED` (padrão) |

Datas: aceita formato brasileiro `dd/mm/aaaa[ hh:mm]` ou datas ISO parseáveis. Notas: apenas dígitos (`parseScore`).

## Documentação da API

Com o servidor rodando, acesse:

- Swagger/Scalar UI: http://localhost:3000/docs

## Testes

Cobertura atual: `src/app.controller.spec.ts` (unit) e `test/app.e2e-spec.ts` (e2e). O Jest está configurado com `rootDir: src`, `testRegex: .*\.spec\.ts$` e transform `ts-jest`.

```bash
npm test
npm run test:e2e
```

## Observações de desenvolvimento

- `npm run lint` roda com `--fix` e usa regras type-aware (`recommendedTypeChecked`) que checam todo o TypeScript, inclusive o client gerado.
- `backend/.env` contém `DATABASE_URL="file:./dev.db"` — o arquivo de banco fica em `backend/dev.db`.
- Para evoluir o schema: altere `prisma/schema.prisma` e rode `npx prisma migrate dev`, depois `npx prisma generate`.