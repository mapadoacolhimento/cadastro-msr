/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

import "@testing-library/cypress/add-commands";
import userData from "../fixtures/userData.json";

Cypress.Commands.add("goThroughHomePage", () => {
	cy.findByRole("button", { name: "Quero ser acolhida" }).click();
});

Cypress.Commands.add(
	"fillDateOfBirthStep",
	(dateOfBirth = userData.dateOfBirth) => {
		cy.findByRole("heading", { name: "Sobre você" }).should("exist");
		cy.findByRole("textbox").should("be.visible").type(dateOfBirth);
	}
);

Cypress.Commands.add("fillBasicRegisterInformationStep", () => {
	const { firstName, email, confirmEmail, phone } = userData;

	cy.findByRole("heading", { name: "Seus dados" }).should("exist");
	cy.get("#firstName").type(firstName);
	cy.get("#email").type(email);
	cy.get("#confirmEmail").type(confirmEmail);
	cy.get("#phone").type(phone);
});

Cypress.Commands.add("fillDiversityInformationStep", () => {
	const { hasDisability, colorOption } = userData;

	cy.findByRole("heading", { name: "Seus dados" }).should("exist");
	cy.get("#color").click();
	cy.contains(colorOption).should("be.visible").click();
	cy.findByRole("combobox", {
		name: "Você é PcD (Pessoa com deficiência)?",
	}).type(`${hasDisability}{enter}`);
});

Cypress.Commands.add("fillGeolocationStep", () => {
	const { zipcode, neighborhood, state, city } = userData;
	cy.findByRole("heading", { name: "Seu endereço" }).should("exist");

	// zipcode
	cy.findByLabelText("CEP").type(zipcode).blur();

	// neighborhood
	cy.findByLabelText("Bairro").type(neighborhood);

	// state
	cy.findByRole("combobox", { name: "Estado" }).click();
	cy.findByRole("option", { name: state }).click();

	// city
	cy.findByRole("combobox", { name: "Cidade" }).click();
	cy.findByRole("option", { name: city }).click();
});

Cypress.Commands.add("fillGenderIdentityStep", (gender: string) => {
	cy.contains("Qual sua identidade de gênero?").should("exist");
	cy.findByRole("radio", { name: gender }).click();
});

Cypress.Commands.add("fillAcceptsOnlineSupportStep", () => {
	const { acceptOnlineSupport } = userData;

	cy.findByRole("heading", { name: "Sobre o acolhimento" }).should("exist");
	cy.contains("Você aceitaria ser atendida online?").should("exist");
	cy.findByRole("radio", {
		name: acceptOnlineSupport.yes,
	}).should("exist");
	cy.findByRole("radio", {
		name: acceptOnlineSupport.no,
	}).should("exist");

	cy.findByRole("radio", {
		name: acceptOnlineSupport.yes,
	}).click();
});

Cypress.Commands.add("fillSupportTypeStep", () => {
	const { supportTypes } = userData;
	cy.contains("Que tipo de acolhimento você precisa?").should("exist");
	cy.findByLabelText(supportTypes.psychological).click({ force: true });
	cy.findByLabelText(supportTypes.legal).click({ force: true });
});

Cypress.Commands.add("fillGenderViolenceStep", (option: string) => {
	cy.contains("Você sofreu ou está sofrendo violência de gênero?").should(
		"exist"
	);
	cy.findByLabelText(option).click({ force: true });
});

Cypress.Commands.add("fillViolenceLocationStep", (option: string) => {
	cy.contains("A violência ocorreu no Brasil?").should("exist");
	cy.findByLabelText(option).click({ force: true });
});

Cypress.Commands.add("fillExternalSupportStep", (option: string) => {
	cy.contains(
		"Você está recebendo acompanhamento jurídico pela defensoria pública?"
	).should("exist");
	cy.findByLabelText(option).click({ force: true });
});

Cypress.Commands.add("fillFinancialNeedStep", (option: string) => {
	cy.contains(
		"Você declara que não pode pagar por atendimento jurídico/psicológico?"
	).should("exist");
	cy.findByLabelText(option).click({ force: true });
});

export {};
