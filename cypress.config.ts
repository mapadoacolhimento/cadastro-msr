import { defineConfig } from "cypress";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

export default defineConfig({
	e2e: {
		baseUrl: "http://localhost:3000",
		env: {
			NEXT_PUBLIC_ENABLE_NEW_STEPS: false,
		},
		setupNodeEvents(on, config) {
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
			return config;
		},
	},
	viewportWidth: 1366,
	viewportHeight: 768,
});
