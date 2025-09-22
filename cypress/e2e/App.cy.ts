import userData from "../fixtures/userData.json";

const {
	gender,
	genderViolence,
	externalSupport,
	violenceLocation,
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

				cy.fillAllSteps(supportTypes);
			});

			it("should go back to the previous step when the back button is clicked", () => {
				cy.visit("/cadastro");

				cy.fillGenderIdentityStep(gender);
				cy.findByRole("button", { name: "Continuar" }).click();

				cy.fillDateOfBirthStep(dateOfBirth);
				cy.findByRole("button", { name: "Continuar" }).click();

				cy.fillViolenceTypeStep();
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

				cy.fillAllSteps(supportTypes);
			});

			it("should go back to the previous step when the back button is clicked", () => {
				cy.visit("/cadastro");

				cy.fillGenderIdentityStep(gender);
				cy.findByRole("button", { name: "Continuar" }).click();

				cy.fillDateOfBirthStep(dateOfBirth);
				cy.findByRole("button", { name: "Continuar" }).click();

				cy.fillViolenceTypeStep();
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

	it("should redirect to `fora-criterios` page if MSR selects that the violence location wasn't in Brazil", () => {
		cy.visit("/cadastro");

		cy.fillGenderIdentityStep(gender);
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillDateOfBirthStep(dateOfBirth);
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillViolenceTypeStep();
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillViolenceLocationStep("Não, aconteceu em outro país");
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.url().should("include", "/fora-criterios");
		cy.checkForaCriteriosPage();
	});

	it("should redirect to `fora-criterios` page if MSR signals they have psychological and legal external help", () => {
		cy.visit("/cadastro");

		cy.fillGenderIdentityStep(gender);
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillDateOfBirthStep(dateOfBirth);
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillViolenceTypeStep();
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillViolenceLocationStep(violenceLocation);
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillExternalSupportStep([
			"Estou sendo acompanhada por um(a) advogado(a) particular",
			"Estou sendo acompanhada por um(a) psicólogo(a) particular",
		]);
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.url().should("include", "/fora-criterios");
		cy.checkForaCriteriosPage();
	});

	describe("Financial block", () => {
		beforeEach(() => {
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

			cy.fillMonthlyIncomeStep();
			cy.fillMonthlyIncomeRangeStep();
		});
		describe("If MSR signals they have a monthly income and its greater than 3 min wages", () => {
			it("should redirect to `fora-criterios` page if they are a student with income", () => {
				cy.fillEmploymentStatusStep("Estudante e com renda independente");
				cy.url().should("include", "/fora-criterios");
				cy.checkForaCriteriosPage();
			});
			it("should redirect to `fora-criterios` page if they are a student dependant on their family", () => {
				cy.fillEmploymentStatusStep("Estudante e dependente da minha família");
				cy.url().should("include", "/fora-criterios");
				cy.checkForaCriteriosPage();
			});
			it("should redirect to `fora-criterios` page if they don't have dependants", () => {
				cy.fillEmploymentStatusStep();
				cy.fillDependantsStep(false);
				cy.url().should("include", "/fora-criterios");
				cy.checkForaCriteriosPage();
			});
			it("should redirect to `fora-criterios` page if they are not the family provider", () => {
				cy.fillEmploymentStatusStep();
				cy.fillDependantsStep();
				cy.fillFamilyProviderStep(false);
				cy.url().should("include", "/fora-criterios");
				cy.checkForaCriteriosPage();
			});
			it("should redirect to `fora-criterios` page if they have property", () => {
				cy.fillEmploymentStatusStep();
				cy.fillDependantsStep();
				cy.fillFamilyProviderStep();
				cy.fillPropertyOwnershipStep(true);
				cy.findByRole("button", { name: "Continuar" }).click();

				cy.url().should("include", "/fora-criterios");
				cy.checkForaCriteriosPage();
			});
		});
	});
});

describe("Submit the form", () => {
	it("should redirect to `pedido-acolhimento` with correct url after successfull submit", () => {
		cy.intercept("POST", "/handle-request", {
			statusCode: 200,
			body: {
				psychological: { supportRequestId: 1 },
				legal: { supportRequestId: 2 },
			},
		});

		cy.visit("/");
		cy.goThroughHomePage();

		cy.fillAllSteps(supportTypes);

		cy.url().should(
			"include",
			"/pedido-acolhimento?psychologicalSupportRequestId=1&legalSupportRequestId=2"
		);
	});
});
