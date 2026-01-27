/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />
import { generateTestEmail, generateTestPhone } from "../../src/utils";
import "@testing-library/cypress/add-commands";
import {
	firstName,
	acceptOnlineSupport,
	colorOption,
	gender,
	externalSupport,
	violenceOccurredInBrazil,
	dateOfBirth,
	zipcode,
	neighborhood,
	state,
	city,
	perpetratorGenderId,
	livesWithPerpetrator,
	policeReportDifficulty,
} from "../fixtures/userData.json";

Cypress.Commands.add("goThroughHomePage", () => {
	cy.findByRole("link", { name: "Quero ser acolhida" }).click();
});

Cypress.Commands.add("fillDateOfBirthStep", (dateOfBirth) => {
	cy.findByRole("heading", { name: "Sobre você" }).should("exist");
	cy.findByRole("textbox").should("be.visible").type(dateOfBirth);
});

Cypress.Commands.add(
	"fillBasicRegisterInformationStep",
	(msrEmail, msrPhone) => {
		const email = msrEmail ?? generateTestEmail();
		const phone = msrPhone ?? generateTestPhone();

		cy.findByRole("heading", { name: "Seus dados" }).should("exist");
		cy.get("#firstName").type(firstName);
		cy.get("#email").type(email);
		cy.get("#confirmEmail").type(email);
		cy.get("#phone").type(phone);
		cy.get("#confirmPhone").type(phone);
	}
);

Cypress.Commands.add("fillDiversityInformationStep", () => {
	cy.findByRole("heading", { name: "Seus dados" }).should("exist");
	cy.findByRole("combobox", {
		name: "Selecione sua cor",
	}).click();
	cy.contains(colorOption).should("be.visible").click();
});

Cypress.Commands.add("fillGeolocationStep", () => {
	cy.findByRole("heading", { name: "Seu endereço" }).should("exist");

	cy.intercept("GET", "/geolocation?zipcode=12345678*", {
		statusCode: 200,
		body: {
			lat: -23.5613496,
			lng: -46.6590692,
			state: "SP",
			city: "SÃO PAULO",
			neighborhood: "BELA VISTA",
		},
	}).as("getGeolocation");

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
			cy.findByRole("checkbox", {
				name: /Acolhimento Psicológico/i,
			}).click({ force: true });
		if (supportType.legal)
			cy.findByRole("checkbox", {
				name: /Acolhimento Jurídico/i,
			}).click({ force: true });
	}
);

Cypress.Commands.add("fillGenderViolenceStep", (option: string) => {
	cy.contains("Você sofreu ou está sofrendo violência de gênero?").should(
		"exist"
	);
	cy.findByRole("radio", { name: option }).click();
});

Cypress.Commands.add("fillViolenceOccurredInBrazilStep", (option: string) => {
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

Cypress.Commands.add("fillMonthlyIncomeStep", () => {
	// MonthlyIncome
	cy.contains("Você tem renda mensal?").should("exist");
	cy.findByRole("radio", { name: "Sim" }).click();
	cy.findByRole("button", { name: "Continuar" }).click();
});

Cypress.Commands.add("fillMonthlyIncomeRangeStep", () => {
	// MonthlyIncomeRange
	cy.contains(
		"Assinale a opção que corresponde a sua renda individual (per capita):"
	).should("exist");
	cy.findByRole("radio", {
		name: "Até quatro salários mínimos (R$6.484,00)",
	}).click();
	cy.findByRole("button", { name: "Continuar" }).click();
});

Cypress.Commands.add(
	"fillEmploymentStatusStep",
	(
		employmentStatusOptionText = "Trabalhadora sem carteira de trabalho assinada"
	) => {
		// EmploymentStatus
		cy.contains("Qual a sua situação de trabalho?").should("exist");
		cy.findByRole("radio", {
			name: employmentStatusOptionText,
		}).click();
		cy.findByRole("button", { name: "Continuar" }).click();
	}
);

Cypress.Commands.add("fillDependantsStep", (hasDependants: boolean = true) => {
	cy.contains(
		"Você tem pessoas que são dependentes financeiramente da sua renda?"
	).should("exist");

	const optionLabel = hasDependants ? "Sim" : "Não";

	cy.findByRole("radio", { name: optionLabel }).click();
	cy.findByRole("button", { name: "Continuar" }).click();
});

Cypress.Commands.add("fillFamilyProviderStep", (isProvider = true) => {
	// FamilyProvider
	cy.contains(
		'Você é responsável financeiramente pela renda familiar (é considerada a "chefe de família")?'
	).should("exist");
	cy.findByRole("radio", { name: isProvider ? "Sim" : "Não" }).click();
	cy.findByRole("button", { name: "Continuar" }).click();
});

Cypress.Commands.add("fillPropertyOwnershipStep", (hasProperty = false) => {
	// PropertyOwnership
	cy.contains(
		"Você possui bens imóveis (casa, apartamento) em seu nome?"
	).should("exist");
	cy.findByRole("radio", { name: hasProperty ? "Sim" : "Não" }).click();
});

Cypress.Commands.add("fillFinancialBlock", () => {
	cy.fillMonthlyIncomeStep();
	cy.fillMonthlyIncomeRangeStep();
	cy.fillEmploymentStatusStep();
	cy.fillDependantsStep();
	cy.fillFamilyProviderStep();
	cy.fillPropertyOwnershipStep();
});

Cypress.Commands.add("fillNoViolenceTypeStep", () => {
	cy.contains(
		"Qual(is) tipos de violência você sofreu ou está sofrendo pelo fato de ser mulher?"
	).should("be.visible");

	cy.findByRole("checkbox", {
		name: /Não estou sofrendo violência|Não sofri violência/i,
	}).click({
		force: true,
	});
});

Cypress.Commands.add("fillViolenceTypeStep", () => {
	cy.contains(
		"Qual(is) tipos de violência você sofreu ou está sofrendo pelo fato de ser mulher?"
	).should("be.visible");
	cy.findByRole("checkbox", { name: /Violência psicológica/i }).click({
		force: true,
	});
	cy.findByRole("checkbox", { name: /Violência física/i }).click({
		force: true,
	});
	cy.findByRole("checkbox", { name: /Violência sexual/i }).click({
		force: true,
	});
});

Cypress.Commands.add("fillViolenceTimeStep", () => {
	cy.contains(
		"Por qual período de tempo você sofreu ou está sofrendo violência?"
	).should("be.visible");
	cy.findByRole("radio", { name: /Há menos de 3 meses/i }).click({
		force: true,
	});
});

Cypress.Commands.add(
	"fillPerpetratorGenderIdStep",
	(violenceGenderId: string) => {
		cy.contains(
			"Qual a identidade de gênero do(a) autor(a) da violência?"
		).should("exist");
		cy.findByRole("radio", { name: violenceGenderId }).click();
	}
);

Cypress.Commands.add("fillViolencePerpetratorStep", () => {
	cy.contains("Quem é ou foi o(a) autor(a) da violência?").should("be.visible");

	cy.findByRole("checkbox", { name: /Família Nuclear/i }).click({
		force: true,
	});
	cy.findByRole("checkbox", { name: /Familiar/i }).click({
		force: true,
	});
	cy.findByRole("checkbox", { name: /Parceiro\(a\) atual/i }).click({
		force: true,
	});
});

Cypress.Commands.add(
	"fillLivesWithPerpetratorStep",
	(livesWithPerpetrator: string) => {
		cy.contains("Você reside com o(a) autor(a) da violência?").should("exist");
		cy.findByRole("radio", { name: livesWithPerpetrator }).click();
	}
);

Cypress.Commands.add("fillViolenceLocationStep", () => {
	cy.contains("Onde ocorreu a violência?").should("be.visible");
	cy.findByRole("checkbox", { name: /Ambiente doméstico/i }).click({
		force: true,
	});
	cy.findByRole("checkbox", { name: /Ambiente de trabalho/i }).click({
		force: true,
	});
});

Cypress.Commands.add("fillPoliceReportDifficultyStep", () => {
	cy.contains("Se sim, o que a pessoa que te atendeu fez?").should(
		"be.visible"
	);

	cy.findByRole("checkbox", {
		name: /Desencorajou sob o argumento de inexistência criminosa/i,
	}).click({
		force: true,
	});
	cy.findByRole("checkbox", {
		name: /Negou-se a registrar a ocorrência/i,
	}).click({
		force: true,
	});
});

Cypress.Commands.add("fillConsentConfirmationStep", () => {
	cy.findByRole("heading", { name: "Confirmação de Consentimento" }).should(
		"exist"
	);
	cy.findByRole("checkbox").click();
});

Cypress.Commands.add("fillLegalActionsTakenStep", () => {
	cy.contains(
		"Foram tomadas providências jurídicas? (Selecione todas as opções que se aplicam)"
	).should("be.visible");
	cy.findByRole("checkbox", { name: /Inquérito policial/i }).click({
		force: true,
	});
	cy.findByRole("checkbox", { name: /Processo trabalhista/i }).click({
		force: true,
	});
});

Cypress.Commands.add("fillProtectiveFactorsStep", () => {
	cy.contains("Selecione as opções que se aplicam ao seu caso").should(
		"be.visible"
	);

	cy.findByRole("checkbox", {
		name: /Possuo rede de apoio \(familiares, amigos, vizinhos\)/i,
	}).click({
		force: true,
	});
	cy.findByRole("checkbox", { name: /Me sinto segura em casa/i }).click({
		force: true,
	});
});

Cypress.Commands.add("fillRiskFactorsStep", () => {
	cy.contains("Selecione as opções que se aplicam ao seu caso").should(
		"be.visible"
	);
	cy.findByRole("checkbox", {
		name: /A violência ocorreu durante a gestação/i,
	}).click({
		force: true,
	});
	cy.findByRole("checkbox", {
		name: /Tive acesso negado aos serviços públicos de atendimento à mulher/i,
	}).click({
		force: true,
	});
});

Cypress.Commands.add("fillAllSteps", (supportTypes: Record<string, string>) => {
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

	cy.fillConsentConfirmationStep();
	cy.findByRole("button", { name: "Enviar" }).click();
});

Cypress.Commands.add(
	"fillAllStepsApp2",
	(supportTypes: Record<string, string>) => {
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

		cy.fillViolenceTimeStep();
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillPerpetratorGenderIdStep(perpetratorGenderId);
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillViolencePerpetratorStep();
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillLivesWithPerpetratorStep(livesWithPerpetrator);
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillViolenceLocationStep();
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillLegalActionsTakenStep();
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillPoliceReportDifficultyStep();
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillProtectiveFactorsStep();
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillRiskFactorsStep();
		cy.findByRole("button", { name: "Continuar" }).click();

		cy.fillConsentConfirmationStep();
		cy.findByRole("button", { name: "Enviar" }).click();
	}
);

export {};
