// ============================================================================
// TSDOWN - PAQUETE @paquetes/modelos
// ============================================================================
// Empaqueta tipos e interfaces compartidas. No tiene dependencias externas
// (solo tipos de TypeScript). El bundle resultante es mínimo.
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