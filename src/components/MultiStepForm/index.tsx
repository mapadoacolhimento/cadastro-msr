"use client";
import { formatRegisterFormValues } from "@/utils";
import type { HandleRequestResponse, Values } from "@/types";
import MultiStepFormWrapper from "./MultiStepFormWrapper";
import { getFormSteps, getHiddenStepsForm } from "@/utils/getFormSteps";

const ENABLE_NEW_STEPS = process.env.SHOW_NEW_STEPS === "true";

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
				confirmPhone: "",
				dateOfBirth: "",
				color: "",
				hasDisability: null,
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
				violenceTime: "",
			}}
			onSubmit={onSubmit}
		>
			{ENABLE_NEW_STEPS ? getHiddenStepsForm() : getFormSteps()}
		</MultiStepFormWrapper>
	);
}
