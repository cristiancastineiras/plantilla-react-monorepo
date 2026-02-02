
# Plantilla React Monorepo

> Monorepo moderno para proyectos React, optimizado con Vite, TurboRepo y pnpm workspaces. Incluye generación automática de alias, tipado de entorno, configuración centralizada y paquetes reutilizables para desarrollo ágil y escalable.

---

## Características principales de la plantilla

- **Alias automáticos**: Los imports de paquetes internos se generan solos en tsconfig y vite.config.
- **Tipado de entorno**: Variables de entorno autogeneradas y tipadas para autocompletado y linting.
- **Tailwind CSS listo**: Configurado y aplicado a todos los componentes del monorepo.
- **PNPM**: Gestor de paquetes rápido y eficiente para monorepos.
- **Biome**: Linter y formateador ultrarrápido.
- **Turborepo**: Orquestación de tareas y optimización de builds.

---


## Estructura del Proyecto

- **apps/webapp/**: Aplicación principal web construida con React y Vite (Si necesitas mas apps sugiero copiar esta carpeta y crear una nueva app y recuerda cambiar los nombres y configuraciones necesarias).
	- `src/`: Código fuente de la aplicación.
	- `entorno/`: Archivos de entorno o configuración específica.
	- `index.html`, `main.tsx`, `App.tsx`, etc.: Archivos principales de la app.
	- `tailwind.config.js`: Configuración de Tailwind CSS.
	- `vite.config.ts`: Configuración de Vite.
	- `tsconfig.json`: Configuración de TypeScript.

- **paquetes/**: Paquetes reutilizables y módulos compartidos (Puedes agregar más según tus necesidades).
	- **api/**: Lógica de acceso a APIs.
	- **componentes/**: Componentes React reutilizables.
	- **configuracion-ts/**: Configuraciones base de TypeScript y Vite.
	- **estados/**: Gestión de estados globales o compartidos.
	- **hooks/**: Hooks personalizados de React.
	- **modelos/**: Definiciones de tipos y modelos de datos.
	- **utiles/**: Funciones utilitarias y helpers.

- **biome.json**: Configuración de Biome para formateo y linting.
- **turbo.json**: Configuración de Turborepo para orquestar tareas en el monorepo.
- **package.json**: Dependencias y scripts raíz del monorepo.


## Instalación rápida

1. Instala [PNPM](https://pnpm.io/):
	```bash
	npm install -g pnpm
	```
2. Clona el repo y entra en la carpeta:
	```bash
	git clone https://github.com/Cristiancastt/plantilla-react-monorepo.git
	cd plantilla-react-monorepo
	```
3. Instala dependencias:
	```bash
	npx npm-check-updates -u
	pnpm install
	```
4. Inicia la app:
	```bash
	pnpm dev
	```

---

## Scripts útiles

| Comando         | Descripción                                 |
|-----------------|---------------------------------------------|
| pnpm dev        | Inicia la app web en modo desarrollo        |

---


## Tecnologías principales

| Tecnología    | Uso principal                                 |
|---------------|-----------------------------------------------|
| React         | UI y componentes                              |
| Vite          | Bundler y servidor de desarrollo              |
| SWC           | Compilador rápido para JS/TS                  |
| TypeScript    | Tipado estático                               |
| Tailwind CSS  | Utilidades de estilos                         |
| Turborepo     | Orquestación de monorepo                      |
| Biome         | Linter y formateador                          |
| PNPM          | Gestor de paquetes                            |
| ky            | Cliente HTTP                                  |

---


## ¿Cómo agregar nuevos paquetes?

1. Crea una carpeta dentro de `paquetes/`.
2. Añade un `package.json` y tu código.

---


## Contribución

¡Las contribuciones son bienvenidas! Abre un issue o pull request para sugerencias o mejoras.

## Licencia

MIT