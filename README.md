# Plantilla React Monorepo

> Monorepo moderno para proyectos React, optimizado para producción con **Vite 8** (Rolldown + Oxc), **TurboRepo** y **pnpm** workspaces. Incluye empaquetado de librerías con **tsdown**, configuraciones de seguridad, rendimiento optimizado y mejores prácticas a junio de 2026.

---

## ✨ Características principales

### 🚀 Rendimiento extremo
- **Vite 8 + Rolldown**: Bundler en Rust (drop-in de Rollup) para builds hasta 10x más rápidos
- **Oxc**: Transformador y minificador en Rust (reemplaza a esbuild, 2x más rápido)
- **Lightning CSS**: Minificador CSS en Rust (reemplaza a esbuild para CSS)
- **Code splitting nativo**: `codeSplitting.nativeGroups` agrupa vendor chunks por regex
- **Tree-shaking agresivo**: `moduleSideEffects: false`, `propertyReadSideEffects: false`
- **Drop automático**: `console.*` y `debugger` eliminados en producción via Oxc

### 🔒 Seguridad por defecto
- **Headers de seguridad**: X-Content-Type-Options, X-Frame-Options, CSP ready
- **Scripts bloqueados**: `ignore-scripts=true` en `.npmrc` (anti supply-chain attacks)
- **Variables de entorno tipadas**: Autogeneradas con autocompletado TypeScript
- **HTTPS forzado**: Strict-Transport-Security configurado
- **Auditoría de dependencias**: `pnpm audit` integrado en CI

### 🛠️ Developer Experience
- **Alias automáticos**: Los imports de paquetes internos se generan desde `paquetes/`
- **tsdown**: Empaquetador de librerías TS powered by Rolldown (más rápido que tsup)
- **Oxc (oxlint + oxfmt)**: Linter 50-100x más rápido que ESLint, formatter 30x más rápido que Prettier
- **Turborepo**: Caché inteligente para builds incrementales
- **TypeScript estricto**: Todas las verificaciones de tipos habilitadas

### 🎨 UI Moderna
- **React 19**: Última versión con Actions, Server Components y Compiler ready
- **Tailwind CSS v4**: Nuevo motor Oxide escrito en Rust
- **React Query 5**: Data fetching con caché automático
- **Zustand 5**: Estado global minimalista
- **React Router 7**: Routing con loaders y data API

---

## 📋 Requisitos previos

- **Node.js** >= 24.11.0 (Vite 8 y tsdown requieren Node 22.18+, Rolldown recomienda 24+)
- **pnpm** >= 10.0.0

```bash
# Verificar versiones
node --version  # v24.x.x
pnpm --version  # 10.x.x
```

> 💡 Usa `nvm use` si tienes `.nvmrc` configurado en tu proyecto.

---

## 🚀 Instalación rápida

```bash
# 1. Clona el repositorio
git clone https://github.com/tu-usuario/plantilla-react-monorepo.git
cd plantilla-react-monorepo

# 2. Instala dependencias (pnpm.lock se respeta)
pnpm install

# 3. Inicia el servidor de desarrollo
pnpm dev
```

La app estará disponible en [http://localhost:5173](http://localhost:5173) (puerto configurable vía `VITE_PUERTO`).

---

## 📜 Scripts disponibles

### Raíz (orquestados con Turbo)

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Inicia servidor de desarrollo con HMR (todas las apps) |
| `pnpm build` | Build de producción optimizado de todo el monorepo |
| `pnpm build:webapp` | Build solo de la webapp |
| `pnpm preview` | Previsualiza el build de producción |
| `pnpm lint` | Verifica código con oxlint (todos los paquetes) |
| `pnpm lint:fix` | Corrige errores automáticamente |
| `pnpm format` | Formatea todo el código con oxfmt |
| `pnpm format:check` | Verifica formato sin escribir (para CI) |
| `pnpm typecheck` | Verifica tipos TypeScript en todo el monorepo |
| `pnpm check` | Ejecuta `lint` + `format:check` |
| `pnpm clean` | Limpia carpetas de cache y build |
| `pnpm clean:all` | Limpieza total + reinstalación de dependencias |
| `pnpm audit` | Auditoría de seguridad de dependencias |
| `pnpm deps:check` | Verifica dependencias desactualizadas |
| `pnpm deps:update` | Actualiza dependencias a latest |

### Por paquete (con `pnpm --filter`)

Cada paquete en `paquetes/*` expone:

```bash
pnpm --filter @paquetes/componentes build      # Build producción
pnpm --filter @paquetes/componentes dev        # Build en watch mode
pnpm --filter @paquetes/componentes typecheck  # tsc --noEmit
pnpm --filter @paquetes/componentes lint       # oxlint
pnpm --filter @paquetes/componentes format     # oxfmt
pnpm --filter @paquetes/componentes clean      # rimraf dist .turbo
```

---

## 📁 Estructura del Proyecto

```
plantilla-react-monorepo/
├── apps/
│   └── webapp/                          # Aplicación web principal (Vite 8)
│       ├── src/                         # Código fuente React 19
│       ├── entorno/                     # Variables de entorno por modo
│       │   ├── .env.desarrollo
│       │   ├── .env.produccion
│       │   └── .env.example
│       ├── index.html                   # HTML con meta tags de seguridad
│       ├── vite.config.ts               # Config Vite 8 + Rolldown + Oxc
│       ├── tailwind.config.js
│       └── tsconfig.json                # Extiende @paquetes/configuracion-ts/vite.json
│
├── paquetes/                            # Paquetes compartidos (tsdown)
│   ├── api/                             # Cliente HTTP (Ky)
│   ├── componentes/                     # Componentes React reutilizables
│   ├── configuracion-ts/                # Presets TypeScript
│   │   ├── base.json                    # Base para todo el monorepo
│   │   ├── vite.json                    # Para apps (Vite/React)
│   │   └── library.json                 # Para librerías (tsdown)
│   ├── estados/                         # Estado global (Zustand)
│   ├── hooks/                           # Hooks personalizados
│   ├── modelos/                         # Tipos e interfaces TypeScript
│   └── utiles/                          # Funciones helper
│
├── docs/
│   └── CONFIGURACION.md                 # Guía detallada de configuración
│
├── .github/
│   ├── dependabot.yml                   # Actualización automática de dependencias
│   └── workflows/                       # CI/CD
│
├── .npmrc                               # ignore-scripts=true (seguridad)
├── .oxlintrc.json                       # Linter (Rust, 100x más rápido)
├── .oxfmtrc.json                        # Formatter (Rust, 30x más rápido)
├── turbo.json                           # Orquestación del monorepo
└── package.json                         # Dependencias y scripts raíz
```

---

## 🔧 Stack tecnológico

| Tecnología | Versión | Rol |
|------------|---------|-----|
| **React** | 19.x | UI y componentes |
| **Vite** | 8.x | Bundler + dev server (Rolldown + Oxc nativos) |
| **TypeScript** | 5.9 | Tipado estático estricto |
| **Rolldown** | 1.1.x | Bundler Rust (integrado en Vite 8) |
| **tsdown** | 0.22.x | Empaquetador de librerías (powered by Rolldown) |
| **Tailwind CSS** | 4.x | Estilos utility-first (motor Oxide) |
| **Turborepo** | 2.x | Orquestación y caché de monorepo |
| **Oxc** | 1.71 / 0.56 | Linter (oxlint) + formatter (oxfmt) |
| **pnpm** | 10.x | Gestión de paquetes con workspaces |
| **TanStack Query** | 5.x | Data fetching con caché |
| **TanStack Table** | 8.x | Tablas headless |
| **Zustand** | 5.x | Estado global minimalista |
| **React Router** | 7.x | Routing con loaders |
| **Ky** | 1.x | Cliente HTTP moderno |
| **Sonner** | 2.x | Notificaciones toast |
| **Lucide** | 0.563 | Iconos SVG |

---

## 🌐 Variables de entorno

Las variables se definen en `apps/webapp/entorno/.env.{modo}`:

```bash
# .env.desarrollo - Para desarrollo local
VITE_API_URL="http://localhost:3000/api"
VITE_DEBUG="true"
VITE_PUERTO="5173"

# .env.produccion - Para builds de producción
VITE_API_URL="https://api.midominio.com"
VITE_DEBUG="false"
VITE_BASE_PATH="/"
```

> ⚠️ **Importante**: Todas las variables deben empezar con `VITE_` para ser expuestas al cliente. Nunca pongas secretos aquí.

### Referencias entre variables

Puedes usar `${VAR}` para referenciar otras variables. El sistema resuelve
referencias automáticamente hasta 10 niveles de profundidad:

```bash
VITE_PROTOCOL="https"
VITE_HOST="api.midominio.com"
VITE_FULL_URL="${VITE_PROTOCOL}://${VITE_HOST}"  # → "https://api.midominio.com"
```

El archivo `src/vite-env.d.ts` se regenera automáticamente con tipos para
autocompletado en el IDE.

---

## ⚡ Optimizaciones incluidas

### Build (Vite 8 + Rolldown)

```typescript
{
  build: {
    rolldownOptions: {
      output: {
        minify: { compress: { dropConsole: true, dropDebugger: true } },
      },
      treeshake: { moduleSideEffects: false, propertyReadSideEffects: false },
      codeSplitting: {
        nativeGroups: [
          { name: 'react-core', test: /node_modules\/(react|react-dom)\// },
          { name: 'router', test: /node_modules\/react-router-dom\// },
          // ...
        ]
      }
    }
  }
}
```

| Optimización | Beneficio |
|---|---|
| **Code splitting por regex** | Chunks vendor separados → mejor caché del navegador |
| **Tree-shaking agresivo** | Eliminación de código muerto más efectiva |
| **Minificación con Oxc** | 2x más rápido que esbuild, mismo tamaño de bundle |
| **CSS con Lightning CSS** | Minificación más rápida + syntax lowering moderno |
| **Assets con hash** | Cache busting perfecto en producción |
| **Drop console/debugger** | Bundle de producción sin código de debug |

### Runtime

- **Pre-bundling con Rolldown**: Cold start hasta 10x más rápido que esbuild
- **HMR instantáneo**: Rolldown procesa cambios en ms
- **Chunks lazy**: Componentes pesados se cargan bajo demanda

### Seguridad

- **`ignore-scripts=true`**: Ningún paquete puede ejecutar código al instalar
- **Headers HTTP**: X-Content-Type-Options, X-Frame-Options, Referrer-Policy
- **HTTPS forzado**: HSTS configurado en producción
- **FS restrictivo**: Vite bloquea acceso a `.env*`, `*.pem`, `*.key`

---

## 📦 Empaquetar librerías con tsdown

Cada paquete en `paquetes/*` se compila con [tsdown](https://tsdown.dev/)
(powered by Rolldown). Ejemplo: `paquetes/componentes/tsdown.config.ts`:

```typescript
import { defineConfig } from "tsdown"

export default defineConfig({
  entry: ["./src/index.ts"],
  format: ["esm"],
  platform: "neutral",
  dts: true,                    // Genera y agrupa .d.ts
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ["react", "react-dom", "react/jsx-runtime"],
})
```

### Convenciones de `package.json` para librerías

```json
{
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "files": ["dist"],
  "sideEffects": false,
  "peerDependencies": {
    "react": "^19.0.0"
  }
}
```

> 🔑 **¿Por qué `external` para React?** Si empaquetas React dentro de la
> librería, causa duplicación y rompe los hooks. Marcándolo como external,
> el consumidor aporta su propia copia.

---

## ➕ Agregar un nuevo paquete

### Librería TypeScript pura (sin React)

```bash
# 1. Crea la estructura
mkdir paquetes/mi-paquete/src

# 2. Crea el tsdown.config.ts
```

```typescript
// paquetes/mi-paquete/tsdown.config.ts
import { defineConfig } from "tsdown"

export default defineConfig({
  entry: ["./src/index.ts"],
  format: ["esm"],
  platform: "neutral",
  dts: true,
})
```

```bash
# 3. Crea el tsconfig.json
```

```json
// paquetes/mi-paquete/tsconfig.json
{
  "extends": "../../paquetes/configuracion-ts/library.json",
  "include": ["src/**/*.ts", "tsdown.config.ts"]
}
```

```bash
# 4. Crea el package.json
```

```json
// paquetes/mi-paquete/package.json
{
  "name": "@paquetes/mi-paquete",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "files": ["dist"],
  "sideEffects": false,
  "scripts": {
    "build": "tsdown",
    "dev": "tsdown --watch",
    "typecheck": "tsc --noEmit",
    "lint": "oxlint src/",
    "format": "oxfmt src/",
    "clean": "rimraf dist .turbo"
  }
}
```

```bash
# 5. Crea el código fuente
echo "export const hola = () => 'Hola mundo'" > paquetes/mi-paquete/src/index.ts

# 6. Úsalo en la app
# import { hola } from '@paquetes/mi-paquete'
```

El alias se genera **automáticamente** desde el nombre en `package.json` —
no necesitas configurar nada más.

---

## 🔄 CI/CD y Dependabot

### Actualización automática de dependencias

Este proyecto incluye **Dependabot** configurado para:

- ✅ Revisar dependencias cada lunes a las 9:00 AM
- ✅ Agrupar actualizaciones relacionadas (React, Vite, TanStack, etc.)
- ✅ **Automerge** de actualizaciones patch y minor (si pasan los tests)
- ⚠️ Actualizaciones **major** requieren revisión manual

### Seguridad del automerge

El automerge está diseñado para ser seguro:

1. **Solo Dependabot**: Verifica que el PR sea realmente de `dependabot[bot]`
2. **Tests obligatorios**: Solo mergea si pasan typecheck, lint y build
3. **Sin majors**: Las actualizaciones major nunca se auto-mergean
4. **Auditoría**: Cada PR ejecuta `pnpm audit` para detectar vulnerabilidades

### Configurar Branch Protection (recomendado)

Para máxima seguridad, configura estas reglas en GitHub:

```
Settings → Branches → Add rule → main

☑ Require a pull request before merging
☑ Require status checks to pass before merging
   - validate
   - build
☑ Require branches to be up to date before merging
☑ Do not allow bypassing the above settings
```

### Archivos de CI/CD

| Archivo | Propósito |
|---------|-----------|
| `.github/dependabot.yml` | Configuración de Dependabot |
| `.github/workflows/ci.yml` | Validación, build y auditoría |
| `.github/workflows/dependabot-automerge.yml` | Automerge seguro |

---

## 📚 Documentación adicional

- 📖 **[docs/CONFIGURACION.md](docs/CONFIGURACION.md)**: Guía detallada de cada
  configuración (TypeScript, Vite, Rolldown, tsdown, Turbo, Oxc)
- 🌐 [Vite 8 docs](https://vite.dev/guide/migration)
- 🦀 [Rolldown](https://rolldown.rs/)
- 📦 [tsdown](https://tsdown.dev/)
- ⚡ [Oxc](https://oxc.rs/)

---

## 📄 Licencia

MIT

---

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Abre un issue o pull request para
sugerencias o mejoras.