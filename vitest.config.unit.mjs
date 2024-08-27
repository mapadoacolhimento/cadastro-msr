import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [react(), tsconfigPaths()],
	test: {
		coverage: {
			include: ["src/**"],
			reporter: [["lcovonly", { file: "lcov-unit.info" }], "text"],
			clean: false,
		},
		environment: "jsdom",
		globals: true,
		setupFiles: ["./src/tests/unit-setup.ts"],
		exclude: ["node_modules", "cypress", "dist", "src/tests/integration/**"],
	},
});
