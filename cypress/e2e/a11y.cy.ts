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

					it("should pass the accessibility test on Violence Type step", () => {
						cy.visit("/cadastro");

						cy.fillGenderIdentityStep(gender);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillDateOfBirthStep(dateOfBirth);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.contains(
							"Quais tipos de violência você sofreu ou está sofrendo?"
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

						cy.fillViolenceTypeStep();
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

						cy.fillViolenceTypeStep();
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

						cy.fillViolenceTypeStep();
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

					it("should pass the accessibility test on begin registration step", () => {
						cy.visit("/cadastro");

						cy.fillGenderIdentityStep(gender);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillDateOfBirthStep(dateOfBirth);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillViolenceTypeStep();
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillViolenceLocationStep(violenceLocation);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillExternalSupportStep(externalSupport);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillFinancialNeedStep(financialNeed);
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

						cy.fillViolenceTypeStep();
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillViolenceLocationStep(violenceLocation);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillExternalSupportStep(externalSupport);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillFinancialNeedStep(financialNeed);
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

						cy.fillViolenceTypeStep();
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillViolenceLocationStep(violenceLocation);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillExternalSupportStep(externalSupport);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillFinancialNeedStep(financialNeed);
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

						cy.fillViolenceTypeStep();
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillViolenceLocationStep(violenceLocation);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillExternalSupportStep(externalSupport);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillFinancialNeedStep(financialNeed);
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

						cy.fillViolenceTypeStep();
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillViolenceLocationStep(violenceLocation);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillExternalSupportStep(externalSupport);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.fillFinancialNeedStep(financialNeed);
						cy.findByRole("button", { name: "Continuar" }).click();

						cy.findByRole("button", { name: "Iniciar cadastro" }).click();

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

					describe.skip("Financial Block", () => {
						beforeEach(() => {
							cy.visit("/cadastro");

							cy.fillGenderIdentityStep(gender);
							cy.findByRole("button", { name: "Continuar" }).click();

							cy.fillDateOfBirthStep(dateOfBirth);
							cy.findByRole("button", { name: "Continuar" }).click();

							cy.fillViolenceTypeStep();
							cy.findByRole("button", { name: "Continuar" }).click();

							cy.fillViolenceLocationStep(violenceLocation);
							cy.findByRole("button", { name: "Continuar" }).click();

							cy.fillExternalSupportStep(externalSupport);
							cy.findByRole("button", { name: "Continuar" }).click();
						});

						it("should pass the accessibility test on MonthlyIncome step", () => {
							cy.contains("Você tem renda mensal?").should("exist");

							cy.injectAxe();
							cy.checkA11y(null, null, terminalLog);
						});

						it("should pass the accessibility test on MonthlyIncomeRange step", () => {
							cy.fillMonthlyIncomeStep();
							cy.contains(
								"Assinale a opção que corresponde a sua renda individual (per capita):"
							).should("exist");

							cy.injectAxe();
							cy.checkA11y(null, null, terminalLog);
						});

						it("should pass the accessibility test on EmploymentStatus step", () => {
							cy.fillMonthlyIncomeStep();
							cy.fillMonthlyIncomeRangeStep();

							cy.contains("Qual a sua situação de trabalho?").should("exist");

							cy.injectAxe();
							cy.checkA11y(null, null, terminalLog);
						});

						it("should pass the accessibility test on Dependants step", () => {
							cy.fillMonthlyIncomeStep();
							cy.fillMonthlyIncomeRangeStep();
							cy.fillEmploymentStatusStep();

							cy.contains(
								"Você tem pessoas que são dependentes financeiramente da sua renda?"
							).should("exist");

							cy.injectAxe();
							cy.checkA11y(null, null, terminalLog);
						});

						it("should pass the accessibility test on FamilyProvider step", () => {
							cy.fillMonthlyIncomeStep();
							cy.fillMonthlyIncomeRangeStep();
							cy.fillEmploymentStatusStep();
							cy.fillDependantsStep();

							cy.contains(
								"Você é responsável financeiramente pela renda familiar"
							).should("exist");

							cy.injectAxe();
							cy.checkA11y(null, null, terminalLog);
						});

						it("should pass the accessibility test on PropertyOwnership step", () => {
							cy.fillMonthlyIncomeStep();
							cy.fillMonthlyIncomeRangeStep();
							cy.fillEmploymentStatusStep();
							cy.fillDependantsStep();
							cy.fillFamilyProviderStep();

							cy.contains(
								"Você possui bens imóveis (casa, apartamento) em seu nome?"
							).should("exist");

							cy.injectAxe();
							cy.checkA11y(null, null, terminalLog);
						});
					});
				}
			);
		});
	});
});
