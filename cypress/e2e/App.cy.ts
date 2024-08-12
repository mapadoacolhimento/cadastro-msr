import userData from "../fixtures/userData.json";

const {
	gender,
	genderViolence,
	externalSupport,
	violenceLocation,
	financialNeed,
} = userData;

describe("App", () => {
	it("should continue to next step if all fields are filled correctly", () => {
		cy.visit("/");
		cy.goThroughHomePage();

		cy.fillBasicRegisterInformationStep();
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillGeolocationStep();
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillDisabilityStep();
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillGenderIdentityStep(gender);
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillSupportTypeStep();
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillGenderViolenceStep(genderViolence);
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillExternalSupportStep(externalSupport);
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillViolenceLocationStep(violenceLocation);
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillFinancialNeedStep(financialNeed);
	});

	it("should go back to the previous step when the back button is clicked", () => {
		cy.visit("/");
		cy.goThroughHomePage();

		cy.fillBasicRegisterInformationStep();
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillGeolocationStep();
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillDisabilityStep();
		cy.findByRole("button", { name: "Voltar para o passo anterior" }).click();

		cy.findByRole("heading", { name: "Seu endereço" }).should("exist");
	});
});

describe("When MSR does not meet the criteria", () => {
	it("should redirect to `fora-criterios` page if gender identity is filled with option `Não me identifico como mulher`", () => {
		cy.visit("/");
		cy.goThroughHomePage();

		cy.fillBasicRegisterInformationStep();
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillGeolocationStep();
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillDisabilityStep();
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillGenderIdentityStep("Não me identifico como mulher");
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.url().should("include", "/fora-criterios");
	});

	it("should redirect to `fora-criterios` page if gender violence is filled with option `Não`", () => {
		cy.visit("/");
		cy.goThroughHomePage();

		cy.fillBasicRegisterInformationStep();
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillGeolocationStep();
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillDisabilityStep();
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillGenderIdentityStep(gender);
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillSupportTypeStep();
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillGenderViolenceStep("Não");
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.url().should("include", "/fora-criterios");
	});

	it("should redirect to `fora-criterios` page if MSR asks for legal support and they select that they already have external legal support", () => {
		cy.visit("/");
		cy.goThroughHomePage();

		cy.fillBasicRegisterInformationStep();
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillGeolocationStep();
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillDisabilityStep();
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillGenderIdentityStep(gender);
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillSupportTypeStep();
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillGenderViolenceStep(genderViolence);
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillExternalSupportStep("Sim");
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.url().should("include", "/fora-criterios");
	});

	it("should redirect to `fora-criterios` page if MSR selects that the violence location wasn't in Brazil", () => {
		cy.visit("/");
		cy.goThroughHomePage();

		cy.fillBasicRegisterInformationStep();
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillGeolocationStep();
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillDisabilityStep();
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillGenderIdentityStep(gender);
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillSupportTypeStep();
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillGenderViolenceStep(genderViolence);
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillExternalSupportStep(externalSupport);
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillViolenceLocationStep("Não");
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.url().should("include", "/fora-criterios");
	});

	it("should redirect to `fora-criterios` page if MSR signals they dont struggle financially", () => {
		cy.visit("/");
		cy.goThroughHomePage();

		cy.fillBasicRegisterInformationStep();
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillGeolocationStep();
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillDisabilityStep();
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillGenderIdentityStep(gender);
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillSupportTypeStep();
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillGenderViolenceStep(genderViolence);
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillExternalSupportStep(externalSupport);
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillViolenceLocationStep(violenceLocation);
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillFinancialNeedStep("Não");

		cy.get("#terms").click();
		cy.findByRole("button", { name: "Enviar" }).click();

		cy.url().should("include", "/fora-criterios");
	});

	it("should redirect to `fora-criterios` page if MSR is under 18 years old", () => {
		cy.visit("/");
		cy.goThroughHomePage();

		const { firstName, email, confirmEmail, phone, dateOfBirth, colorOption } =
			userData;

		cy.findByRole("heading", { name: "Seus dados" }).should("exist");
		cy.get("#firstName").type(firstName);
		cy.get("#email").type(email);
		cy.get("#confirmEmail").type(confirmEmail);
		cy.get("#phone").type(phone);
		cy.get("#dateOfBirth").type("18112015");
		cy.get("#color").click();
		cy.contains(colorOption).should("be.visible").click();

		cy.findByRole("button", { name: "Continuar" }).click();

		cy.url().should("include", "/fora-criterios");
	});
});
