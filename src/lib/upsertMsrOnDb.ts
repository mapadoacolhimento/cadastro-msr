import * as Yup from "yup";
import { db } from ".";
import {
	Gender,
	MSRStatus,
	Race,
	MonthlyIncome,
	MonthlyIncomeRange,
	EmploymentStatus,
} from "@prisma/client";
import {
	familyProviderOptions,
	monthlyIncomeOptions,
	monthlyIncomeRangeOptions,
} from "@/lib/constants";

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
	employmentStatus: Yup.string()
		.oneOf(Object.values(EmploymentStatus))
		.required(),
	dependants: Yup.boolean().nullable(),
	familyProvider: Yup.string().oneOf(familyProviderOptions.map((o) => o.value)),
	violenceType: Yup.array().of(Yup.string()).nullable(),
	propertyOwnership: Yup.boolean().nullable(),
	violenceTime: Yup.string().nullable(),
	violenceOccurredInBrazil: Yup.string().nullable(),
	perpetratorGender: Yup.string().nullable(),
	violencePerpetrator: Yup.string().nullable(),
	livesWithPerpetrator: Yup.string().nullable(),
	violenceLocation: Yup.array().nullable(),
	legalActionDifficulty: Yup.array().of(Yup.string()).nullable(),
	legalActionsTaken: Yup.array().of(Yup.string()).nullable(),
	protectiveFactors: Yup.array().of(Yup.string()).nullable(),
	riskFactors: Yup.array().of(Yup.string()).nullable(),
}).required();

const monthlyIncomeRangeMap: Record<number, MonthlyIncomeRange> = {
	0: MonthlyIncomeRange.no_income,
	0.5: MonthlyIncomeRange.half_minimum_wage,
	1: MonthlyIncomeRange.up_to_one_minimum_wage,
	2: MonthlyIncomeRange.up_to_two_minimum_wages,
	3: MonthlyIncomeRange.up_to_three_minimum_wages,
	4: MonthlyIncomeRange.up_to_four_minimum_wages,
	5: MonthlyIncomeRange.five_minimum_wages_or_more,
};

const mapMonthlyIncomeRange = (
	value?: number | null
): MonthlyIncomeRange | null => {
	if (value === null || value === undefined) {
		return null;
	}
	return monthlyIncomeRangeMap[value] ?? null;
};

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

		monthlyIncomeRange: mapMonthlyIncomeRange(payload.monthlyIncomeRange),

		employmentStatus: payload.employmentStatus,

		hasFinancialDependents:
			typeof payload.dependants === "boolean" ? payload.dependants : null,

		familyProvider: payload.familyProvider,

		propertyOwnership:
			typeof payload.propertyOwnership === "boolean"
				? payload.propertyOwnership
				: null,
	};

	const msrViolenceHistoryData = {
		violenceType: payload.violenceType ?? [],
		violenceTime: payload.violenceTime ?? null,
		violenceOccurredInBrazil:
			payload.violenceOccurredInBrazil !== null
				? yesNoToBoolean(payload.violenceOccurredInBrazil)
				: null,
		perpetratorGender: payload.perpetratorGender ?? null,
		violencePerpetrator: payload.violencePerpetrator ?? [],
		livesWithPerpetrator: payload.livesWithPerpetrator ?? [],
		violenceLocation: payload.violenceLocation ?? [],
		legalActionDifficulty: payload.legalActionDifficulty ?? null,
		legalActionsTaken: payload.legalActionsTaken ?? [],
		protectiveFactors: payload.protectiveFactors ?? [],
		riskFactors: payload.riskFactors,
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
		MSRViolenceHistoryData: {
			upsert: {
				update: msrViolenceHistoryData,
				create: msrViolenceHistoryData,
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
