import * as Yup from "yup";
import { db } from ".";
import { Gender, MSRStatus, Race, MonthlyIncome } from "@prisma/client";
import {
	dependantsOptions,
	employmentStatusOptions,
	familyProviderOptions,
	monthlyIncomeOptions,
	monthlyIncomeRangeOptions,
	propertyOwnershipOptions,
} from "@/lib/constants";

const yesNoToBoolean = (value?: string | null) => value === "yes";

const payloadSchema = Yup.object({
	msrZendeskUserId: Yup.number().required(),
	email: Yup.string().email().required(),
	// removing the max length for phone number for now
	phone: Yup.string().min(10).required(),
	firstName: Yup.string().required(),
	city: Yup.string().required(),
	state: Yup.string().length(2).required(),
	neighborhood: Yup.string().required(),
	color: Yup.string().oneOf(Object.values(Race)).required(),
	zipcode: Yup.string().min(8).max(9).required(),
	status: Yup.string().oneOf(Object.values(MSRStatus)).required(),
	dateOfBirth: Yup.string().datetime().required().nullable(),
	gender: Yup.string().oneOf(Object.values(Gender)).required(),
	hasDisability: Yup.boolean().required().nullable(),
	acceptsOnlineSupport: Yup.boolean().required(),
	monthlyIncome: Yup.string().oneOf(monthlyIncomeOptions.map((o) => o.value)),
	monthlyIncomeRange: Yup.number()
		.oneOf(monthlyIncomeRangeOptions.map((o) => o.value))
		.nullable(),
	employmentStatus: Yup.string().oneOf(
		employmentStatusOptions.map((o) => o.value)
	),
	dependants: Yup.string().oneOf(dependantsOptions.map((o) => o.value)),
	familyProvider: Yup.string().oneOf(familyProviderOptions.map((o) => o.value)),
	propertyOwnership: Yup.string().oneOf(
		propertyOwnershipOptions.map((o) => o.value)
	),
}).required();

export default async function upsertMsrOnDb(
	payload: Yup.InferType<typeof payloadSchema>
) {
	await payloadSchema.validate(payload);

	const msr = {
		gender: payload.gender,
		raceColor: payload.color,
		hasDisability:
			typeof payload.hasDisability === "boolean" ? payload.hasDisability : null,
		acceptsOnlineSupport: payload.acceptsOnlineSupport
			? payload.acceptsOnlineSupport
			: true,
		neighborhood: payload.neighborhood,
		city: payload.city,
		state: payload.state,
		zipcode: payload.zipcode,
		status: payload.status,
	};

	const msrPii = {
		firstName: payload.firstName,
		email: payload.email,
		phone: payload.phone,
		dateOfBirth: payload.dateOfBirth ?? null,
	};

	const msrSocioeconomicData = {
		hasMonthlyIncome: payload.monthlyIncome
			? (payload.monthlyIncome as MonthlyIncome)
			: null,

		incomeRange:
			payload.monthlyIncome !== null && payload.monthlyIncomeRange !== undefined
				? String(payload.monthlyIncomeRange)
				: null,

		EmploymentStatus: payload.employmentStatus ?? null,

		hasFinancialDependents:
			payload.dependants !== null && payload.dependants !== undefined
				? payload.dependants === "yes"
				: null,

		FamilyProvider: payload.familyProvider ?? null,

		propertyOwnership:
			payload.propertyOwnership !== null
				? yesNoToBoolean(payload.propertyOwnership)
				: null,
	};

	const msrResult = await db.mSRs.upsert({
		where: {
			msrId: payload.msrZendeskUserId,
		},
		update: {
			...msr,
			MSRStatusHistory: {
				create: {
					status: msr.status,
				},
			},
			MSRPii: {
				update: msrPii,
			},
			MSRSocioeconomicData: {
				upsert: {
					update: msrSocioeconomicData,
					create: msrSocioeconomicData,
				},
			},
		},
		create: {
			msrId: payload.msrZendeskUserId,
			...msr,
			MSRStatusHistory: {
				create: {
					status: msr.status,
				},
			},
			MSRPii: {
				create: msrPii,
			},
			MSRSocioeconomicData: {
				create: msrSocioeconomicData,
			},
		},
	});

	return {
		msrId: msrResult.msrId,
	};
}
