/// <reference types="cypress" />

declare namespace Cypress {
	interface Chainable<Subject = any> {
		goThroughHomePage(): Chainable<any>;
		fillBasicRegisterInformationStep(
			firstName?: string,
			email?: string,
			confirmEmail?: string,
			phone?: string,
			dateOfBirth?: string
		): Chainable<any>;
		fillDisabilityStep(hasDisability?: string): Chainable<any>;
		fillGenderIdentityStep(gender: string): Chainable<any>;
		fillAcceptsOnlineSupportStep(): Chainable<any>;
		fillSupportTypeStep(): Chainable<any>;
		fillGenderViolenceStep(option: string): Chainable<any>;
		fillViolenceLocationStep(option: string): Chainable<any>;
		fillExternalSupportStep(option: string): Chainable<any>;
		fillFinancialNeedStep(option: string): Chainable<any>;
	}
}
