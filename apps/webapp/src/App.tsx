/**
 * Componente raíz de la aplicación.
 * 
 * Este es un ejemplo básico que demuestra:
 * - Importación de tipos desde paquetes compartidos
 * - Uso de TypeScript estricto con tipos explícitos
 * - Estructura básica de un componente funcional React 19
 */

import type { ModeloA } from "@paquetes/modelos"

function App(): React.JSX.Element {
  // Ejemplo de uso de un tipo compartido del monorepo
  // Los tipos se importan desde @paquetes/modelos
  const ejemplo: ModeloA = {
    nombre: "Plantilla React",
    descripcion: "Monorepo optimizado para producción con Vite, Turbo y pnpm",
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="text-center p-8 bg-white/10 backdrop-blur rounded-2xl shadow-xl max-w-md">
        <h1 className="text-3xl font-bold text-white mb-4">
          {ejemplo.nombre} 🚀
        </h1>
        <p className="text-slate-300 mb-6">{ejemplo.descripcion}</p>
        <code className="block bg-black/30 rounded-lg p-4 text-sm text-emerald-400 font-mono">
          pnpm dev
        </code>
      </div>
    </main>
  )
}

export default App
