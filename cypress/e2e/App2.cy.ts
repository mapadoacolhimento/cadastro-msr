// //TODO: arquivo deve ser descomentado uma vez que todos os passos do novo cadastro estejam implementados. Até lá, é possível descomentar o teste e usá-lo
// //localmente alterando o valor da variável de ambiente setada no cypress.config

// import userData from "../fixtures/userData.json";

// const {
// 	gender,
// 	externalSupport,
// 	violenceLocation,
// 	violenceTime,
// 	dateOfBirth,
// 	supportTypes,
// 	violenceGenderId
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

// 		it("should continue to next step if all fields are filled correctly", () => {
// 				cy.visit("/");
// 				cy.goThroughHomePage();

// 				cy.fillAllSteps(supportTypes);
// 			});

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
// 			cy.findByRole("button", { name: "Continuar" }).click();

// 			cy.fillViolenceGenderIdStep(violenceGenderId);

// 			cy.findByRole("button", { name: "Voltar para o passo anterior" }).click();
// 			cy.contains("Dados da Violência").should("exist");
// 		});
// 	});

// 	describe("New Steps added (Mobile)", () => {
// 		beforeEach(() => {
// 			cy.viewport(390, 844);
// 		});

// 		it("should continue to next step if all fields are filled correctly", () => {
// 				cy.visit("/");
// 				cy.goThroughHomePage();

// 				cy.fillAllSteps(supportTypes);
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
// 			cy.findByRole("button", { name: "Continuar" }).click();

// 			cy.fillViolenceGenderIdStep(violenceGenderId);

// 			cy.findByRole("button", { name: "Voltar para o passo anterior" }).click();
// 			cy.contains("Dados da Violência").should("exist");
// 		});
// 	});
// });
