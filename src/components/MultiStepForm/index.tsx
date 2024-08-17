"use client";

import MultiStepFormWrapper from "./MultiStepFormWrapper";
import {
	BasicRegisterInformation,
	SupportType,
	GenderIdentity,
	GenderViolence,
	ViolenceLocation,
	ExternalSupport,
	FinancialNeed,
	Geolocation,
	DiversityInformation,
	DateOfBirth,
} from "./Steps";
import { sleep } from "../../lib";

export interface Values {
	email: string;
	firstName: string;
	confirmEmail: string;
	phone: string;
	dateOfBirth: string;
	color: string;
	hasDisability: string;
	acceptsOnlineSupport: string;
	supportType: string[];
	genderIdentity: string;
	genderViolence: string;
	violenceLocation: string;
	externalSupport: string;
	financialNeed: string;
	terms: boolean;
	zipcode: string;
	neighborhood: string;
	city: string;
	state: string;
	lat: number | null;
	lng: number | null;
}

export default function MultiStepForm() {
	return (
		<MultiStepFormWrapper
			initialValues={{
				email: "",
				firstName: "",
				confirmEmail: "",
				phone: "",
				dateOfBirth: "",
				color: "",
				hasDisability: "",
				acceptsOnlineSupport: "",
				supportType: [],
				genderIdentity: "",
				genderViolence: "",
				violenceLocation: "",
				externalSupport: "",
				financialNeed: "",
				terms: false,
				city: "",
				state: "",
				neighborhood: "",
				lat: null,
				lng: null,
				zipcode: "",
			}}
			onSubmit={async (values: Values) =>
				sleep(300).then(() => console.log("Wizard submit", values))
			}
		>
			{GenderIdentity()}
			{DateOfBirth()}
			{GenderViolence()}
			{BasicRegisterInformation()}
			{Geolocation()}
			{DiversityInformation()}
			{SupportType()}
			{ExternalSupport()}
			{ViolenceLocation()}
			{FinancialNeed()}
		</MultiStepFormWrapper>
	);
}
