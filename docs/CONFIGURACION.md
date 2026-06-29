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
