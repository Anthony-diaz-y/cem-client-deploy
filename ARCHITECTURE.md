# Arquitectura CEM-client

## Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript 5
- **Estado:** Redux Toolkit (store en `src/shared/store`)
- **HTTP:** Axios, instancia centralizada en `src/shared/services/apiConnector.ts`
- **Estilos:** Tailwind CSS

## Estructura de carpetas

| Ruta | Uso |
|------|-----|
| `src/app/` | Rutas y layouts del App Router. Una carpeta = una ruta. |
| `src/shared/` | Código compartido: componentes UI, navegación, store, servicios, hooks, config, utils. |
| `src/modules/` | Módulos por dominio. Cada módulo puede tener: `components/`, `containers/`, `hooks/`, `services/`, `store/`, `types/`. |

## Alias de importación

- `@/*` → `src/*`
- `@shared/*` → `src/shared/*`
- `@modules/*` → `src/modules/*`

## API y servicios

- **Base URL:** Definida en `src/shared/config/api.config.ts` (`NEXT_PUBLIC_API_URL`).
- **Cliente:** `apiConnector` (Axios) en `src/shared/services/apiConnector.ts`. Añade JWT desde `localStorage` y maneja 401 (redirección a login).
- **Servicios por dominio:** auth en `@modules/auth/services/authAPI`, admin en `@shared/services/admin*`, cursos en `@shared/services/course*` y `@modules/course/services/*`. Importar desde `@shared/services/...` o `@modules/...` según corresponda.

## Estado global (Redux)

- Store único en `src/shared/store/store.ts`, con `rootReducer` que combina: `auth`, `profile`, `course`, `cart`, `viewCourse`, `sidebar`.
- Slices por dominio en `shared/store` o dentro de cada módulo (p. ej. `modules/auth/store/authSlice`).

## Rutas protegidas

- Componente `ProtectedRoute` en shared envuelve las páginas que requieren autenticación.
- Las rutas bajo `app/dashboard/` suelen estar protegidas.

## Convenciones

- **shared:** Solo código reutilizable entre módulos. No poner lógica de negocio específica de un flujo.
- **modules:** Agrupar por dominio (auth, course, admin, instructor, etc.). Cada módulo exporta su API pública vía `index.ts`.
- **Tipos de admin:** En `src/shared/services/admin/types/` (dashboard, instructor, student, course, category, review, search). Re-exportados desde `@shared/services/adminAPI`.
