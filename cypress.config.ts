import { defineConfig } from "cypress";

export default defineConfig({
	e2e: {
		baseUrl: "http://localhost:3000",
		setupNodeEvents(on) {
			on("task", {
				log(message) {
					console.log(message);

					return null;
				},
				table(message) {
					console.table(message);

					return null;
				},
			});
		},
	},
	viewportWidth: 1366,
	viewportHeight: 768,
});
