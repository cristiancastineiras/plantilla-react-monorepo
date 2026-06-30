// ============================================================================
// TSDOWN - PAQUETE @paquetes/api
// ============================================================================
// Empaqueta el cliente HTTP (Ky + tipos de API) con tsdown.
// Ky queda como dependencia externa.
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
	external: ["ky"],
})