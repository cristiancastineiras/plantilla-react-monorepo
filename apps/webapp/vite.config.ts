import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'node:path'
import fs from 'node:fs'
import dotenv from 'dotenv'
import tailwindcss from '@tailwindcss/vite'

// Crea alias de Vite automáticamente desde los paquetes en la carpeta 'paquetes'
function crearAliasDesdePaquetes() {
  const directorioPaquetes = path.resolve(__dirname, '../../paquetes')
  const alias: Record<string, string> = {}

  for (const carpeta of fs.readdirSync(directorioPaquetes)) {
    const rutaPackageJson = path.join(directorioPaquetes, carpeta, 'package.json')

    if (!fs.existsSync(rutaPackageJson)) continue

    const packageJson = JSON.parse(
      fs.readFileSync(rutaPackageJson, 'utf-8')
    )

    if (!packageJson.name?.startsWith('@paquetes/')) continue

    const raizPaquete = path.join(directorioPaquetes, carpeta)
    const rutaSrc = path.join(raizPaquete, 'src')

    // Si existe src, usamos src; si no, la raíz del paquete
    alias[packageJson.name] = fs.existsSync(rutaSrc)
      ? rutaSrc
      : raizPaquete
  }

  console.log('Alias generados automáticamente:', alias)

  return alias
}

// Resuelve referencias entre variables de entorno
function resolverVariablesEntorno(
  variables: Record<string, string>
): Record<string, string> {
  const resultado: Record<string, string> = { ...variables }
  const patron = /\$\{([A-Z0-9_]+)\}/g

  let hayCambios: boolean

  do {
    hayCambios = false

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
  } while (hayCambios)

  return resultado
}

// Genera un archivo de tipos TypeScript para las variables de entorno
function generarTiposEnv(
  variables: Record<string, string>,
  rutaSalida: string
) {
  const lineas = Object.keys(variables)
    .sort()
    .map(
      (clave) => `    readonly ${clave}: string;`
    )
    .join('\n')

  const contenido = `/// <reference types="vite/client" />

interface ImportMetaEnv {
${lineas}
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
`

  fs.writeFileSync(rutaSalida, contenido, { encoding: 'utf-8' })

  console.log('Archivo de tipos generado:', rutaSalida)
}

export default defineConfig(({ mode }) => {
  const carpetaEntornos = path.resolve(__dirname, 'entorno')
  console.log('Carpeta de entornos:', carpetaEntornos)

  const rutaArchivoEnv = path.join(carpetaEntornos, `.env.${mode}`)
  console.log('Archivo de entorno cargado:', rutaArchivoEnv)

  const variablesCrudas =
    dotenv.config({ path: rutaArchivoEnv }).parsed || {}

  // Resolver referencias entre variables
  const variablesResueltas = resolverVariablesEntorno(variablesCrudas)

  // Generar tipos para autocompletado
  const carpetaSrc = path.resolve(__dirname, 'src')
  generarTiposEnv(
    variablesResueltas,
    path.resolve(carpetaSrc, 'vite-env.d.ts')
  )

  // Exponer variables a import.meta.env
  const variablesParaVite: Record<string, string> = {}

  for (const clave in variablesResueltas) {
    variablesParaVite[`import.meta.env.${clave}`] =
      JSON.stringify(variablesResueltas[clave])
  }

  console.log('Variables expuestas a Vite:', variablesParaVite)

  return {
    server: {
      port: Number(variablesCrudas.VITE_PUERTO),
      strictPort: true,
      fs: {
        allow: [
          path.resolve(__dirname, '../..'),           // raíz del monorepo
          path.resolve(__dirname, '../../paquetes')   // paquetes compartidos
        ]
      }
    },

    resolve: {
      alias: crearAliasDesdePaquetes()
    },

    base: variablesCrudas.VITE_BASE_PATH ?? '/',
    envDir: './entorno',

    minify: false,
    sourcemap: true,

    build: {
      outDir: 'dist',
      minify: false,
      sourcemap: true,
      rollupOptions: {
        output: {
          format: 'es',
          entryFileNames: '[name].js',
          chunkFileNames: '[name].js',
          assetFileNames: '[name].[ext]'
        }
      }
    },

    plugins: [react(), tailwindcss()],
    define: variablesParaVite
  }
})
