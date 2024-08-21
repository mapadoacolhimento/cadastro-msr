import * as Yup from "yup";
import { db } from ".";
import { Gender, MSRStatus, Race } from "@prisma/client";

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
	dateOfBirth: Yup.string().required().nullable(),
	gender: Yup.string().oneOf(Object.values(Gender)).required(),
	hasDisability: Yup.boolean().required().nullable(),
	acceptsOnlineSupport: Yup.boolean().required(),
}).required();

export default async function upsertMsr(
	payload: Yup.InferType<typeof payloadSchema>
) {
	await payloadSchema.validate(payload);

	const msr = {
		gender: payload.gender,
		raceColor: payload.color,
		hasDisability: payload.hasDisability ? payload.hasDisability : null,
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
		dateOfBirth: payload.dateOfBirth
			? new Date(payload.dateOfBirth).toISOString()
			: null,
	};

	const msrResult = await db.mSRs.upsert({
		where: {
			msrId: payload.msrZendeskUserId,
		},
		update: msr,
		create: {
			msrId: payload.msrZendeskUserId,
			...msr,
		},
	});

	await db.mSRPiiSec.upsert({
		where: {
			msrId: payload.msrZendeskUserId,
			email: payload.email,
		},
		update: msrPii,
		create: {
			msrId: payload.msrZendeskUserId,
			...msrPii,
		},
	});

	await db.mSRStatusHistory.create({
		data: {
			msrId: payload.msrZendeskUserId,
			status: payload.status,
		},
	});

	return {
		msrId: msrResult.msrId,
	};
}