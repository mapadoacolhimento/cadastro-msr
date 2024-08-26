import userData from "../fixtures/userData.json";

const {
	gender,
	genderViolence,
	externalSupport,
	violenceLocation,
	financialNeed,
	supportTypes,
	dateOfBirth,
} = userData;

describe("Happy path", () => {
	describe(
		"Desktop",
		{
			viewportHeight: 1080,
			viewportWidth: 1920,
		},
		() => {
			it("should continue to next step if all fields are filled correctly", () => {
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

				cy.fillSupportTypeStep(supportTypes);
				cy.findByRole("button", { name: "Continuar" }).click();

				cy.fillBasicRegisterInformationStep();
				cy.findByRole("button", { name: "Continuar" }).click();

				cy.fillGeolocationStep();
				cy.findByRole("button", { name: "Continuar" }).click();

				cy.fillDiversityInformationStep();
				cy.findByRole("button", { name: "Enviar" }).click();
			});

			it("should go back to the previous step when the back button is clicked", () => {
				cy.visit("/cadastro");

				cy.fillGenderIdentityStep(gender);
				cy.findByRole("button", { name: "Continuar" }).click();

				cy.fillDateOfBirthStep(dateOfBirth);
				cy.findByRole("button", { name: "Continuar" }).click();

				cy.fillGenderViolenceStep(genderViolence);
				cy.findByRole("button", {
					name: "Voltar para o passo anterior",
				}).click();

				cy.findByRole("heading", { name: "Sobre você" }).should("exist");
				cy.findByRole("textbox").should("have.value", "18/11/1996");
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
			it("should continue to next step if all fields are filled correctly", () => {
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

				cy.fillSupportTypeStep(supportTypes);
				cy.findByRole("button", { name: "Continuar" }).click();

				cy.fillBasicRegisterInformationStep();
				cy.findByRole("button", { name: "Continuar" }).click();

				cy.fillGeolocationStep();
				cy.findByRole("button", { name: "Continuar" }).click();

				cy.fillDiversityInformationStep();
				cy.findByRole("button", { name: "Enviar" }).click();
			});

			it("should go back to the previous step when the back button is clicked", () => {
				cy.visit("/cadastro");

				cy.fillGenderIdentityStep(gender);
				cy.findByRole("button", { name: "Continuar" }).click();

				cy.fillDateOfBirthStep(dateOfBirth);
				cy.findByRole("button", { name: "Continuar" }).click();

				cy.fillGenderViolenceStep(genderViolence);
				cy.findByRole("button", {
					name: "Voltar para o passo anterior",
				}).click();

				cy.findByRole("heading", { name: "Sobre você" }).should("exist");
				cy.findByRole("textbox").should("have.value", "18/11/1996");
			});
		}
	);
});

describe("When MSR does not meet the criteria", () => {
	it("should redirect to `fora-criterios` page if gender identity is filled with option `Não me identifico como mulher`", () => {
		cy.visit("/cadastro");

		cy.fillGenderIdentityStep("Não me identifico como mulher");
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.url().should("include", "/fora-criterios");
		cy.checkForaCriteriosPage();
	});

	it("should redirect to `fora-criterios` page if MSR is under 18 years old", () => {
		cy.visit("/cadastro");

		cy.fillGenderIdentityStep(gender);
		cy.findByRole("button", { name: "Continuar" }).click();

		const today = new Date();
		const birthYear = today.getFullYear() - 17;
		const birthMonth = String(today.getMonth() + 1).padStart(2, "0");
		const birthDay = String(today.getDate()).padStart(2, "0");
		const invalidDateOfBirth = `${birthDay}${birthMonth}${birthYear}`;

		cy.fillDateOfBirthStep(invalidDateOfBirth);
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.url().should("include", "/fora-criterios");
		cy.checkForaCriteriosPage();
	});

	it("should redirect to `fora-criterios` page if gender violence is filled with option `Não`", () => {
		cy.visit("/cadastro");

		cy.fillGenderIdentityStep(gender);
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillDateOfBirthStep(dateOfBirth);
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillGenderViolenceStep("Não");
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.url().should("include", "/fora-criterios");
		cy.checkForaCriteriosPage();
	});

	it("should redirect to `fora-criterios` page if MSR selects that the violence location wasn't in Brazil", () => {
		cy.visit("/cadastro");

		cy.fillGenderIdentityStep(gender);
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillDateOfBirthStep(dateOfBirth);
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillGenderViolenceStep(genderViolence);
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillViolenceLocationStep("Não");
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.url().should("include", "/fora-criterios");
		cy.checkForaCriteriosPage();
	});

	it("should redirect to `fora-criterios` page if MSR signals they dont struggle financially", () => {
		cy.visit("/cadastro");

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

		cy.fillFinancialNeedStep("Não");
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.url().should("include", "/fora-criterios");
		cy.checkForaCriteriosPage();
	});

	// skipping for now because this condition will change shortly
	it.skip("should redirect to `fora-criterios` page if MSR asks for legal support and they select that they already have external legal support", () => {
		cy.visit("/cadastro");

		cy.fillGenderIdentityStep(gender);
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillDateOfBirthStep(dateOfBirth);
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillGenderViolenceStep(genderViolence);
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillViolenceLocationStep(violenceLocation);
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillBasicRegisterInformationStep();
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillGeolocationStep();
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillDiversityInformationStep();
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillSupportTypeStep(supportTypes);
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillExternalSupportStep("Sim");
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.url().should("include", "/fora-criterios");
	});
});

describe("Submit the form", () => {
	it("should redirect to `cadastro-finalizado` when handle-request return both support requests with match status", () => {
		cy.intercept("POST", "/handle-request", {
			statusCode: 200,
			body: {
				psychological: "waiting_contact",
				legal: "waiting_contact",
			},
		});

		cy.visit("/");
		cy.goThroughHomePage();

		cy.fillAllSteps(supportTypes);

		cy.get("#terms").click();
		cy.findByRole("button", { name: "Enviar" }).click();

		cy.url().should("include", "/cadastro-finalizado");
	});

	it("should redirect to `acolhimento-andamento` when handle-request return the support reques with status `duplicated`", () => {
		cy.intercept("POST", "/handle-request", {
			statusCode: 200,
			body: {
				psychological: "duplicated",
			},
		});

		cy.visit("/");
		cy.goThroughHomePage();

		cy.fillAllSteps({ psychological: "Acolhimento psicológico" });

		cy.get("#terms").click();
		cy.findByRole("button", { name: "Enviar" }).click();

		cy.url().should("include", "/acolhimento-andamento");
	});

	it("should redirect to `cadastro-finalizado` when handle-request return the support request with match status", () => {
		cy.intercept("POST", "/handle-request", {
			statusCode: 200,
			body: {
				legal: "waiting_contact",
			},
		});

		cy.visit("/");
		cy.goThroughHomePage();

		cy.fillAllSteps({ legal: "Acolhimento jurídico" });

		cy.get("#terms").click();
		cy.findByRole("button", { name: "Enviar" }).click();

		cy.url().should("include", "/cadastro-finalizado");
	});

	it("should redirect to `cadastro-finalizado` when handle-request return at least one support request with match status", () => {
		cy.intercept("POST", "/handle-request", {
			statusCode: 200,
			body: {
				psychological: "duplicated",
				legal: "waiting_contact",
			},
		});

		cy.visit("/");
		cy.goThroughHomePage();

		cy.fillAllSteps(supportTypes);

		cy.get("#terms").click();
		cy.findByRole("button", { name: "Enviar" }).click();

		cy.url().should("include", "/cadastro-finalizado");
	});

	it("should redirect to `acolhimento-andamento` when handle-request return both  support requests with status `duplicated`", () => {
		cy.intercept("POST", "/handle-request", {
			statusCode: 200,
			body: {
				psychological: "duplicated",
				legal: "duplicated",
			},
		});

		cy.visit("/");
		cy.goThroughHomePage();

		cy.fillAllSteps(supportTypes);

		cy.get("#terms").click();
		cy.findByRole("button", { name: "Enviar" }).click();

		cy.url().should("include", "/acolhimento-andamento");
	});
});
