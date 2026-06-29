// ==============================================================================
// CONFIGURACIÓN DE TAILWIND CSS v4
// ==============================================================================
// Tailwind v4 usa un nuevo motor (Oxide) escrito en Rust que es mucho más rápido.
// La mayoría de configuración ahora va directamente en CSS con @theme.
// Este archivo es principalmente para content scanning y compatibilidad.
// ==============================================================================

/** @type {import('tailwindcss').Config} */
export default {
	// Archivos donde buscar clases de Tailwind
	// Importante: incluir todos los archivos donde uses clases Tailwind
	content: {
		files: [
			"./index.html",
			"./src/**/*.{js,ts,jsx,tsx,mdx}",
			// Incluir componentes compartidos del monorepo
			"../../paquetes/**/src/**/*.{js,ts,jsx,tsx}",
			"../../paquetes/**/*.{js,ts,jsx,tsx}",
		],
		// Clases que siempre deben incluirse aunque no se detecten
		// Útil para clases generadas dinámicamente
		safelist: [
			// Ejemplo: 'bg-red-500', 'text-blue-600'
		],
	},

	// Tema personalizado
	// En Tailwind v4, preferiblemente usa @theme en CSS
	// Este extend es para casos donde necesites JS
	theme: {
		extend: {
			// === COLORES SEMÁNTICOS ===
			// Define colores por su uso, no por su aspecto
			// Facilita cambiar el tema sin tocar componentes
			colors: {
				// Colores de marca (personalizar según proyecto)
				// primary: { DEFAULT: '#...', dark: '#...', light: '#...' },
				// secondary: { DEFAULT: '#...', dark: '#...', light: '#...' },
			},

			// === TIPOGRAFÍA ===
			fontFamily: {
				// Fuentes del sistema para máximo rendimiento
				// No cargan ningún archivo, usan las fuentes del SO
				sans: [
					"system-ui",
					"-apple-system",
					"BlinkMacSystemFont",
					'"Segoe UI"',
					"Roboto",
					'"Helvetica Neue"',
					"Arial",
					"sans-serif",
				],
				mono: [
					"ui-monospace",
					"SFMono-Regular",
					"Menlo",
					"Monaco",
					"Consolas",
					'"Liberation Mono"',
					'"Courier New"',
					"monospace",
				],
			},

			// === ANIMACIONES ===
			// Animaciones comunes listas para usar
			animation: {
				"fade-in": "fadeIn 0.3s ease-in-out",
				"slide-up": "slideUp 0.3s ease-out",
				"spin-slow": "spin 3s linear infinite",
			},
			keyframes: {
				fadeIn: {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
				slideUp: {
					"0%": { transform: "translateY(10px)", opacity: "0" },
					"100%": { transform: "translateY(0)", opacity: "1" },
				},
			},

			// === SPACING CUSTOM ===
			// Para valores que no están en la escala por defecto
			// spacing: {
			//   '128': '32rem',
			//   '144': '36rem',
			// },

			// === BREAKPOINTS ===
			// Los default están bien para la mayoría de proyectos
			// screens: {
			//   '3xl': '1600px',
			// },
		},
	},

	// Plugins de Tailwind
	// Tailwind v4 incluye muchos plugins por defecto
	plugins: [
		// Añade plugins según necesites:
		// require('@tailwindcss/forms'),
		// require('@tailwindcss/typography'),
		// require('@tailwindcss/container-queries'),
	],

	// === CONFIGURACIÓN DE RENDIMIENTO ===
	// Tailwind v4 ya optimiza por defecto, estas son opciones extra

	// Prefijo para evitar conflictos con otros CSS (opcional)
	// prefix: 'tw-',

	// Desactiva clases que no uses para bundle más pequeño
	// corePlugins: {
	//   preflight: true,
	//   container: true,
	// },
}
