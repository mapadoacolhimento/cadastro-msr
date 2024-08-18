function terminalLog(violations) {
	cy.task(
		"log",
		`${violations.length} accessibility violation${
			violations.length === 1 ? "" : "s"
		} ${violations.length === 1 ? "was" : "were"} detected`
	);
	// pluck specific keys to keep the table readable
	const violationData = violations.map(
		({ id, impact, description, nodes }) => ({
			id,
			impact,
			description,
			nodes: nodes.length,
		})
	);

	cy.task("table", violationData);
}

describe("Accessbility", () => {
	describe("Home Page", () => {
		describe(
			"Desktop",
			{
				viewportHeight: 1080,
				viewportWidth: 1920,
			},
			() => {
				it("should pass the accessibility test", () => {
					cy.visit("/");
					cy.injectAxe();
					cy.checkA11y(null, null, terminalLog);
				});
			}
		);
		describe(
			"Mobile",
			{
				viewportHeight: 844,
				viewportWidth: 390,
			},
			() => {
				it("should pass the accessibility test", () => {
					cy.visit("/");
					cy.injectAxe();
					cy.checkA11y(null, null, terminalLog);
				});
			}
		);
	});
	describe("Fora criterios", () => {
		describe(
			"Desktop",
			{
				viewportHeight: 1080,
				viewportWidth: 1920,
			},
			() => {
				it("should pass the accessibility test", () => {
					cy.visit("/fora-criterios");
					cy.injectAxe();
					cy.checkA11y(null, null, terminalLog);
				});
			}
		);
		describe(
			"Mobile",
			{
				viewportHeight: 844,
				viewportWidth: 390,
			},
			() => {
				it("should pass the accessibility test", () => {
					cy.visit("/fora-criterios");
					cy.injectAxe();
					cy.checkA11y(null, null, terminalLog);
				});
			}
		);
	});
});
