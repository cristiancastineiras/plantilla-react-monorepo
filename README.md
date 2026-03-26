
# Plantilla React Monorepo

> Monorepo moderno para proyectos React, optimizado para producción con Vite 7, TurboRepo y pnpm workspaces. Incluye configuraciones de seguridad, rendimiento optimizado y mejores prácticas a marzo de 2026.

---

## Características principales

- **Rendimiento optimizado**: Code splitting inteligente, tree-shaking agresivo, chunks separados por biblioteca
- **Seguridad hardcodeada**: Headers de seguridad, CSP ready, scripts de instalación bloqueados por defecto
- **Alias automáticos**: Los imports de paquetes internos se generan automáticamente
- **Tipado de entorno**: Variables de entorno autogeneradas con autocompletado TypeScript
- **Tailwind CSS v4**: Nuevo motor Oxide escrito en Rust, mucho más rápido
- **Biome**: Linter y formateador 100x más rápido que ESLint + Prettier
- **Turborepo**: Caché inteligente para builds incrementales
- **TypeScript estricto**: Configuración con todas las verificaciones de tipos habilitadas

---

## Requisitos previos

- **Node.js** >= 22.0.0 (LTS recomendado)
- **pnpm** >= 10.0.0

```bash
# Verificar versiones
node --version  # v22.x.x
pnpm --version  # 10.x.x
```

---

## Instalación rápida

```bash
# 1. Clona el repositorio
git clone https://github.com/tu-usuario/plantilla-react-monorepo.git
cd plantilla-react-monorepo

# 2. Instala dependencias
pnpm install

# 3. Inicia el servidor de desarrollo
pnpm dev
```

La app estará en [http://localhost:4200/plantilla/](http://localhost:4200/plantilla/)

---

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Inicia servidor de desarrollo con HMR |
| `pnpm build` | Build de producción optimizado |
| `pnpm build:webapp` | Build solo de la webapp |
| `pnpm preview` | Previsualiza el build de producción |
| `pnpm lint` | Verifica código con Biome |
| `pnpm lint:fix` | Corrige errores automáticamente |
| `pnpm format` | Formatea todo el código |
| `pnpm typecheck` | Verifica tipos TypeScript |
| `pnpm clean` | Limpia carpetas de cache y build |
| `pnpm clean:all` | Limpieza total + reinstalación |
| `pnpm audit` | Auditoría de seguridad de dependencias |
| `pnpm deps:check` | Verifica dependencias desactualizadas |
| `pnpm deps:update` | Actualiza dependencias a latest |

---

## Estructura del Proyecto

```
├── apps/
│   └── webapp/                 # Aplicación web principal
│       ├── src/                # Código fuente
│       ├── entorno/            # Variables de entorno por modo
│       │   ├── .env.desarrollo
│       │   ├── .env.produccion
│       │   └── .env.example
│       ├── index.html          # HTML con meta tags de seguridad
│       ├── vite.config.ts      # Configuración de Vite optimizada
│       └── tailwind.config.js  # Configuración de Tailwind
│
├── paquetes/                   # Paquetes compartidos
│   ├── api/                    # Cliente HTTP y servicios
│   ├── componentes/            # Componentes React reutilizables
│   ├── configuracion-ts/       # Configs base de TypeScript
│   ├── estados/                # Estado global (Zustand)
│   ├── hooks/                  # Hooks personalizados
│   ├── modelos/                # Tipos e interfaces TypeScript
│   └── utiles/                 # Funciones helper
│
├── .npmrc                      # Configuración de seguridad de pnpm
├── .nvmrc                      # Versión de Node.js
├── biome.json                  # Linter y formatter
├── turbo.json                  # Configuración de Turborepo
└── package.json                # Scripts y dependencias raíz
```

---

## Variables de entorno

Las variables se definen en `apps/webapp/entorno/.env.{modo}`:

```bash
# .env.desarrollo - Para desarrollo local
VITE_API_URL="http://localhost:3000/api"
VITE_DEBUG="true"

# .env.produccion - Para builds de producción
VITE_API_URL="https://api.midominio.com"
VITE_DEBUG="false"
```

⚠️ **Importante**: Todas las variables deben empezar con `VITE_` para ser expuestas al cliente. Nunca pongas secretos aquí.

---

## Optimizaciones incluidas

### Rendimiento de build
- **Code splitting**: Vendor chunks separados (react, router, data-fetching, ui, state)
- **Tree shaking**: Eliminación agresiva de código muerto
- **Minificación**: esbuild para balance velocidad/tamaño
- **CSS**: Minificación con esbuild, autoprefixer
- **Assets**: Hash en nombres para cache busting perfecto

### Rendimiento en runtime
- **Pre-bundling**: Dependencias más usadas pre-compiladas
- **React SWC**: Compilador 20x más rápido que Babel
- **Chunks lazy**: Componentes pesados se cargan bajo demanda

### Seguridad
- **Scripts bloqueados**: `ignore-scripts=true` en .npmrc
- **Headers seguros**: X-Content-Type-Options, X-Frame-Options, CSP ready
- **HTTPS forzado**: Strict-Transport-Security configurado
- **Dependencias auditadas**: `pnpm audit` en CI

---

## Agregar un nuevo paquete

```bash
# 1. Crea la carpeta
mkdir paquetes/mi-paquete

# 2. Crea el package.json
cat > paquetes/mi-paquete/package.json << EOF
{
  "name": "@paquetes/mi-paquete",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts"
}
EOF

# 3. Crea el código
mkdir paquetes/mi-paquete/src
echo "export const hola = () => 'Hola mundo'" > paquetes/mi-paquete/src/index.ts

# 4. Úsalo en la app
# import { hola } from '@paquetes/mi-paquete'
```

El alias se genera automáticamente, no necesitas configurar nada más.

---

## CI/CD y Dependabot

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

☑️ Require a pull request before merging
☑️ Require status checks to pass before merging
   - validate
   - build
☑️ Require branches to be up to date before merging
☑️ Do not allow bypassing the above settings
```

### Archivos de CI/CD

| Archivo | Propósito |
|---------|-----------|
| `.github/dependabot.yml` | Configuración de Dependabot |
| `.github/workflows/ci.yml` | Validación, build y auditoría |
| `.github/workflows/dependabot-automerge.yml` | Automerge seguro |

---

## Tecnologías

| Tecnología | Versión | Uso |
|------------|---------|-----|
| React | 19.x | UI y componentes |
| Vite | 7.x | Bundler y dev server |
| TypeScript | 5.9 | Tipado estático |
| Tailwind CSS | 4.x | Estilos utility-first |
| Turborepo | 2.x | Orquestación monorepo |
| Biome | 2.x | Linting y formatting |
| pnpm | 10.x | Gestión de paquetes |
| React Query | 5.x | Data fetching |
| Zustand | 5.x | Estado global |
| React Router | 7.x | Routing |

---

## Licencia

MIT


## Contribución

¡Las contribuciones son bienvenidas! Abre un issue o pull request para sugerencias o mejoras.

## Licencia

MIT