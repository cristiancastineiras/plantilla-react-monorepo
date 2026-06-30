// ============================================================================
// TSDOWN - PAQUETE @paquetes/componentes
// ============================================================================
// Empaqueta la librería de componentes React con tsdown (powered by Rolldown).
// React y react-dom quedan como dependencias externas: no se incluyen en el
// bundle final para evitar duplicación y mejorar el tree-shaking en la app
// consumidora.
// ============================================================================

import { defineConfig } from "tsdown"

export default defineConfig({
	entry: ["./src/index.ts"],
	format: ["esm"],
	platform: "neutral",
	dts: true,
	sourcemap: true,
	clean: true,
	treeshake: true,
	external: ["react", "react-dom", "react/jsx-runtime"],
})