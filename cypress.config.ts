import { defineConfig } from "cypress";

export default defineConfig({
	e2e: {
		baseUrl: "http://localhost:3000",
	},
	viewportWidth: 768,
	viewportHeight: 1366,
});
