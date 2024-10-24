/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

import "@testing-library/cypress/add-commands";
import {
	firstName,
	email,
	confirmEmail,
	phone,
	hasDisability,
	acceptOnlineSupport,
	colorOption,
	gender,
	genderViolence,
	externalSupport,
	violenceLocation,
	financialNeed,
	dateOfBirth,
	zipcode,
	neighborhood,
	state,
	city,
} from "../fixtures/userData.json";

Cypress.Commands.add("goThroughHomePage", () => {
	cy.findByRole("link", { name: "Quero ser acolhida" }).click();
});

Cypress.Commands.add("fillDateOfBirthStep", (dateOfBirth) => {
	cy.findByRole("heading", { name: "Sobre você" }).should("exist");
	cy.findByRole("textbox").should("be.visible").type(dateOfBirth);
});

Cypress.Commands.add("fillBasicRegisterInformationStep", () => {
	cy.findByRole("heading", { name: "Seus dados" }).should("exist");
	cy.get("#firstName").type(firstName);
	cy.get("#email").type(email);
	cy.get("#confirmEmail").type(confirmEmail);
	cy.get("#phone").type(phone);
});

Cypress.Commands.add("fillDiversityInformationStep", () => {
	cy.findByRole("heading", { name: "Seus dados" }).should("exist");
	cy.findByRole("combobox", {
		name: "Cor",
	}).click();
	cy.contains(colorOption).should("be.visible").click();
	cy.findByRole("combobox", {
		name: "Você é PcD (Pessoa com deficiência)?",
	}).type(`${hasDisability}{enter}`);
	cy.findByRole("checkbox").click();
});

Cypress.Commands.add("fillGeolocationStep", () => {
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

Cypress.Commands.add(
	"fillSupportTypeStep",
	(supportType: Record<string, string>) => {
		cy.contains("Que tipo de acolhimento você precisa?").should("exist");
		if (supportType.psychological)
			cy.findByLabelText(supportType.psychological).click({ force: true });
		if (supportType.legal)
			cy.findByLabelText(supportType.legal).click({ force: true });
	}
);

Cypress.Commands.add("fillGenderViolenceStep", (option: string) => {
	cy.contains("Você sofreu ou está sofrendo violência de gênero?").should(
		"exist"
	);
	cy.findByRole("radio", { name: option }).click();
});

Cypress.Commands.add("fillViolenceLocationStep", (option: string) => {
	cy.contains("A violência ocorreu no Brasil?").should("exist");
	cy.findByLabelText(option).click();
});

Cypress.Commands.add("fillExternalSupportStep", (options: string[]) => {
	cy.contains(
		"Você está em atendimento psicológico e/ou jurídico fora do Mapa do Acolhimento?"
	).should("exist");
	options.forEach((option) => {
		cy.findByRole("checkbox", { name: option }).click({ force: true });
	});
});

Cypress.Commands.add("fillFinancialNeedStep", (option: string) => {
	cy.contains(
		"Você declara que não pode pagar por atendimento jurídico/psicológico?"
	).should("exist");
	cy.findByLabelText(option).click();
});

Cypress.Commands.add("checkForaCriteriosPage", () => {
	cy.findByRole("heading", { name: "Sentimos muito", level: 1 }).should(
		"exist"
	);
	cy.findByText(
		"O Mapa do Acolhimento atende mulheres cis, trans ou travestis maiores de 18 anos, que vivem no Brasil e enfrentam situações de vulnerabilidade socioeconômica."
	).should("exist");
});

Cypress.Commands.add("goThroughBeginRegistrationStep", () => {
	cy.findByRole("heading", { name: "Você não está sozinha", level: 1 }).should(
		"exist"
	);
	cy.findByText(
		"Com base nas suas respostas identificamos que você pode ser atendida pelo projeto. Agora precisamos de mais algumas informações para concluir o seu cadastro e te direcionar para o atendimento adequado. Vamos lá?"
	).should("exist");
	cy.findByRole("button", { name: "Iniciar cadastro" }).should("exist");
});

Cypress.Commands.add("fillAllSteps", (supportTypes: Record<string, string>) => {
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

	cy.goThroughBeginRegistrationStep();
	cy.findByRole("button", { name: "Iniciar cadastro" }).click();

	cy.fillSupportTypeStep(supportTypes);
	cy.findByRole("button", { name: "Continuar" }).click();

	cy.fillBasicRegisterInformationStep();
	cy.findByRole("button", { name: "Continuar" }).click();

	cy.fillGeolocationStep();
	cy.findByRole("button", { name: "Continuar" }).click();

	cy.fillDiversityInformationStep();
	cy.findByRole("button", { name: "Enviar" }).click();
});

export {};
