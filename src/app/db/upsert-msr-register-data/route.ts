import { NextRequest } from "next/server";
import { Gender, SupportType, Race } from "@prisma/client";
import * as Yup from "yup";

import {
	externalSupportOptions,
	logger,
	mongodb,
	violenceTypeOptions,
} from "@/lib";
import { getErrorMessage } from "@/utils";

const payloadSchema = Yup.object({
	email: Yup.string().email().required(),
	confirmEmail: Yup.string().email(),
	phone: Yup.string().min(10),
	firstName: Yup.string(),
	gender: Yup.string().oneOf(Object.values(Gender)),
	color: Yup.string().oneOf([...Object.values(Race), ""]),
	city: Yup.string(),
	state: Yup.string(),
	neighborhood: Yup.string(),
	lat: Yup.number().nullable(),
	lng: Yup.number().nullable(),
	zipcode: Yup.string(),
	dateOfBirth: Yup.string(),
	hasDisability: Yup.string(),
	acceptsOnlineSupport: Yup.string(),
	genderViolence: Yup.string(),
	violenceLocation: Yup.string(),
	externalSupport: Yup.array().of(
		Yup.string().oneOf(externalSupportOptions.map((o) => o.value))
	),
	financialNeed: Yup.string(),
	term: Yup.boolean(),
	supportType: Yup.array(
		Yup.string().oneOf(Object.values(SupportType)).required()
	),
	violenceType: Yup.array(
		Yup.string()
			.oneOf(violenceTypeOptions.map((v) => v.value))
			.required()
	),
}).required();

export async function POST(request: NextRequest) {
	try {
		const payload = await request.json();

		await payloadSchema.validate(payload);

		const msrRegisterData = await mongodb.msrRegisterData.upsert({
			where: {
				email: payload.email,
			},
			update: {
				...payload,
				updatedAt: new Date().toISOString(),
			},
			create: {
				...payload,
			},
		});

		return Response.json({ id: msrRegisterData.id });
	} catch (e) {
		const error = e as Record<string, unknown>;
		if (error["name"] === "ValidationError") {
			const errorMsg = `Validation error: ${getErrorMessage(error)}`;
			logger.error(`[upsertMsrRegisterData] - 400: ${errorMsg}`);
			return new Response(errorMsg, {
				status: 400,
			});
		}

		logger.error(`[upsertMsrRegisterData] - 500: ${getErrorMessage(error)}`);
		return new Response(getErrorMessage(error), {
			status: 500,
		});
	}
}
