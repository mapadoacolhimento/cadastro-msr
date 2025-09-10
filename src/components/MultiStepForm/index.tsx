"use client";

import MultiStepFormWrapper from "./MultiStepFormWrapper";
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
} from "./Steps";
import { formatRegisterFormValues } from "@/utils";
import type { HandleRequestResponse, Values } from "@/types";

export default function MultiStepForm() {
	async function onSubmit(values: Values): Promise<HandleRequestResponse> {
		const formattedValues = formatRegisterFormValues(values);

		const response = await fetch("/handle-request", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: formattedValues,
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
				externalSupport: [],
				financialNeed: "",
				monthlyIncome: "",
				monthlyIncomeRange: null,
				employmentStatus: "",
				dependants: "",
				familyProvider: "",
				propertyOwnership: "",
				terms: false,
				city: "",
				state: "",
				neighborhood: "",
				lat: null,
				lng: null,
				zipcode: "",
				violenceType: [],
			}}
			onSubmit={onSubmit}
		>
			{GenderIdentity()}
			{DateOfBirth()}
			{ViolenceLocation()}
			{ViolenceType()}
			{ExternalSupport()}
			{FinancialBlock()}
			{BeginRegistration()}
			{SupportType()}
			{BasicRegisterInformation()}
			{Geolocation()}
			{DiversityInformation()}
		</MultiStepFormWrapper>
	);
}
