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
import { formatRegisterFormValues } from "@/lib";
import type { HandleRequestResponse, Values } from "@/types";

export default function MultiStepForm() {
	async function onSubmit(values: Values): Promise<HandleRequestResponse> {
		const response = await fetch("/handle-request", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: formatRegisterFormValues(values),
		});

		if (!response.ok) {
			throw new Error(response.statusText);
		}

		const data = await response.json();

		return data;
	}

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
				acceptsOnlineSupport: "yes",
				supportType: [],
				gender: "",
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
			onSubmit={onSubmit}
		>
			{GenderIdentity()}
			{DateOfBirth()}
			{GenderViolence()}
			{ViolenceLocation()}
			{ExternalSupport()}
			{FinancialNeed()}
			{SupportType()}
			{BasicRegisterInformation()}
			{Geolocation()}
			{DiversityInformation()}
		</MultiStepFormWrapper>
	);
}
