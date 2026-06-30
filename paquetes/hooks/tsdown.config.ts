// ============================================================================
// TSDOWN - PAQUETE @paquetes/hooks
// ============================================================================
// Empaqueta hooks de React con tsdown. React queda como dependencia externa.
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
	external: ["react", "react-dom"],
})