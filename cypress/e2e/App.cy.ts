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

	it("should redirect to `fora-criterios` page if MSR signals they dont struggle financially", () => {
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

		cy.fillFinancialNeedStep("Não");
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.url().should("include", "/fora-criterios");
		cy.checkForaCriteriosPage();
	});
});

describe("Submit the form", () => {
	it("should redirect to `cadastro-finalizado` when handle-request return both support requests with match status", () => {
		cy.intercept("POST", "/handle-request", {
			statusCode: 200,
			body: {
				psychological: { status: "waiting_contact" },
				legal: { status: "waiting_contact" },
			},
		});

		cy.visit("/");
		cy.goThroughHomePage();

		cy.fillAllSteps(supportTypes);

		cy.url().should("include", "/cadastro-finalizado");
	});

	it("should redirect to `acolhimento-andamento` when handle-request return the support request with status `duplicated`", () => {
		cy.intercept("POST", "/handle-request", {
			statusCode: 200,
			body: {
				psychological: { status: "duplicated" },
			},
		});

		cy.visit("/");
		cy.goThroughHomePage();

		cy.fillAllSteps({ psychological: "Acolhimento psicológico" });

		cy.url().should("include", "/acolhimento-andamento");
	});

	it("should redirect to `cadastro-finalizado` when handle-request return the support request with match status", () => {
		cy.intercept("POST", "/handle-request", {
			statusCode: 200,
			body: {
				legal: { status: "waiting_contact" },
			},
		});

		cy.visit("/");
		cy.goThroughHomePage();

		cy.fillAllSteps({ legal: "Acolhimento jurídico" });

		cy.url().should("include", "/cadastro-finalizado");
	});

	it("should redirect to `cadastro-finalizado` when handle-request return at least one support request with match status", () => {
		cy.intercept("POST", "/handle-request", {
			statusCode: 200,
			body: {
				psychological: { status: "duplicated" },
				legal: [{ status: "waiting_contact" }],
			},
		});

		cy.visit("/");
		cy.goThroughHomePage();

		cy.fillAllSteps(supportTypes);

		cy.url().should("include", "/cadastro-finalizado");
	});

	it("should redirect to `acolhimento-andamento` when handle-request return both  support requests with status `duplicated`", () => {
		cy.intercept("POST", "/handle-request", {
			statusCode: 200,
			body: {
				psychological: { status: "duplicated" },
				legal: { status: "duplicated" },
			},
		});

		cy.visit("/");
		cy.goThroughHomePage();

		cy.fillAllSteps(supportTypes);

		cy.url().should("include", "/acolhimento-andamento");
	});
});

describe.skip("New features", () => {
	describe("When new financial triage is enabled", () => {
		it("should go through the new financial block step", () => {
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

			cy.findByRole("heading", {
				name: "Você não está sozinha",
				level: 1,
			}).should("exist");
		});
	});
});
