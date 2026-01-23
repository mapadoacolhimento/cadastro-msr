import {
	gender,
	externalSupport,
	violenceOccurredInBrazil,
	dateOfBirth,
	supportTypes,
	perpetratorGender,
	livesWithPerpetrator,
} from "../../fixtures/userData.json";

function terminalLog(violations) {
	cy.task(
		"log",
		`${violations.length} accessibility violation${
			violations.length === 1 ? "" : "s"
		} ${violations.length === 1 ? "was" : "were"} detected`
	);
	const violationData = violations.map(
		({ id, impact, description, nodes }) => ({
			id,
			impact,
			description,
			nodes: nodes.length,
		})
	);

	cy.task("table", violationData);
}

describe("Accessibility - App2 New Steps", () => {
	const sizes = [
		{
			name: "Desktop",
			viewportHeight: 1080,
			viewportWidth: 1920,
		},
		{
			name: "Mobile",
			viewportHeight: 844,
			viewportWidth: 390,
		},
	];

	sizes.forEach((size) => {
		describe(
			size.name,
			{
				viewportHeight: size.viewportHeight,
				viewportWidth: size.viewportWidth,
			},
			() => {
				beforeEach(() => {
					cy.visit("/cadastro");

					cy.fillGenderIdentityStep(gender);
					cy.findByRole("button", { name: "Continuar" }).click();

					cy.fillDateOfBirthStep(dateOfBirth);
					cy.findByRole("button", { name: "Continuar" }).click();

					cy.fillViolenceTypeStep();
					cy.findByRole("button", { name: "Continuar" }).click();

					cy.fillViolenceOccurredInBrazilStep(violenceOccurredInBrazil);
					cy.findByRole("button", { name: "Continuar" }).click();

					cy.fillExternalSupportStep(externalSupport);
					cy.findByRole("button", { name: "Continuar" }).click();

					cy.fillFinancialBlock();
					cy.findByRole("button", { name: "Continuar" }).click();

					cy.findByRole("button", { name: "Iniciar cadastro" }).click();

					cy.fillSupportTypeStep(supportTypes);
					cy.findByRole("button", { name: "Continuar" }).click();

					cy.fillBasicRegisterInformationStep();
					cy.findByRole("button", { name: "Continuar" }).click();

					cy.fillGeolocationStep();
					cy.findByRole("button", { name: "Continuar" }).click();

					cy.fillDiversityInformationStep();
					cy.findByRole("button", { name: "Continuar" }).click();
				});

				it("should pass the accessibility test on Violence Time step", () => {
					cy.contains(
						"Por qual período de tempo você sofreu ou está sofrendo violência?"
					).should("exist");

					cy.injectAxe();
					cy.checkA11y(null, null, terminalLog);
				});

				it("should pass the accessibility test on Perpetrator Gender Id step", () => {
					cy.fillViolenceTimeStep();
					cy.findByRole("button", { name: "Continuar" }).click();

					cy.contains(
						"Qual a identidade de gênero do(a) autor(a) da violência?"
					).should("exist");

					cy.injectAxe();
					cy.checkA11y(null, null, terminalLog);
				});

				it("should pass the accessibility test on Violence Perpetrator step", () => {
					cy.fillViolenceTimeStep();
					cy.findByRole("button", { name: "Continuar" }).click();

					cy.fillPerpetratorGenderStep(perpetratorGender);
					cy.findByRole("button", { name: "Continuar" }).click();

					cy.contains("Quem é ou foi o(a) autor(a) da violência?").should(
						"exist"
					);

					cy.injectAxe();
					cy.checkA11y(null, null, terminalLog);
				});

				it("should pass the accessibility test on Lives With Perpetrator step", () => {
					cy.fillViolenceTimeStep();
					cy.findByRole("button", { name: "Continuar" }).click();

					cy.fillPerpetratorGenderStep(perpetratorGender);
					cy.findByRole("button", { name: "Continuar" }).click();

					cy.fillViolencePerpetratorStep();
					cy.findByRole("button", { name: "Continuar" }).click();

					cy.contains("Você reside com o(a) autor(a) da violência?").should(
						"exist"
					);

					cy.injectAxe();
					cy.checkA11y(null, null, terminalLog);
				});

				it("should pass the accessibility test on Violence Location step", () => {
					cy.fillViolenceTimeStep();
					cy.findByRole("button", { name: "Continuar" }).click();

					cy.fillPerpetratorGenderStep(perpetratorGender);
					cy.findByRole("button", { name: "Continuar" }).click();

					cy.fillViolencePerpetratorStep();
					cy.findByRole("button", { name: "Continuar" }).click();

					cy.fillLivesWithPerpetratorStep(livesWithPerpetrator);
					cy.findByRole("button", { name: "Continuar" }).click();

					cy.contains("Onde ocorreu a violência?").should("exist");

					cy.injectAxe();
					cy.checkA11y(null, null, terminalLog);
				});

				it("should pass the accessibility test on Legal Actions Taken step", () => {
					cy.fillViolenceTimeStep();
					cy.findByRole("button", { name: "Continuar" }).click();

					cy.fillPerpetratorGenderStep(perpetratorGender);
					cy.findByRole("button", { name: "Continuar" }).click();

					cy.fillViolencePerpetratorStep();
					cy.findByRole("button", { name: "Continuar" }).click();

					cy.fillLivesWithPerpetratorStep(livesWithPerpetrator);
					cy.findByRole("button", { name: "Continuar" }).click();

					cy.fillViolenceLocationStep();
					cy.findByRole("button", { name: "Continuar" }).click();

					cy.contains(
						"Foram tomadas providências jurídicas? (Selecione todas as opções que se aplicam)"
					).should("exist");

					cy.injectAxe();
					cy.checkA11y(null, null, terminalLog);
				});

				it("should pass the accessibility test on Police Report Difficulty step", () => {
					cy.fillViolenceTimeStep();
					cy.findByRole("button", { name: "Continuar" }).click();

					cy.fillPerpetratorGenderStep(perpetratorGender);
					cy.findByRole("button", { name: "Continuar" }).click();

					cy.fillViolencePerpetratorStep();
					cy.findByRole("button", { name: "Continuar" }).click();

					cy.fillLivesWithPerpetratorStep(livesWithPerpetrator);
					cy.findByRole("button", { name: "Continuar" }).click();

					cy.fillViolenceLocationStep();
					cy.findByRole("button", { name: "Continuar" }).click();

					cy.fillLegalActionsTakenStep();
					cy.findByRole("button", { name: "Continuar" }).click();

					cy.contains(
						"Houve dificuldade ou impedimento para realizar alguma das providências jurídicas? Se sim, o que a pessoa que te atendeu fez?"
					).should("exist");

					cy.injectAxe();
					cy.checkA11y(null, null, terminalLog);
				});

				it("should pass the accessibility test on Protective Factors step", () => {
					cy.fillViolenceTimeStep();
					cy.findByRole("button", { name: "Continuar" }).click();

					cy.fillPerpetratorGenderStep(perpetratorGender);
					cy.findByRole("button", { name: "Continuar" }).click();

					cy.fillViolencePerpetratorStep();
					cy.findByRole("button", { name: "Continuar" }).click();

					cy.fillLivesWithPerpetratorStep(livesWithPerpetrator);
					cy.findByRole("button", { name: "Continuar" }).click();

					cy.fillViolenceLocationStep();
					cy.findByRole("button", { name: "Continuar" }).click();

					cy.fillLegalActionsTakenStep();
					cy.findByRole("button", { name: "Continuar" }).click();

					cy.fillLegalActionDifficultyStep();
					cy.findByRole("button", { name: "Continuar" }).click();

					cy.contains("Selecione as opções que se aplicam ao seu caso").should(
						"exist"
					);

					cy.injectAxe();
					cy.checkA11y(null, null, terminalLog);
				});

				it("should pass the accessibility test on Risk Factors step", () => {
					cy.fillViolenceTimeStep();
					cy.findByRole("button", { name: "Continuar" }).click();

					cy.fillPerpetratorGenderStep(perpetratorGender);
					cy.findByRole("button", { name: "Continuar" }).click();

					cy.fillViolencePerpetratorStep();
					cy.findByRole("button", { name: "Continuar" }).click();

					cy.fillLivesWithPerpetratorStep(livesWithPerpetrator);
					cy.findByRole("button", { name: "Continuar" }).click();

					cy.fillViolenceLocationStep();
					cy.findByRole("button", { name: "Continuar" }).click();

					cy.fillLegalActionsTakenStep();
					cy.findByRole("button", { name: "Continuar" }).click();

					cy.fillLegalActionDifficultyStep();
					cy.findByRole("button", { name: "Continuar" }).click();

					cy.fillProtectiveFactorsStep();
					cy.findByRole("button", { name: "Continuar" }).click();

					cy.contains("Selecione as opções que se aplicam ao seu caso").should(
						"exist"
					);

					cy.injectAxe();
					cy.checkA11y(null, null, terminalLog);
				});
			}
		);
	});
});
