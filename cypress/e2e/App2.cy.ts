import userData from "../fixtures/userData.json";

const {
	gender,
	dateOfBirth,
	externalSupport,
	violenceLocation,
	violenceTime,
	supportTypes,
} = userData;

describe("ViolenceTime Step", () => {
	it("should render violence time options and proceed correctly", () => {
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
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.contains(
			"Por quanto tempo você sofreu ou tem sofrido violência?"
		).should("exist");

		Object.values(violenceTime).forEach((optionText) => {
			cy.findByRole("radio", { name: optionText }).should("be.visible");
		});

		// tenta continuar sem selecionar
		cy.findByRole("button", { name: "Enviar" }).click();
		cy.contains("Esse campo é obrigatório.").should("be.visible");

		cy.findByRole("radio", { name: violenceTime.isolatedEpisode }).click();

		cy.findByRole("button", { name: "Enviar" }).click();

		cy.contains("Cadastro realizado").should("exist");
	});
});
