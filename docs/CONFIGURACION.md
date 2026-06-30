# Guía de Configuración - Plantilla React Monorepo

> Esta guía explica en detalle cada configuración del proyecto y por qué está así.

---

## TypeScript (base.json)

Las configuraciones de TypeScript están diseñadas para máxima seguridad de tipos:

| Opción | Valor | Por qué |
|--------|-------|---------|
| `module` | ESNext | Vite usa módulos ES nativos, no CommonJS |
| `moduleResolution` | Bundler | Vite se encarga de resolver imports, no tsc |
| `strict` | true | Activa todas las verificaciones de tipos |
| `noUncheckedIndexedAccess` | true | `array[0]` retorna `T \| undefined`, no `T` |
| `exactOptionalPropertyTypes` | true | `prop?: string` es diferente de `prop: string \| undefined` |
| `useUnknownInCatchVariables` | true | En catch, `error` es `unknown` no `any` |
| `skipLibCheck` | true | No verifica tipos en node_modules (mucho más rápido) |
| `noEmit` | true | Vite/esbuild compila, TypeScript solo verifica |

---

## Vite (vite.config.ts)

### Servidor de desarrollo

```typescript
server: {
  port: 4200,              // Puerto fijo
  strictPort: true,        // Falla si el puerto está ocupado
  cors: !esProduccion,     // CORS solo en desarrollo
  fs: {
    strict: true,          // Bloquea acceso fuera de allow[]
    deny: ['.env*', '*.pem'] // Archivos que NUNCA se sirven
  }
}
```

### Build de producción

```typescript
build: {
  minify: 'esbuild',       // Más rápido que terser, buen balance
  sourcemap: 'hidden',     // Sourcemaps pero no los exponemos
  target: 'esnext',        // Navegadores modernos = bundle más pequeño
  
  rollupOptions: {
    output: {
      // Chunks separados para mejor cache
      manualChunks: {
        'react-core': ['react', 'react-dom'],
        'router': ['react-router-dom'],
        'data-fetching': ['@tanstack/react-query'],
        'ui-libs': ['lucide-react', 'clsx', 'sonner'],
        'state': ['zustand']
      }
    }
  }
}
```

**Por qué separar chunks:**
- Si cambias tu código, el usuario solo descarga tu código
- Las librerías (react, zustand, etc.) ya están en cache
- Cada librería se cachea independientemente

### Optimización de dependencias

```typescript
optimizeDeps: {
  include: ['react', 'react-dom', ...], // Pre-bundlea estas
  exclude: ['@paquetes/*']              // Pero no los paquetes locales
}
```

El pre-bundling convierte CJS a ESM y junta muchos archivos pequeños en uno. Acelera el inicio pero no queremos hacerlo con paquetes locales porque perdemos HMR.

### esbuild

```typescript
esbuild: {
  drop: esProduccion ? ['console', 'debugger'] : [],
  legalComments: 'none'
}
```

En producción eliminamos `console.log` y `debugger` automáticamente.

---

## Turborepo (turbo.json)

### Cache

Turborepo guarda el resultado de cada tarea. Si los inputs no cambian, saca el resultado de cache en vez de ejecutar de nuevo.

```json
"build": {
  "dependsOn": ["^build"],     // Primero las dependencias
  "inputs": ["$TURBO_DEFAULT$", ".env*"],
  "outputs": ["dist/**"]       // Lo que se cachea
}
```

`^build` significa "primero ejecuta build en todos los paquetes que este paquete importa".

### Variables de entorno

```json
"globalEnv": ["NODE_ENV", "CI"]
```

Si cualquiera de estas cambia, invalida TODO el cache.

```json
"env": ["VITE_*"]
```

Solo invalida el cache de la tarea específica.

---

## Oxc (`.oxlintrc.json` + `.oxfmtrc.json`)

### Por qué Oxc en vez de Biome / ESLint + Prettier

- **Linter (oxlint)**: 50-100x más rápido que ESLint, escrito en Rust, sin tree-shaking de JS
- **Formatter (oxfmt)**: 30x más rápido que Prettier y 2x más rápido que Biome, Prettier-compatible
- **Mismas reglas que ESLint**: 838 reglas builtin (incluye React, JSX-a11y, TypeScript, Import, Unicorn, Vitest)
- **Type-aware linting**: usa el compilador nativo Go de TypeScript (tsgo) para checks que requieren tipos
- **Configs separadas**: `.oxlintrc.json` para reglas de linting y `.oxfmtrc.json` para formato

### Reglas importantes configuradas

```json
"no-console": ["warn", { "allow": ["warn", "error", "info"] }]
"typescript/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }]
"import/order": ["warn", { "groups": [...], "alphabetize": { ... } }]
```

Más detalles en [oxc.rs/docs/guide/usage/linter](https://oxc.rs/docs/guide/usage/linter) y [oxc.rs/docs/guide/usage/formatter](https://oxc.rs/docs/guide/usage/formatter).

---

## Seguridad (.npmrc)

```ini
ignore-scripts=true
```

**Crítico para seguridad de supply chain.** Los paquetes npm pueden ejecutar código durante la instalación. En 2024 hubo varios ataques donde paquetes populares fueron comprometidos y ejecutaban malware en postinstall.

Con `ignore-scripts=true`, ningún paquete puede ejecutar código al instalarse. Si un paquete legítimo necesita scripts (como esbuild que descarga binarios), lo añades a la allowlist manualmente.

---

## Variables de entorno

### Estructura

```
apps/webapp/entorno/
├── .env.desarrollo     # pnpm dev
├── .env.produccion     # pnpm build
└── .env.example        # Plantilla documentada
```

### Variables soportadas

```bash
# URLs
VITE_API_URL="https://api.ejemplo.com"

# Con referencias (se resuelven automáticamente)
VITE_FULL_URL="${VITE_PROTOCOL}://${VITE_HOST}"

# Feature flags
VITE_DEBUG="true"
VITE_ENABLE_DEVTOOLS="true"
```

### Autocompletado

El archivo `src/vite-env.d.ts` se genera automáticamente:

```typescript
interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_DEBUG: string;
    // ...
}
```

Así tienes autocompletado cuando escribes `import.meta.env.`

---

## Vite 8 + Rolldown nativo

[Vite 8](https://vite.dev/) integra [Rolldown](https://rolldown.rs/) y
[Oxc](https://oxc.rs/) de forma **nativa**, sin necesidad de alias ni paquetes
adicionales. Este proyecto usa `vite@^8.1.0`.

### Migración desde Vite 7

| Cambio Vite 7 → Vite 8 | Motivo |
|---|---|
| `build.rollupOptions` → `build.rolldownOptions` | Rolldown reemplaza a Rollup |
| `optimizeDeps.esbuildOptions` → `optimizeDeps.rolldownOptions` | Rolldown ahora hace el pre-bundle |
| `output.manualChunks` (objeto) **eliminado** | API deprecada de Rollup |
| `output.advancedChunks.groups` → `codeSplitting.nativeGroups` (top-level) | API nativa de Rolldown |
| `esbuild.drop: ['console','debugger']` → `rolldownOptions.output.minify.compress: { dropConsole: true, dropDebugger: true }` | API nativa de Oxc (booleanos separados) |
| `transformWithEsbuild` → `transformWithOxc` | esbuild ahora es peer opcional |
| `esbuild` global → `oxc` global | Oxc ahora es el transformador por defecto |
| `commonjsOptions` | ahora es **no-op** (Rolldown maneja CJS directamente) |
| `resolve.alias[].customResolver` | deprecado → usar plugin custom con `resolveId` |

### Qué cambia al usar Rolldown

| Aspecto | Rollup (Vite clásico) | Rolldown (Vite 8) |
|---|---|---|
| Lenguaje del bundler | JavaScript | Rust |
| Minificador JS por defecto | esbuild | **Oxc** (Rust, más rápido) |
| Minificador CSS por defecto | esbuild | **Lightning CSS** |
| Transformador JS | esbuild | **Oxc** |
| Pre-bundling | esbuild | **Rolldown** |
| `manualChunks` | objeto o función | **eliminado** → `codeSplitting.nativeGroups` |
| Hook filter plugins | no | sí (`filter: { id: /regex/ }`) |
| Tree-shaking | bueno | mejor + optimizaciones extra |

### Code splitting con `codeSplitting.nativeGroups`

```typescript
build: {
  rolldownOptions: {
    codeSplitting: {
      nativeGroups: [
        { name: 'react-core', test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/ },
        { name: 'router', test: /[\\/]node_modules[\\/]react-router-dom[\\/]/ }
      ]
    }
  }
}
```

### Minificación con Oxc y drop de console/debugger

```typescript
build: {
  rolldownOptions: {
    output: {
      minify: {
        compress: {
          dropConsole: true,    // elimina console.* en producción
          dropDebugger: true    // elimina statements debugger
        }
      }
    }
  }
}
```

### Default browser target

Vite 8 actualizó el target por defecto (`build.target: 'baseline-widely-available'`)
a navegadores de ~2.5 años de antigüedad (Chrome/Edge 111+, Firefox 114+, Safari 16.4+),
alineado con el estándar [Baseline 2026-01-01](https://web-platform-dx.github.io/web-features/).
Esto reduce el tamaño del bundle al no necesitar polyfills para navegadores modernos.

---

## tsdown (empaquetador de librerías)

[tsdown](https://tsdown.dev/) es un empaquetador de librerías TypeScript
construido sobre Rolldown. Cada paquete en `paquetes/*` lo usa para generar
`dist/` con JS + `.d.ts` + sourcemaps.

### Configuración por paquete

Cada paquete tiene su propio `tsdown.config.ts`:

```typescript
// paquetes/componentes/tsdown.config.ts
import { defineConfig } from "tsdown"

export default defineConfig({
  entry: ["./src/index.ts"],
  format: ["esm"],
  platform: "neutral",
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ["react", "react-dom", "react/jsx-runtime"]
})
```

| Opción | Qué hace |
|---|---|
| `entry` | Punto(s) de entrada del bundle |
| `format` | Formato de salida (`esm`, `cjs`, `iife`) |
| `platform` | `neutral` para librerías (compat universal) |
| `dts` | Genera y agrupa los `.d.ts` con `rolldown-plugin-dts` |
| `sourcemap` | Sourcemaps para debugging |
| `clean` | Limpia `dist/` antes de cada build |
| `treeshake` | Elimina código muerto |
| `external` | Dependencias que NO se incluyen en el bundle |

### Scripts disponibles

Cada paquete incluye:

```bash
pnpm --filter @paquetes/componentes build      # Build producción
pnpm --filter @paquetes/componentes dev        # Build en watch mode
pnpm --filter @paquetes/componentes typecheck  # tsc --noEmit
pnpm --filter @paquetes/componentes lint       # oxlint
pnpm --filter @paquetes/componentes format     # oxfmt
pnpm --filter @paquetes/componentes clean      # rimraf dist .turbo
```

### Preset `library.json`

Todos los paquetes extienden `@paquetes/configuracion-ts/library.json`, un
preset específico para librerías que sobreescribe `base.json` con:

- `module: ESNext`, `moduleResolution: Bundler`
- `target: ES2022` (compat universal)
- `declaration: true` + `declarationMap: true`
- `jsx: react-jsx` (para paquetes React)
- `verbatimModuleSyntax: true` (imports/exports de tipo explícitos)

### Convenciones de `package.json`

Cada paquete publica su entry con el estándar moderno:

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
  "sideEffects": false
}
```

### ¿Por qué `external` para React?

Si publicas una librería React, empaquetar `react` dentro del bundle causaría
duplicación y problemas de hooks. Marcándolo como `external`, el consumidor
aporta su propia copia de React y el árbol de hooks funciona correctamente.

---

## Tailwind CSS v4

Tailwind v4 usa un nuevo motor (Oxide) escrito en Rust:

- **10x más rápido** en desarrollo
- **Menos configuración**: La mayoría va en CSS con `@theme`
- **CSS nativo**: Usa cascade layers y custom properties

```js
// tailwind.config.js - Solo lo necesario
export default {
  content: {
    files: [
      './src/**/*.{tsx,ts}',
      '../../paquetes/**/src/**/*.{tsx,ts}'
    ]
  }
}
```

La mayoría de personalización ahora va en CSS:

```css
@import "tailwindcss";

@theme {
  --color-primary: #3b82f6;
  --font-sans: system-ui, sans-serif;
}
```

---

## HTML de producción (index.html)

### Meta tags de seguridad

```html
<meta http-equiv="X-Content-Type-Options" content="nosniff" />
```
Previene que el navegador "adivine" el tipo MIME. Si un atacante sube un archivo .txt que es en realidad JavaScript, el navegador no lo ejecutará.

```html
<meta http-equiv="Strict-Transport-Security" content="max-age=31536000" />
```
Fuerza HTTPS durante 1 año. Incluso si el usuario escribe http://, el navegador usará https://.

```html
<meta name="referrer" content="strict-origin-when-cross-origin" />
```
Controla qué información se envía en el header Referer. Protege URLs internas cuando el usuario navega a sitios externos.

---

## Preguntas frecuentes

### ¿Por qué pnpm y no npm/yarn?

1. **Más rápido**: Usa hard links, no copia archivos
2. **Más seguro**: No permite acceder a dependencias no declaradas
3. **Menos espacio**: Comparte paquetes entre proyectos

### ¿Por qué React + Oxc y no Babel/SWC?

En Rolldown-Vite (Vite 8), el plugin oficial `@vitejs/plugin-react` activa automáticamente el **transformador Oxc** para Fast Refresh y JSX/TSX. Oxc está escrito en Rust, es 5-10x más rápido que Babel y 2x más rápido que SWC, compartiendo runtime con el propio bundler.

### ¿Por qué Turborepo?

En un monorepo con varios paquetes, Turborepo:
- Solo recompila lo que cambió
- Cachea resultados localmente (y opcionalmente en la nube)
- Paraleliza tareas que no dependen entre sí

### ¿Por qué los comentarios están en archivos .ts y no en .json?

JSON estándar no soporta comentarios. Aunque algunas herramientas aceptan JSONC (JSON with Comments), VS Code muestra warnings. Los comentarios detallados están en este archivo y en los archivos TypeScript.
