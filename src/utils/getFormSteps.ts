import {
	BasicRegisterInformation,
	SupportType,
	GenderIdentity,
	ViolenceLocation,
	ExternalSupport,
	Geolocation,
	DiversityInformation,
	DateOfBirth,
	BeginRegistration,
	FinancialBlock,
	ViolenceType,
	ViolenceTime,
	GenderIdentityViolence,
} from "../components/MultiStepForm/Steps";

export function getFormSteps() {
	return [
		GenderIdentity(),
		DateOfBirth(),
		ViolenceType(),
		ViolenceLocation(),
		ExternalSupport(),
		FinancialBlock(),
		BeginRegistration(),
		SupportType(),
		BasicRegisterInformation(),
		Geolocation(),
		DiversityInformation(),
		//GenderIdentityViolence(),
	];
}
export function getHiddenStepsForm() {
	return [getFormSteps().concat([ViolenceTime()])];
}
