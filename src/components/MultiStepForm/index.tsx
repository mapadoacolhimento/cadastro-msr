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
import { useRouter } from "next/navigation";
import { formatValues } from "../../lib";

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
	const router = useRouter();

	async function onSubmit(values: Values) {
		const response = await fetch("/handle-request", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: formatValues(values),
		});
		console.log(response);
		if (!response.ok) {
			throw new Error(response.statusText);
		}
		const data = await response.json();

		let redirectEndpoint = "/acolhimento-andamento";

		for (let key in data) {
			if (data[key] && data[key] != "duplicated") {
				redirectEndpoint = "/cadastro-finalizado";
			}
		}

		router.push(redirectEndpoint);
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
