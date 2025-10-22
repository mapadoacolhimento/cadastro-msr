//TODO: arquivo deve ser descomentado uma vez que todos os passos do novo cadastro estejam implementados. Até lá, é possível descomentar o teste e usá-lo
//localmente alterando o valor da variável de ambiente setada no cypress.config

// import userData from "../fixtures/userData.json";

// const {
// 	gender,
// 	externalSupport,
// 	violenceLocation,
// 	violenceTime,
// 	dateOfBirth,
// 	supportTypes,
// } = userData;

// describe("Happy path", () => {
// 	beforeEach(() => {
// 		cy.intercept("POST", "/handle-request", {
// 			statusCode: 200,
// 			body: {
// 				psychological: { supportRequestId: 1 },
// 				legal: { supportRequestId: 2 },
// 			},
// 		}).as("submitRegistration");
// 	});

// 	describe("New Steps added (Desktop)", () => {

// 		beforeEach(() => {
// 			cy.viewport(1920, 1080);
// 		});

// 		it("should successfully submit the form", () => {
// 			cy.visit("/cadastro");

// 			cy.fillGenderIdentityStep(gender);
// 			cy.findByRole("button", { name: "Continuar" }).click();

// 			cy.fillDateOfBirthStep(dateOfBirth);
// 			cy.findByRole("button", { name: "Continuar" }).click();

// 			cy.fillViolenceTypeStep();
// 			cy.findByRole("button", { name: "Continuar" }).click();

// 			cy.fillViolenceLocationStep(violenceLocation);
// 			cy.findByRole("button", { name: "Continuar" }).click();

// 			cy.fillExternalSupportStep(externalSupport);
// 			cy.findByRole("button", { name: "Continuar" }).click();

// 			cy.fillFinancialBlock();
// 			cy.findByRole("button", { name: "Continuar" }).click();

// 			cy.goThroughBeginRegistrationStep();
// 			cy.findByRole("button", { name: "Iniciar cadastro" }).click();

// 			cy.fillSupportTypeStep(supportTypes);
// 			cy.findByRole("button", { name: "Continuar" }).click();

// 			cy.fillBasicRegisterInformationStep();
// 			cy.findByRole("button", { name: "Continuar" }).click();

// 			cy.fillGeolocationStep();
// 			cy.findByRole("button", { name: "Continuar" }).click();

// 			cy.fillDiversityInformationStep();
// 			cy.findByRole("button", { name: "Continuar" }).click();

// 			cy.fillViolenceTimeStep();
// 			cy.findByRole("radio", { name: violenceTime.isolatedEpisode }).click();
// 			cy.findByRole("button", { name: "Enviar" }).click();

// 			cy.wait("@submitRegistration");
// 			cy.contains("Cadastro realizado").should("be.visible");
// 		});

// 		it("should go back to the previous step when the back button is clicked", () => {
// 			cy.visit("/cadastro");

// 			cy.fillGenderIdentityStep(gender);
// 			cy.findByRole("button", { name: "Continuar" }).click();

// 			cy.fillDateOfBirthStep(dateOfBirth);
// 			cy.findByRole("button", { name: "Continuar" }).click();

// 			cy.fillViolenceTypeStep();
// 			cy.findByRole("button", { name: "Continuar" }).click();

// 			cy.fillViolenceLocationStep(violenceLocation);
// 			cy.findByRole("button", { name: "Continuar" }).click();

// 			cy.fillExternalSupportStep(externalSupport);
// 			cy.findByRole("button", { name: "Continuar" }).click();

// 			cy.fillFinancialBlock();
// 			cy.findByRole("button", { name: "Continuar" }).click();

// 			cy.goThroughBeginRegistrationStep();
// 			cy.findByRole("button", { name: "Iniciar cadastro" }).click();

// 			cy.fillSupportTypeStep(supportTypes);
// 			cy.findByRole("button", { name: "Continuar" }).click();

// 			cy.fillBasicRegisterInformationStep();
// 			cy.findByRole("button", { name: "Continuar" }).click();

// 			cy.fillGeolocationStep();
// 			cy.findByRole("button", { name: "Continuar" }).click();

// 			cy.fillDiversityInformationStep();
// 			cy.findByRole("button", { name: "Continuar" }).click();

// 			cy.fillViolenceTimeStep();

// 			cy.findByRole("button", { name: "Voltar para o passo anterior" }).click();
// 			cy.contains("Seus dados").should("exist");
// 		});
// 	});

// 	describe("Mobile", () => {
// 		before(() => {
// 			cy.viewport(390, 844);
// 			Cypress.env("NEXT_PUBLIC_ENABLE_NEW_STEPS", true);
// 		});

// 		it("should successfully submit the form after filling the Violence Time step", () => {
// 			cy.visit("/cadastro");

// 			cy.fillGenderIdentityStep(gender);
// 			cy.findByRole("button", { name: "Continuar" }).click();

// 			cy.fillDateOfBirthStep(dateOfBirth);
// 			cy.findByRole("button", { name: "Continuar" }).click();

// 			cy.fillViolenceTypeStep();
// 			cy.findByRole("button", { name: "Continuar" }).click();

// 			cy.fillViolenceLocationStep(violenceLocation);
// 			cy.findByRole("button", { name: "Continuar" }).click();

// 			cy.fillExternalSupportStep(externalSupport);
// 			cy.findByRole("button", { name: "Continuar" }).click();

// 			cy.fillFinancialBlock();
// 			cy.findByRole("button", { name: "Continuar" }).click();

// 			cy.goThroughBeginRegistrationStep();
// 			cy.findByRole("button", { name: "Iniciar cadastro" }).click();

// 			cy.fillSupportTypeStep(supportTypes);
// 			cy.findByRole("button", { name: "Continuar" }).click();

// 			cy.fillBasicRegisterInformationStep();
// 			cy.findByRole("button", { name: "Continuar" }).click();

// 			cy.fillGeolocationStep();
// 			cy.findByRole("button", { name: "Continuar" }).click();

// 			cy.fillDiversityInformationStep();
// 			cy.findByRole("button", { name: "Continuar" }).click();

// 			cy.contains(
// 				"Por quanto tempo você sofreu ou tem sofrido violência?"
// 			).should("exist");

// 			cy.findByRole("radio", { name: violenceTime.isolatedEpisode }).click();
// 			cy.findByRole("button", { name: "Enviar" }).click();

// 			cy.wait("@submitRegistration");
// 			cy.contains("Cadastro realizado").should("be.visible");
// 		});
// 	});
// });
