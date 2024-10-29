"use client";

import { useEffect, useState } from "react";
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
	BeginRegistration,
} from "./Steps";
import { formatRegisterFormValues } from "@/utils";
import type { HandleRequestResponse, Values } from "@/types";
import { TRIAGE_ECONOMIC_QUESTIONS_FEATURE_FLAG } from "@/lib";

export default function MultiStepForm() {
	const [
		isTriageEconomicQuestionsEnabled,
		setIsTriageEconomicQuestionsEnabled,
	] = useState(false);

	useEffect(() => {
		async function fetchFeatureFlag() {
			const response = await fetch(
				`/api/feature-flag?flag=${TRIAGE_ECONOMIC_QUESTIONS_FEATURE_FLAG}`
			);

			if (!response.ok) {
				setIsTriageEconomicQuestionsEnabled(false);
			}

			const data = await response.json();

			setIsTriageEconomicQuestionsEnabled(data.isFeatureFlagEnabled);
		}

		fetchFeatureFlag();
	}, []);

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
			{isTriageEconomicQuestionsEnabled ? <>ola!</> : FinancialNeed()}
			{BeginRegistration()}
			{SupportType()}
			{BasicRegisterInformation()}
			{Geolocation()}
			{DiversityInformation()}
		</MultiStepFormWrapper>
	);
}
