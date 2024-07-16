/// <reference types="cypress" />

declare namespace Cypress {
	interface Chainable<Subject = any> {
		fillBasicRegisterInformationStep(
			firstName?: string,
			email?: string,
			confirmEmail?: string,
			phone?: string,
			dateOfBirth?: string
		): Chainable<any>;
		fillDiversityInformationStep(
			color?: string,
			hasDisability?: string
		): Chainable<any>;
		fillGenderIdentityStep(): Chainable<any>;
		fillAcceptsOnlineSupportStep(): Chainable<any>;
		fillSupportTypeStep(): Chainable<any>;
	}
}
