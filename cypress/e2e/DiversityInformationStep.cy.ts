import userData from "../fixtures/userData.json";

const { gender, externalSupport, violenceLocation, supportTypes, dateOfBirth } =
	userData;

describe("Diversity Form - Error Validation", () => {
	it.only("Should display error if disability is empty after selecting 'Yes' in hasDisability", () => {
		cy.visit("/");
		cy.goThroughHomePage();

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

		// Abre o dropdown "Você é PcD?"
		cy.findByRole("combobox", {
			name: "Você é PcD (Pessoa com deficiência)?",
		}).click();

		// Seleciona a opção "Sim"
		cy.findByRole("option", { name: "Sim" }).click();

		// Confirma que o campo "Qual deficiência você tem?" apareceu
		cy.findByRole("combobox", { name: "Qual deficiência você tem?" }).should(
			"be.visible"
		);

		// Clica no botão de envio sem preencher "disability"
		cy.findByRole("button", { name: /enviar/i }).click();

		// Verifica se a mensagem de erro apareceu
		cy.findByText("Selecione qual deficiência você tem.").should("be.visible");
	});
});
