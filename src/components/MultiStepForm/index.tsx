"use client";

import { PropsWithChildren } from "react";
import { FeatureFlag } from "@prisma/client";
import MultiStepFormWrapper from "./MultiStepFormWrapper";
import {
	BasicRegisterInformation,
	SupportType,
	GenderIdentity,
	GenderViolence,
	ViolenceLocation,
	ExternalSupport,
	Geolocation,
	DiversityInformation,
	DateOfBirth,
	BeginRegistration,
	FinancialBlock,
} from "./Steps";
import { formatRegisterFormValues } from "@/utils";
import type { HandleRequestResponse, Values } from "@/types";
import { NEW_FINANCIAL_TRIAGE_FEATURE_FLAG } from "@/lib";

export default function MultiStepForm({
	featureFlags,
}: PropsWithChildren<{ featureFlags: FeatureFlag[] }>) {
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

	const isNewFinancialTriageEnabled = featureFlags.some(
		(f) =>
			f.featureName === NEW_FINANCIAL_TRIAGE_FEATURE_FLAG && f.featureEnabled
	);

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
				monthlyIncomeRange: 0,
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
			}}
			onSubmit={onSubmit}
		>
			{GenderIdentity()}
			{DateOfBirth()}
			{GenderViolence()}
			{ViolenceLocation()}
			{ExternalSupport()}
			{FinancialBlock({ isNewFinancialTriageEnabled })}
			{BeginRegistration()}
			{SupportType()}
			{BasicRegisterInformation()}
			{Geolocation()}
			{DiversityInformation()}
		</MultiStepFormWrapper>
	);
}
