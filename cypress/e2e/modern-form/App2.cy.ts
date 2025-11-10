import userData from "../../fixtures/userData.json";

const {
	gender,
	externalSupport,
	violenceOccurredInBrazil,
	violenceTime,
	dateOfBirth,
	supportTypes,
	perpetratorGenderId,
	livesWithPerpetrator,
} = userData;

describe("Happy path", () => {
	beforeEach(() => {
		cy.intercept("POST", "/handle-request", {
			statusCode: 200,
			body: {
				psychological: { supportRequestId: 1 },
				legal: { supportRequestId: 2 },
			},
		}).as("submitRegistration");
	});

	describe("Desktop", () => {
		beforeEach(() => {
			cy.viewport(1920, 1080);
		});

		it("should continue to next step if all fields are filled correctly", () => {
			cy.visit("/");
			cy.goThroughHomePage();

			cy.fillAllStepsApp2(supportTypes);
		});

		it("should go back to the previous step when the back button is clicked", () => {
			cy.visit("/cadastro");

			cy.fillGenderIdentityStep(gender);
			cy.findByRole("button", { name: "Continuar" }).click();

			cy.fillDateOfBirthStep(dateOfBirth);
			cy.findByRole("button", { name: "Continuar" }).click();

			cy.fillViolenceTypeStep();
			cy.findByRole("button", { name: "Continuar" }).click();

			cy.fillViolenceOccurredInBrazilStep(violenceOccurredInBrazil);
			cy.findByRole("button", { name: "Continuar" }).click();

			cy.fillExternalSupportStep(externalSupport);
			cy.findByRole("button", { name: "Continuar" }).click();

			cy.fillFinancialBlock();
			cy.findByRole("button", { name: "Continuar" }).click();

			cy.goThroughBeginRegistrationStep();
			cy.findByRole("button", { name: "Iniciar cadastro" }).click();

			cy.fillSupportTypeStep(supportTypes);
			cy.findByRole("button", { name: "Continuar" }).click();

			cy.fillBasicRegisterInformationStep();
			cy.findByRole("button", { name: "Continuar" }).click();

			cy.fillGeolocationStep();
			cy.findByRole("button", { name: "Continuar" }).click();

			cy.fillDiversityInformationStep();
			cy.findByRole("button", { name: "Continuar" }).click();

			cy.fillViolenceTimeStep();
			cy.findByRole("button", { name: "Continuar" }).click();

			cy.fillPerpetratorGenderIdStep(perpetratorGenderId);
			cy.findByRole("button", { name: "Continuar" }).click();

			cy.fillViolencePerpetratorStep();
			cy.findByRole("button", { name: "Continuar" }).click();

			cy.fillLivesWithPerpetratorStep(livesWithPerpetrator);
			cy.findByRole("button", { name: "Continuar" }).click();

			cy.fillViolenceLocationStep();
			cy.findByRole("button", { name: "Continuar" }).click();

			cy.fillLegalActionsTakenStep();
			cy.findByRole("button", { name: "Continuar" }).click();

			cy.fillPoliceReportDifficultyStep();
			cy.findByRole("button", { name: "Continuar" }).click();

			cy.fillProtectiveFactorsStep();
			cy.findByRole("button", { name: "Continuar" }).click();

			cy.fillRiskFactorsStep();
			cy.findByRole("button", { name: "Voltar para o passo anterior" }).click();

			cy.contains("Selecione as opções que se aplicam ao seu caso").should(
				"exist"
			);
		});
	});

	describe("Mobile", () => {
		beforeEach(() => {
			cy.viewport(390, 844);
		});

		it("should continue to next step if all fields are filled correctly", () => {
			cy.visit("/");
			cy.goThroughHomePage();

			cy.fillAllStepsApp2(supportTypes);
		});

		it("should go back to the previous step when the back button is clicked", () => {
			cy.visit("/cadastro");

			cy.fillGenderIdentityStep(gender);
			cy.findByRole("button", { name: "Continuar" }).click();

			cy.fillDateOfBirthStep(dateOfBirth);
			cy.findByRole("button", { name: "Continuar" }).click();

			cy.fillViolenceTypeStep();
			cy.findByRole("button", { name: "Continuar" }).click();

			cy.fillViolenceOccurredInBrazilStep(violenceOccurredInBrazil);
			cy.findByRole("button", { name: "Continuar" }).click();

			cy.fillExternalSupportStep(externalSupport);
			cy.findByRole("button", { name: "Continuar" }).click();

			cy.fillFinancialBlock();
			cy.findByRole("button", { name: "Continuar" }).click();

			cy.goThroughBeginRegistrationStep();
			cy.findByRole("button", { name: "Iniciar cadastro" }).click();

			cy.fillSupportTypeStep(supportTypes);
			cy.findByRole("button", { name: "Continuar" }).click();

			cy.fillBasicRegisterInformationStep();
			cy.findByRole("button", { name: "Continuar" }).click();

			cy.fillGeolocationStep();
			cy.findByRole("button", { name: "Continuar" }).click();

			cy.fillDiversityInformationStep();
			cy.findByRole("button", { name: "Continuar" }).click();

			cy.fillViolenceTimeStep();
			cy.findByRole("button", { name: "Continuar" }).click();

			cy.fillPerpetratorGenderIdStep(perpetratorGenderId);
			cy.findByRole("button", { name: "Continuar" }).click();

			cy.fillViolencePerpetratorStep();
			cy.findByRole("button", { name: "Continuar" }).click();

			cy.fillLivesWithPerpetratorStep(livesWithPerpetrator);
			cy.findByRole("button", { name: "Continuar" }).click();

			cy.fillViolenceLocationStep();
			cy.findByRole("button", { name: "Continuar" }).click();

			cy.fillLegalActionsTakenStep();
			cy.findByRole("button", { name: "Continuar" }).click();

			cy.fillPoliceReportDifficultyStep();
			cy.findByRole("button", { name: "Continuar" }).click();

			cy.fillProtectiveFactorsStep();
			cy.findByRole("button", { name: "Continuar" }).click();

			cy.fillRiskFactorsStep();
			cy.findByRole("button", { name: "Voltar para o passo anterior" }).click();

			cy.contains("Selecione as opções que se aplicam ao seu caso").should(
				"exist"
			);
		});
	});
});
