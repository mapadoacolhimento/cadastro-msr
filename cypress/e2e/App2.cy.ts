import userData from "../fixtures/userData.json";

const {
	gender,
	externalSupport,
	violenceLocation,
	violenceTime,
	dateOfBirth,
	supportTypes,
} = userData;

const SHOW_VIOLENCE_TIME_STEP =
	Cypress.env("NEXT_PUBLIC_ENABLE_NEW_STEPS") === true ||
	Cypress.env("NEXT_PUBLIC_ENABLE_NEW_STEPS") === "true";

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

	describe(
		"Desktop",
		{
			viewportHeight: 1080,
			viewportWidth: 1920,
		},
		() => {
			it("should successfully submit the form", () => {
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

				if (SHOW_VIOLENCE_TIME_STEP) {
					cy.findByRole("button", { name: "Continuar" }).click();

					cy.contains(
						"Por quanto tempo você sofreu ou tem sofrido violência?"
					).should("exist");

					cy.findByRole("button", { name: "Enviar" }).click();

					cy.findByRole("radio", {
						name: violenceTime.isolatedEpisode,
					}).click();
					cy.findByRole("button", { name: "Enviar" }).click();
				} else {
					// se a etapa estiver oculta, o botão 'Enviar' aparece na etapa anterior
					cy.findByRole("button", { name: "Enviar" }).click();
				}

				cy.wait("@submitRegistration");

				cy.contains("Cadastro realizado").should("be.visible");
			});

			it("should go back to the previous step when the back button is clicked", () => {
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

				if (SHOW_VIOLENCE_TIME_STEP) {
					cy.findByRole("button", { name: "Continuar" }).click();

					cy.findByRole("button", {
						name: "Voltar para o passo anterior",
					}).click();

					cy.contains("Seus dados").should("exist");
				} else {
					cy.findByRole("button", {
						name: "Voltar para o passo anterior",
					}).click();

					cy.contains("Seu endereço").should("exist");
				}
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
			it("should successfully submit the form after filling the Violence Time step", () => {
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

				if (SHOW_VIOLENCE_TIME_STEP) {
					cy.findByRole("button", { name: "Continuar" }).click();

					cy.contains(
						"Por quanto tempo você sofreu ou tem sofrido violência?"
					).should("exist");

					cy.findByRole("radio", {
						name: violenceTime.isolatedEpisode,
					}).click();
					cy.findByRole("button", { name: "Enviar" }).click();
				} else {
					cy.findByRole("button", { name: "Enviar" }).click();
				}

				cy.wait("@submitRegistration");
				cy.contains("Cadastro realizado").should("be.visible");
			});
		}
	);
});
