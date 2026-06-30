// ============================================================================
// TSDOWN - PAQUETE @paquetes/utiles
// ============================================================================
// Empaqueta utilidades genéricas (helpers, formateadores, validadores).
// No tiene dependencias externas por defecto.
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
})