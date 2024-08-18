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
	const sizes = [
		{
			name: "Desktop",
			viewportHeight: 1080,
			viewportWidth: 1920,
		},
		{
			name: "Mobile",
			viewportHeight: 844,
			viewportWidth: 390,
		},
	];

	describe("Home Page", () => {
		sizes.forEach((size) => {
			describe(
				size.name,
				{
					viewportHeight: size.viewportHeight,
					viewportWidth: size.viewportWidth,
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
	});

	describe("Fora criterios", () => {
		sizes.forEach((size) => {
			describe(
				size.name,
				{
					viewportHeight: size.viewportHeight,
					viewportWidth: size.viewportWidth,
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

	describe("Acolhimento andamento", () => {
		sizes.forEach((size) => {
			describe(
				size.name,
				{
					viewportHeight: size.viewportHeight,
					viewportWidth: size.viewportWidth,
				},
				() => {
					it("should pass the accessibility test", () => {
						cy.visit("/acolhimento-andamento");
						cy.injectAxe();
						cy.checkA11y(null, null, terminalLog);
					});
				}
			);
		});
	});

	describe("Cadastro finalizado", () => {
		sizes.forEach((size) => {
			describe(
				size.name,
				{
					viewportHeight: size.viewportHeight,
					viewportWidth: size.viewportWidth,
				},
				() => {
					it("should pass the accessibility test", () => {
						cy.visit("/cadastro-finalizado");
						cy.injectAxe();
						cy.checkA11y(null, null, terminalLog);
					});
				}
			);
		});
	});

	describe("Cadastro", () => {
		sizes.forEach((size) => {
			describe(
				size.name,
				{
					viewportHeight: size.viewportHeight,
					viewportWidth: size.viewportWidth,
				},
				() => {
					it("should pass the accessibility test on Date of Birth step", () => {
						cy.visit("/cadastro");
						cy.injectAxe();
						cy.checkA11y(null, null, terminalLog);
					});
				}
			);
		});
	});
});
