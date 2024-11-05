import {
	email,
	gender,
	genderViolence,
	externalSupport,
	violenceLocation,
	financialNeed,
	supportTypes,
	dateOfBirth,
	neighborhood,
} from "../fixtures/userData.json";

const mockValues = {
	gender: "cis_woman",
	dateOfBirth: new Date("1996-11-18").toISOString(),
	genderViolence: "yes",
	violenceLocation: "yes",
	externalSupport: ["no"],
	financialNeed: "yes",
	supportType: ["psychological", "legal"],
	email: email,
	confirmEmail: email,
	firstName: "Msr",
	phone: "81999999999",
	color: "",
	hasDisability: "",
	acceptsOnlineSupport: "yes",
	terms: "yes",
	zipcode: "12345678",
	neighborhood: "Centro",
	city: "SÃO PAULO",
	state: "SP",
	lat: "-12.971",
	lng: "-38.511",
};

describe("Load data from bd", () => {});
it("should fill addres information in the fields in the following step after loading the data from the database", () => {
	cy.intercept("GET", `/db/load-msr-register-data*`, {
		statusCode: 200,
		body: {
			values: mockValues,
		},
	}).as("getMsrRegisterData");

	cy.visit("/");
	cy.goThroughHomePage();

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

	cy.fillBasicRegisterInformationStep(email);

	cy.wait("@getMsrRegisterData");

	cy.findByRole("button", { name: "Continuar" }).click();

	cy.findByLabelText("CEP").should("have.value", "12345-678");
	cy.findByLabelText("Bairro").should("have.value", neighborhood);
	cy.get('input[type="hidden"][name="state"]').should("have.value", "SP");
	cy.get('input[type="hidden"][name="city"]').should("have.value", "SÃO PAULO");

	cy.findByRole("button", { name: "Continuar" }).click();

	cy.findByRole("heading", { name: "Seus dados" }).should("exist");
	cy.findByRole("combobox", {
		name: "Cor",
	}).should("exist");
});
