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
	ViolenceGenderId,
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
		ViolenceGenderId(),
	];
}
export function getHiddenStepsForm() {
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
		ViolenceTime(),
	];
}
