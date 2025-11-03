/// <reference types="cypress" />

declare namespace Cypress {
	interface Chainable<Subject = any> {
		goThroughHomePage(): Chainable<any>;
		fillBasicRegisterInformationStep(
			firstName?: string,
			email?: string,
			confirmEmail?: string,
			phone?: string,
			confirmPhone?: string,
			dateOfBirth?: string
		): Chainable<any>;
		fillGenderIdentityStep(gender: string): Chainable<any>;
		fillAcceptsOnlineSupportStep(): Chainable<any>;
		fillSupportTypeStep(supportType: Record<string, string>): Chainable<any>;
		fillGenderViolenceStep(option: string): Chainable<any>;
		fillViolenceOccurredInBrazilStep(option: string): Chainable<any>;
		fillExternalSupportStep(option: string[]): Chainable<any>;
		fillFinancialNeedStep(option: string): Chainable<any>;
		fillGeolocationStep(): Chainable<any>;
		fillDiversityInformationStep(msrEmail?: string): Chainable<any>;
		fillDateOfBirthStep(dateOfBirth: string): Chainable<any>;
		fillAllSteps(supportType: Record<string, string>): Chainable<any>;
		fillAllStepsApp2(supportType: Record<string, string>): Chainable<any>;
		checkForaCriteriosPage(): Chainable<any>;
		goThroughBeginRegistrationStep(): Chainable<any>;
		fillFinancialBlock(): Chainable<any>;
		fillMonthlyIncomeStep(): Chainable<any>;
		fillMonthlyIncomeRangeStep(): Chainable<any>;
		fillEmploymentStatusStep(
			employmentStatusOptionText?: string
		): Chainable<any>;
		fillDependantsStep(hasDependant?: boolean): Chainable<any>;
		fillFamilyProviderStep(isProvider?: boolean): Chainable<any>;
		fillPropertyOwnershipStep(hasProperty?: boolean): Chainable<any>;
		fillViolenceTypeStep(): Chainable<any>;
		fillNoViolenceTypeStep(): Chainable<any>;
		fillViolenceTimeStep(): Chainable<any>;
		fillPerpetratorGenderIdStep(perpetratorGenderId: string): Chainable<any>;
		fillViolencePerpetratorStep(): Chainable<any>;
		fillLivesWithPerpetratorStep(livesWithPerpetrator: string): Chainable<any>;
		fillViolenceLocationStep(): Chainable<any>;
		fillPoliceReportDifficultyStep(): Chainable<any>;
	}
}
