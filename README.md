# CEM-client (elearning-frontend)

Aplicación web de e-learning con Next.js 16 (App Router), React 19 y TypeScript.

## Requisitos

- Node.js 18+
- npm, yarn, pnpm o bun

## Instalación

```bash
npm install
```

## Variables de entorno

Crear `.env.local` en la raíz con:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

Sin `NEXT_PUBLIC_API_URL` se usa por defecto `http://localhost:5000/api/v1`.

## Scripts

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo (Turbopack) |
| `npm run build` | Build de producción |
| `npm run start` | Servidor de producción |
| `npm run lint` | ESLint |
| `npm run type-check` | Verificación TypeScript (`tsc --noEmit`) |

## Estructura de `src/`

- **`app/`** — Rutas y layouts (Next.js App Router)
- **`shared/`** — Componentes, store Redux, servicios, hooks y utilidades compartidos
- **`modules/`** — Módulos por dominio (auth, course, admin, instructor, etc.)

Ver [ARCHITECTURE.md](./ARCHITECTURE.md) para convenciones y detalles.
