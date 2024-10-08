import {
	gender,
	genderViolence,
	externalSupport,
	violenceLocation,
	dateOfBirth,
	financialNeed,
	supportTypes,
} from "../fixtures/userData.json";

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
					it("should pass the accessibility test on Gender Identity step", () => {
						cy.visit("/cadastro");

						cy.contains("Qual sua identidade de gênero?").should("exist");

						cy.injectAxe();
						cy.checkA11y(null, null, terminalLog);
					});

					it("should pass the accessibility test on Date of Birth step", () => {
						cy.visit("/cadastro");

						cy.fillGenderIdentityStep(gender);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.contains("Qual a sua data de nascimento?").should("exist");

						cy.injectAxe();
						cy.checkA11y(null, null, terminalLog);
					});

					it("should pass the accessibility test on Gender Violence step", () => {
						cy.visit("/cadastro");

						cy.fillGenderIdentityStep(gender);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillDateOfBirthStep(dateOfBirth);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.contains(
							"Você sofreu ou está sofrendo violência de gênero?"
						).should("exist");

						cy.injectAxe();
						cy.checkA11y(null, null, terminalLog);
					});

					it("should pass the accessibility test on Violence Location step", () => {
						cy.visit("/cadastro");

						cy.fillGenderIdentityStep(gender);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillDateOfBirthStep(dateOfBirth);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillGenderViolenceStep(genderViolence);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.contains("A violência ocorreu no Brasil?").should("exist");

						cy.injectAxe();
						cy.checkA11y(null, null, terminalLog);
					});

					it("should pass the accessibility test on External Support step", () => {
						cy.visit("/cadastro");

						cy.fillGenderIdentityStep(gender);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillDateOfBirthStep(dateOfBirth);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillGenderViolenceStep(genderViolence);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillViolenceLocationStep(violenceLocation);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.contains(
							"Você está em atendimento psicológico e/ou jurídico fora do Mapa do Acolhimento?"
						).should("exist");

						cy.injectAxe();
						cy.checkA11y(null, null, terminalLog);
					});

					it("should pass the accessibility test on Financial Need step", () => {
						cy.visit("/cadastro");

						cy.fillGenderIdentityStep(gender);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillDateOfBirthStep(dateOfBirth);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillGenderViolenceStep(genderViolence);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillViolenceLocationStep(violenceLocation);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillExternalSupportStep(externalSupport);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.contains(
							"Você declara que não pode pagar por atendimento jurídico/psicológico?"
						).should("exist");

						cy.injectAxe();
						cy.checkA11y(null, null, terminalLog);
					});

					it("should pass the accessibility test on Support Type step", () => {
						cy.visit("/cadastro");

						cy.fillGenderIdentityStep(gender);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillDateOfBirthStep(dateOfBirth);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillGenderViolenceStep(genderViolence);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillViolenceLocationStep(violenceLocation);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillExternalSupportStep(externalSupport);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillFinancialNeedStep(financialNeed);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.contains("Que tipo de acolhimento você precisa?").should(
							"exist"
						);

						cy.injectAxe();
						cy.checkA11y(null, null, terminalLog);
					});

					it("should pass the accessibility test on Basic Register Information step", () => {
						cy.visit("/cadastro");

						cy.fillGenderIdentityStep(gender);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillDateOfBirthStep(dateOfBirth);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillGenderViolenceStep(genderViolence);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillViolenceLocationStep(violenceLocation);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillExternalSupportStep(externalSupport);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillFinancialNeedStep(financialNeed);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillSupportTypeStep(supportTypes);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.get("#firstName").should("exist");

						cy.injectAxe();
						cy.checkA11y(null, null, terminalLog);
					});

					it("should pass the accessibility test on Geolocation step", () => {
						cy.visit("/cadastro");

						cy.fillGenderIdentityStep(gender);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillDateOfBirthStep(dateOfBirth);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillGenderViolenceStep(genderViolence);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillViolenceLocationStep(violenceLocation);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillExternalSupportStep(externalSupport);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillFinancialNeedStep(financialNeed);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillSupportTypeStep(supportTypes);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillBasicRegisterInformationStep();
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.findByRole("heading", { name: "Seu endereço" }).should("exist");

						cy.injectAxe();
						cy.checkA11y(null, null, terminalLog);
					});

					it("should pass the accessibility test on Diversity Information step", () => {
						cy.visit("/cadastro");

						cy.fillGenderIdentityStep(gender);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillDateOfBirthStep(dateOfBirth);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillGenderViolenceStep(genderViolence);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillViolenceLocationStep(violenceLocation);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillExternalSupportStep(externalSupport);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillFinancialNeedStep(financialNeed);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillSupportTypeStep(supportTypes);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillBasicRegisterInformationStep();
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillGeolocationStep();
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.contains("Você é PcD (Pessoa com deficiência)?").should("exist");

						cy.injectAxe();
						cy.checkA11y(null, null, terminalLog);
					});
				}
			);
		});
	});
});
