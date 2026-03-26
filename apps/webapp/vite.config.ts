import { defineConfig, type UserConfig, type ConfigEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'node:path'
import fs from 'node:fs'
import dotenv from 'dotenv'
import tailwindcss from '@tailwindcss/vite'

// ============================================================================
// CONFIGURACIÓN DE VITE - OPTIMIZADA PARA PRODUCCIÓN (Marzo 2026)
// ============================================================================
// Este archivo está configurado con las mejores prácticas de rendimiento,
// seguridad y tiempos de compilación para un monorepo React moderno.
// ============================================================================

/**
 * Crea alias de Vite automáticamente desde los paquetes en la carpeta 'paquetes'.
 * Esto evita tener que actualizar manualmente los alias cada vez que se añade un paquete.
 * 
 * Beneficio: Reduce errores humanos y mantiene consistencia en el monorepo.
 */
function crearAliasDesdePaquetes(): Record<string, string> {
  const directorioPaquetes = path.resolve(__dirname, '../../paquetes')
  const alias: Record<string, string> = {}

  // Usamos try-catch porque en CI/CD el directorio podría no existir inicialmente
  try {
    for (const carpeta of fs.readdirSync(directorioPaquetes)) {
      const rutaPackageJson = path.join(directorioPaquetes, carpeta, 'package.json')

      if (!fs.existsSync(rutaPackageJson)) continue

      const packageJson = JSON.parse(
        fs.readFileSync(rutaPackageJson, 'utf-8')
      )

      if (!packageJson.name?.startsWith('@paquetes/')) continue

      const raizPaquete = path.join(directorioPaquetes, carpeta)
      const rutaSrc = path.join(raizPaquete, 'src')

      // Priorizamos src/ para mejor tree-shaking y resolución de módulos
      alias[packageJson.name] = fs.existsSync(rutaSrc)
        ? rutaSrc
        : raizPaquete
    }
  } catch (error) {
    console.warn('No se pudieron cargar los alias de paquetes:', error)
  }

  // Solo mostramos en desarrollo para no ensuciar logs de CI
  if (process.env.NODE_ENV !== 'production') {
    console.log('Alias generados:', Object.keys(alias).join(', '))
  }

  return alias
}

/**
 * Resuelve referencias circulares o encadenadas entre variables de entorno.
 * Por ejemplo: API_URL=${BASE_URL}/api donde BASE_URL=https://example.com
 * 
 * Esto permite mantener DRY las variables de entorno sin duplicar valores.
 * Máximo 10 iteraciones para evitar loops infinitos en referencias circulares.
 */
function resolverVariablesEntorno(
  variables: Record<string, string>
): Record<string, string> {
  const resultado: Record<string, string> = { ...variables }
  const patron = /\$\{([A-Z0-9_]+)\}/g
  const MAX_ITERACIONES = 10 // Previene loops infinitos si hay referencias circulares

  let hayCambios: boolean
  let iteraciones = 0

  do {
    hayCambios = false
    iteraciones++

    for (const clave of Object.keys(resultado)) {
      const valor = resultado[clave]
      if (!valor) continue

      const reemplazado = valor.replace(
        patron,
        (_, nombreVariable) => resultado[nombreVariable] ?? ''
      )

      if (reemplazado !== valor) {
        resultado[clave] = reemplazado
        hayCambios = true
      }
    }
  } while (hayCambios && iteraciones < MAX_ITERACIONES)

  if (iteraciones >= MAX_ITERACIONES) {
    console.warn('Posible referencia circular en variables de entorno')
  }

  return resultado
}

/**
 * Genera automáticamente los tipos TypeScript para las variables de entorno.
 * Esto da autocompletado y type-safety cuando usas import.meta.env.VARIABLE
 * 
 * Se ejecuta en cada inicio de dev server para mantener los tipos sincronizados.
 */
function generarTiposEnv(
  variables: Record<string, string>,
  rutaSalida: string
): void {
  const lineas = Object.keys(variables)
    .sort()
    .map((clave) => `    readonly ${clave}: string;`)
    .join('\n')

  // Incluimos el modo de Vite por defecto para type-safety completo
  const contenido = `/// <reference types="vite/client" />

// ============================================================================
// ARCHIVO AUTOGENERADO - NO EDITAR MANUALMENTE
// ============================================================================
// Este archivo se genera automáticamente basándose en las variables de entorno.
// Para añadir nuevas variables, edita el archivo .env correspondiente.
// ============================================================================

interface ImportMetaEnv {
    readonly MODE: string;
    readonly DEV: boolean;
    readonly PROD: boolean;
    readonly SSR: boolean;
${lineas}
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
`

  fs.writeFileSync(rutaSalida, contenido, { encoding: 'utf-8' })
}

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const esProduccion = mode === 'production' || mode === 'produccion'
  const carpetaEntornos = path.resolve(__dirname, 'entorno')
  const rutaArchivoEnv = path.join(carpetaEntornos, `.env.${mode}`)

  // Solo logueamos en desarrollo para mantener CI limpio
  if (!esProduccion) {
    console.log('Modo:', mode)
    console.log('Archivo de entorno:', rutaArchivoEnv)
  }

  const variablesCrudas = dotenv.config({ path: rutaArchivoEnv }).parsed || {}
  const variablesResueltas = resolverVariablesEntorno(variablesCrudas)

  // Generar tipos para autocompletado en el IDE
  const carpetaSrc = path.resolve(__dirname, 'src')
  generarTiposEnv(variablesResueltas, path.resolve(carpetaSrc, 'vite-env.d.ts'))

  // Preparar variables para import.meta.env
  const variablesParaVite: Record<string, string> = {}
  for (const clave in variablesResueltas) {
    variablesParaVite[`import.meta.env.${clave}`] = JSON.stringify(variablesResueltas[clave])
  }

  return {
    // ========================================================================
    // SERVIDOR DE DESARROLLO
    // ========================================================================
    server: {
      port: Number(variablesCrudas.VITE_PUERTO) || 5173,
      strictPort: true,
      
      // Habilitar CORS solo en desarrollo, nunca en producción
      cors: !esProduccion,
      
      // Configuración de seguridad del filesystem
      fs: {
        strict: true, // Previene acceso a archivos fuera de allow
        allow: [
          path.resolve(__dirname, '../..'),
          path.resolve(__dirname, '../../paquetes')
        ],
        // Deniega acceso a archivos sensibles
        deny: ['.env*', '*.pem', '*.key', '.git/**']
      },

      // Headers de seguridad para desarrollo
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'strict-origin-when-cross-origin'
      }
    },

    // ========================================================================
    // PREVIEW (para probar build de producción localmente)
    // ========================================================================
    preview: {
      port: 4173,
      strictPort: true,
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin'
      }
    },

    // ========================================================================
    // RESOLUCIÓN DE MÓDULOS
    // ========================================================================
    resolve: {
      alias: crearAliasDesdePaquetes(),
      // Extensiones en orden de prioridad para mejor rendimiento
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.json']
    },

    base: variablesCrudas.VITE_BASE_PATH ?? '/',
    envDir: './entorno',

    // ========================================================================
    // OPTIMIZACIÓN DE BUILD PARA PRODUCCIÓN
    // ========================================================================
    build: {
      outDir: 'dist',
      
      // Minificación: esbuild es más rápido, terser genera bundles más pequeños
      // Usamos esbuild para mejor balance velocidad/tamaño en 2026
      minify: esProduccion ? 'esbuild' : false,
      
      // Sourcemaps solo en desarrollo o con variable explícita
      sourcemap: esProduccion ? 'hidden' : true,
      
      // Avisa si algún chunk supera 500KB (señal de que algo está mal)
      chunkSizeWarningLimit: 500,
      
      // Target moderno para navegadores de 2024+
      target: 'esnext',
      
      // Mejora la compresión de CSS
      cssMinify: esProduccion ? 'esbuild' : false,
      
      // Reportar tamaños comprimidos con gzip
      reportCompressedSize: true,
      
      // Configuración de Rollup para chunks óptimos
      rollupOptions: {
        output: {
          // Nombres con hash para cache busting efectivo en producción
          entryFileNames: esProduccion ? 'js/[name]-[hash].js' : '[name].js',
          chunkFileNames: esProduccion ? 'js/[name]-[hash].js' : '[name].js',
          assetFileNames: esProduccion  ? 'assets/[name]-[hash].[ext]'  : 'assets/[name].[ext]',
          
          // Code splitting inteligente para mejor cacheado
          manualChunks: esProduccion ? {
            // Vendor chunks separados para mejor cache de navegador
            'react-core': ['react', 'react-dom'],
            'router': ['react-router-dom'],
            'data-fetching': ['@tanstack/react-query'],
            'ui-libs': ['lucide-react', 'clsx', 'sonner'],
            'state': ['zustand']
          } : undefined
        },
        
        // Opciones de tree-shaking agresivo
        treeshake: esProduccion ? {
          moduleSideEffects: false,
          propertyReadSideEffects: false,
          tryCatchDeoptimization: false
        } : false
      }
    },

    // ========================================================================
    // PRE-BUNDLING DE DEPENDENCIAS (OPTIMIZACIÓN DEL COLD START)
    // ========================================================================
    optimizeDeps: {
      // Forzar pre-bundle de estas dependencias para arranque más rápido
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@tanstack/react-query',
        'zustand',
        'clsx',
        'lucide-react'
      ],
      // Excluir paquetes locales para que HMR funcione correctamente
      exclude: ['@paquetes/*'],
      
      // Usar esbuild para transformaciones (más rápido que babel)
      esbuildOptions: {
        target: 'esnext',
        // Soportar JSX en archivos .js para librerías legacy
        loader: { '.js': 'jsx' }
      }
    },

    // ========================================================================
    // PLUGINS
    // ========================================================================
    plugins: [
      // React SWC - más rápido que Babel para compilación
      react(),
      
      // Tailwind CSS v4 con soporte nativo de Vite
      tailwindcss()
    ],

    // Variables de entorno expuestas
    define: variablesParaVite,

    // ========================================================================
    // CONFIGURACIÓN DE ESBUILD
    // ========================================================================
    esbuild: {
      // Eliminar console.log y debugger en producción
      drop: esProduccion ? ['console', 'debugger'] : [],
      
      // Target moderno para mejor optimización
      target: 'esnext',
      
      // Mejor rendimiento al no verificar legal comments
      legalComments: 'none'
    },

    // ========================================================================
    // CACHÉ Y RENDIMIENTO
    // ========================================================================
    cacheDir: 'node_modules/.vite',
    
    // Logs solo con errores en producción
    logLevel: esProduccion ? 'error' : 'info',
    
    // Limpiar terminal en cada rebuild
    clearScreen: true
  }
})
