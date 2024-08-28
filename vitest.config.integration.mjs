import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [react(), tsconfigPaths()],
	test: {
		poolOptions: {
			threads: {
				singleThread: true,
			},
		},
		include: ["src/tests/integration/__tests__/**"],
		coverage: {
			include: ["src/tests/integration/__tests__/**"],
			reporter: [["lcovonly", { file: "lcov-int.info" }], "text"],
			clean: false,
		},
		environment: "jsdom",
		globals: true,
		setupFiles: ["src/tests/integration/helpers/setup.ts"],
		exclude: ["node_modules", "cypress", "dist"],
	},
});
