// ============================================================================
// TSDOWN - PAQUETE @paquetes/estados
// ============================================================================
// Empaqueta stores de Zustand con tsdown. Zustand queda como dependencia
// externa para evitar duplicación con la app consumidora.
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
	external: ["react", "zustand"],
})