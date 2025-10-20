import {
	gender,
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

	describe("Pedido acolhimento", () => {
		sizes.forEach((size) => {
			describe(
				size.name,
				{
					viewportHeight: size.viewportHeight,
					viewportWidth: size.viewportWidth,
				},
				() => {
					it("MatchFound -> should pass the accessibility test", () => {
						cy.visit(
							"/pedido-acolhimento?psychologicalSupportRequestId=1&legalSupportRequestId=2"
						);
						cy.injectAxe();
						cy.checkA11y(null, null, terminalLog);
					});
					it("MatchNotFound -> should pass the accessibility test", () => {
						cy.visit("/pedido-acolhimento?legalSupportRequestId=2");
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

					it("should pass the accessibility test on Violence Location step", () => {
						cy.visit("/cadastro");

						it("should pass the accessibility test on Violence Type step", () => {
							cy.visit("/cadastro");

							cy.fillGenderIdentityStep(gender);
							cy.findByRole("button", { name: "Continuar" }).click();

							cy.fillDateOfBirthStep(dateOfBirth);
							cy.findByRole("button", { name: "Continuar" }).click();

							cy.findByRole("heading", { name: "Sobre a violência" }).should(
								"exist"
							);
							cy.contains("A violência ocorreu no Brasil?").should(
								"be.visible"
							);

							cy.injectAxe();
							cy.checkA11y(null, null, terminalLog);
						});

						cy.fillGenderIdentityStep(gender);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillDateOfBirthStep(dateOfBirth);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.contains("A violência ocorreu no Brasil?").should("exist");

						//cy.fillViolenceTypeStep();
						//cy.findByRole("button", { name: "Continuar" }).click();

						cy.injectAxe();
						cy.checkA11y(null, null, terminalLog);
					});

					it("should pass the accessibility test on External Support step", () => {
						cy.visit("/cadastro");

						cy.fillGenderIdentityStep(gender);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillDateOfBirthStep(dateOfBirth);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillViolenceLocationStep(violenceLocation);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillViolenceTypeStep();
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.contains(
							"Você está em atendimento psicológico e/ou jurídico fora do Mapa do Acolhimento?"
						).should("exist");

						cy.injectAxe();
						cy.checkA11y(null, null, terminalLog);
					});

					it("should pass the accessibility test on begin registration step", () => {
						cy.visit("/cadastro");

						cy.fillGenderIdentityStep(gender);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillDateOfBirthStep(dateOfBirth);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillViolenceLocationStep(violenceLocation);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillViolenceTypeStep();
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillExternalSupportStep(externalSupport);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillFinancialBlock();
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.contains("Você não está sozinha").should("exist");

						cy.injectAxe();
						cy.checkA11y(null, null, terminalLog);
					});

					it("should pass the accessibility test on Support Type step", () => {
						cy.visit("/cadastro");

						cy.fillGenderIdentityStep(gender);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillDateOfBirthStep(dateOfBirth);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillViolenceLocationStep(violenceLocation);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillViolenceTypeStep();
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillExternalSupportStep(externalSupport);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillFinancialBlock();
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.findByRole("button", { name: "Iniciar cadastro" }).click();

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

						cy.fillViolenceLocationStep(violenceLocation);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillViolenceTypeStep();
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillExternalSupportStep(externalSupport);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillFinancialBlock();
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.findByRole("button", { name: "Iniciar cadastro" }).click();

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

						cy.fillViolenceLocationStep(violenceLocation);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillViolenceTypeStep();
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillExternalSupportStep(externalSupport);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillFinancialBlock();
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.findByRole("button", { name: "Iniciar cadastro" }).click();

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

						cy.fillViolenceLocationStep(violenceLocation);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillViolenceTypeStep();
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillExternalSupportStep(externalSupport);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillFinancialBlock();
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.findByRole("button", { name: "Iniciar cadastro" }).click();

						cy.fillSupportTypeStep(supportTypes);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillBasicRegisterInformationStep();
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillGeolocationStep();
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.contains("Cor").should("exist");

						cy.injectAxe();
						cy.checkA11y(null, null, terminalLog);
					});
					describe("Financial block", () => {
						beforeEach(() => {
							cy.visit("/cadastro");

							cy.fillGenderIdentityStep(gender);
							cy.findByRole("button", { name: "Continuar" }).click();

							cy.fillDateOfBirthStep(dateOfBirth);
							cy.findByRole("button", { name: "Continuar" }).click();

							cy.fillViolenceLocationStep(violenceLocation);
							cy.findByRole("button", { name: "Continuar" }).click();

							cy.fillViolenceTypeStep();
							cy.findByRole("button", { name: "Continuar" }).click();

							cy.fillExternalSupportStep(externalSupport);
							cy.findByRole("button", { name: "Continuar" }).click();
						});

						it("should pass the accessibility test on Monthly Income step", () => {
							cy.contains("Você tem renda mensal?").should("be.visible");

							cy.injectAxe();
							cy.checkA11y(null, null, terminalLog);
						});

						it("should pass the accessibility test on Monthly Income Range step", () => {
							cy.fillMonthlyIncomeStep();
							cy.contains(
								"Assinale a opção que corresponde a sua renda individual (per capita):"
							).should("be.visible");

							cy.injectAxe();
							cy.checkA11y(null, null, terminalLog);
						});

						it("should pass the accessibility test on Employment Status step", () => {
							cy.fillMonthlyIncomeStep();
							cy.fillMonthlyIncomeRangeStep();

							cy.contains("Qual a sua situação de trabalho?").should(
								"be.visible"
							);

							cy.injectAxe();
							cy.checkA11y(null, null, terminalLog);
						});

						it("should pass the accessibility test on Dependants step", () => {
							cy.fillMonthlyIncomeStep();
							cy.fillMonthlyIncomeRangeStep();
							cy.fillEmploymentStatusStep();

							cy.contains(
								"Você tem pessoas que são dependentes financeiramente da sua renda?"
							).should("be.visible");

							cy.injectAxe();
							cy.checkA11y(null, null, terminalLog);
						});

						it("should pass the accessibility test on Family Provider step", () => {
							cy.fillMonthlyIncomeStep();
							cy.fillMonthlyIncomeRangeStep();
							cy.fillEmploymentStatusStep();
							cy.fillDependantsStep();

							cy.contains(
								'Você é responsável financeiramente pela renda familiar (é considerada a "chefe de família")?'
							).should("be.visible");

							cy.injectAxe();
							cy.checkA11y(null, null, terminalLog);
						});

						it("should pass the accessibility test on Property Ownership step", () => {
							cy.fillFinancialBlock();

							cy.contains(
								"Você possui bens imóveis (casa, apartamento) em seu nome?"
							).should("be.visible");

							cy.injectAxe();
							cy.checkA11y(null, null, terminalLog);
						});
					});
				}
			);
		});
	});
});
