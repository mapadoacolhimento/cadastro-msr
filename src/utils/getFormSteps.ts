import {
	BasicRegisterInformation,
	SupportType,
	GenderIdentity,
	ViolenceOccurredInBrazil,
	ExternalSupport,
	Geolocation,
	DiversityInformation,
	DateOfBirth,
	BeginRegistration,
	FinancialBlock,
	ViolenceType,
	ViolenceTime,
	PerpetratorGenderId,
	ViolencePerpetrator,
	LivesWithPerpetrator,
	ViolenceLocation,
} from "../components/MultiStepForm/Steps";

export function getFormSteps() {
	return [
		GenderIdentity(),
		DateOfBirth(),
		ViolenceType(),
		ViolenceOccurredInBrazil(),
		ExternalSupport(),
		FinancialBlock(),
		BeginRegistration(),
		SupportType(),
		BasicRegisterInformation(),
		Geolocation(),
		DiversityInformation(),
	];
}
export function getHiddenStepsForm() {
	return [
		GenderIdentity(),
		DateOfBirth(),
		ViolenceType(),
		ViolenceOccurredInBrazil(),
		ExternalSupport(),
		FinancialBlock(),
		BeginRegistration(),
		SupportType(),
		BasicRegisterInformation(),
		Geolocation(),
		DiversityInformation(),
		ViolenceTime(),
		PerpetratorGenderId(),
		ViolencePerpetrator(),
		LivesWithPerpetrator(),
		ViolenceLocation(),
	];
}
