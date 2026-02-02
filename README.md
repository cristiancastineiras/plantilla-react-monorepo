# plantilla-react-monorepo

Este proyecto es una plantilla de monorepo para aplicaciones web utilizando React, Vite y TypeScript, organizada para facilitar el desarrollo escalable y modular.

Importante: Esta plantilla está diseñada para ser un punto de partida. Asegúrate de personalizarla según las necesidades específicas de tu proyecto.
Cosas buenas de mi version de webapp (React + Vite + TS + Tailwind + Turborepo + Biome):
Autogenera los aliases de los paquetes en el tsconfig y vite.config
Autogenera el tipado de entorno para tenerlo linteado y con autocompletado en la app al desarrollar
Tailwind CSS ya configurado y listo para usar con autocompletado y aplicado a los componentes de paquetes monorepo
Usamos PNPM, que es más rápido y eficiente que npm o yarn en monorepos
Biome como linter y formateador, que es más rápido que ESLint y Prettier
Turborepo para orquestar tareas y optimizar el desarrollo en monorepos


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

## Instalación

Deberias tener instalado [PNPM](https://pnpm.io/) para manejar las dependencias del monorepo.
con el comando:
```bash
npm install -g pnpm
```
Ya lo tendrias, eres libre de usar el gestor que prefieras, pero esta plantilla esta optimizada para PNPM.

1. Clona el repositorio:
	 ```bash
	 git clone https://github.com/Cristiancastt/plantilla-react-monorepo.git
	 cd plantilla-react-monorepo
	 ```
2. Instala las dependencias:
	 ```bash
	 npx npm-check-updates -u
	 pnpm install
	 ```

## Script Principal

- `npm run dev` — Inicia la aplicación web en modo desarrollo.

Puedes generarte tus propios scripts en el `package.json` raíz (monorepo) o en los `package.json` de cada paquete o aplicación según tus necesidades.

## Tecnologías Utilizadas

- **React** — Librería para construir interfaces de usuario.
- **Vite** — Bundler rápido para desarrollo moderno.
- **SWC** — Compilador para optimizar el código JavaScript y TypeScript.
- **TypeScript** — Tipado estático para JavaScript.
- **Tailwind CSS** — Framework de utilidades para estilos.
- **Turborepo** — Herramienta para monorepositorios.
- **Biome** — Linter y formateador de código.
- **PNPM** — Gestor de paquetes eficiente para monorepos.
- **ky** — Cliente HTTP basado en Fetch.

## ¿Cómo agregar nuevos paquetes?

1. Crea una nueva carpeta dentro de `paquetes/`.
2. Añade un `package.json` y el código necesario.

## Contribución

¡Las contribuciones son bienvenidas! Por favor, abre un issue o pull request para sugerencias o mejoras.

## Licencia

Este proyecto está bajo la licencia MIT.