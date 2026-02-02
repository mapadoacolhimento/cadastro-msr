import * as Yup from "yup";
import { db } from ".";
import {
	Gender,
	MSRStatus,
	Race,
	MonthlyIncome,
	MonthlyIncomeRange,
	EmploymentStatus,
	ViolenceType,
	ViolenceTime,
	PerpetratorGender,
	ViolenceLocation,
	LegalActionsTaken,
	LegalActionDifficulty,
	ProtectiveFactor,
	RiskFactor,
	ViolencePerpetrator,
	LivesWithPerpetrator,
} from "@prisma/client";
import {
	familyProviderOptions,
	livesWithPerpetratorOptions,
	monthlyIncomeOptions,
	monthlyIncomeRangeOptions,
	perpetratorGenderOptions,
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
	propertyOwnership: Yup.boolean().nullable(),
	violenceType: Yup.array().of(Yup.string().oneOf(Object.values(ViolenceType))),
	violenceTime: Yup.string().oneOf(Object.values(ViolenceTime)),
	violenceOccurredInBrazil: Yup.string().required(),
	perpetratorGender: Yup.string().oneOf(
		perpetratorGenderOptions.map((o) => o.value)
	),
	violencePerpetrator: Yup.array().of(
		Yup.string().oneOf(Object.values(ViolencePerpetrator))
	),
	livesWithPerpetrator: Yup.string().oneOf(
		livesWithPerpetratorOptions.map((o) => o.value)
	),
	violenceLocation: Yup.array().of(
		Yup.string().oneOf(Object.values(ViolenceLocation))
	),
	legalActionsTaken: Yup.array().of(
		Yup.string().oneOf(Object.values(LegalActionsTaken))
	),
	legalActionDifficulty: Yup.array().of(
		Yup.string().oneOf(Object.values(LegalActionDifficulty))
	),
	protectiveFactors: Yup.array().of(
		Yup.string().oneOf(Object.values(ProtectiveFactor))
	),
	riskFactors: Yup.array().of(Yup.string().oneOf(Object.values(RiskFactor))),
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

const yesNoToBoolean = (value?: string | null): boolean | undefined =>
	value == null || value === "" ? undefined : value === "yes";

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

	function mapPayloadToViolenceHistory(
		payload: Yup.InferType<typeof payloadSchema>
	) {
		return {
			violenceType: payload.violenceType?.length
				? (payload.violenceType as ViolenceType[])
				: [],

			violenceTime: payload.violenceTime
				? (payload.violenceTime as ViolenceTime)
				: null,

			violenceOccurredInBrazil:
				yesNoToBoolean(payload.violenceOccurredInBrazil) ?? false,

			perpetratorGender: payload.perpetratorGender
				? (payload.perpetratorGender as PerpetratorGender)
				: null,

			violencePerpetrator: payload.violencePerpetrator?.length
				? (payload.violencePerpetrator as ViolencePerpetrator[])
				: [],

			livesWithPerpetrator: payload.livesWithPerpetrator
				? (payload.livesWithPerpetrator as LivesWithPerpetrator)
				: null,

			violenceLocation: payload.violenceLocation?.length
				? (payload.violenceLocation as ViolenceLocation[])
				: [],

			legalActionsTaken: payload.legalActionsTaken?.length
				? (payload.legalActionsTaken as LegalActionsTaken[])
				: [],

			legalActionDifficulty: payload.legalActionDifficulty?.length
				? (payload.legalActionDifficulty as LegalActionDifficulty[])
				: [],

			protectiveFactors: payload.protectiveFactors?.length
				? (payload.protectiveFactors as ProtectiveFactor[])
				: [],

			riskFactors: payload.riskFactors?.length
				? (payload.riskFactors as RiskFactor[])
				: [],
		};
	}

	const msrViolenceHistoryData = mapPayloadToViolenceHistory(payload);

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

	await db.mSRViolenceHistory.upsert({
		where: {
			msrId: payload.msrZendeskUserId,
		},
		update: msrViolenceHistoryData,
		create: {
			msrId: payload.msrZendeskUserId,
			...msrViolenceHistoryData,
		},
	});

	return {
		msrId: msrResult.msrId,
	};
}
