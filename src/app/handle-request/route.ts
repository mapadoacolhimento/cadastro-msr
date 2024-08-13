import * as Yup from "yup";
import { getErrorMessage, db } from "../../lib";
import { Gender, MSRStatus, Race, SupportType } from "@prisma/client";
import { BASE_URL, ZENDESK_API_TOKEN } from "../../lib";

const payloadSchema = Yup.object({
	email: Yup.string().email().required(),
	phone: Yup.string().min(10).required(),
	firstName: Yup.string().required(),
	gender: Yup.string().oneOf(Object.values(Gender)).required(),
	color: Yup.string().oneOf(Object.values(Race)).required(),
	city: Yup.string().required(),
	state: Yup.string().length(2).required(),
	neighborhood: Yup.string().required(),
	coordinates: Yup.object({
		lat: Yup.number().required(),
		lng: Yup.number().required(),
	}).required(),
	zipcode: Yup.string().min(8).max(9).required(),
	status: Yup.string().oneOf(Object.values(MSRStatus)).required(),
	dateOfBirth: Yup.date().required().nullable(),
	hasDisability: Yup.boolean().required().nullable(),
	acceptsOnlineSupport: Yup.boolean().required(),
	supportTypes: Yup.array(
		Yup.string().oneOf(Object.values(SupportType)).required()
	).required(),
}).required();

export async function POST(request: Request) {
	try {
		const payload = await request.json();

		await payloadSchema.validate(payload);
		for (let i = 0; payload.supportTypes.length > i; i++) {
			const supportType = payload.supportTypes[i];

			const resEligibilitily = await fetch(`${BASE_URL}/check-eligibility`, {
				body: JSON.stringify({
					email: payload.email,
					supportType: supportType,
				}),
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});
			console.log(resEligibilitily);
			const eligibilitily = await resEligibilitily.json();
			console.log(eligibilitily);
			if (!eligibilitily.shouldCreateMatch) {
				const supportRequestId = eligibilitily.supportRequestId;
				const ticketId = eligibilitily.ticketId;
				await db.supportRequests.update({
					where: {
						supportRequestId: supportRequestId,
					},
					data: {
						status: "duplicated",
					},
				});

				await db.supportRequestStatusHistory.create({
					data: {
						supportRequestId: supportRequestId,
						status: "duplicated",
					},
				});

				await fetch(`${BASE_URL}/zendesk/ticket`, {
					body: JSON.stringify({
						ticketId: ticketId,
						status: "open",
						statusAcolhimento: "solicitação_repetida",
						supportType: supportType,
						comment: {
							body: `${payload.firstName} solicitou acolhimento novamente`,
							public: false,
						},
					}),
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
				});

				// await fetch(`${BASE_URL}/zendesk/ticket`,{
				// 	body: JSON.stringify({
				// 		ticketId: ticketId,
				// 		comment: {
				// 			body: "TBD",
				// 			public: true
				// 		},
				// 	}),
				// 	method: "POST",
				// 	headers: {
				// 		"Content-Type": "application/json"
				// 	},
				// });
			}
		}

		return Response.json({});
	} catch (e) {
		const error = e as Record<string, unknown>;
		if (error["name"] === "ValidationError") {
			const errorMsg = `Validation error: ${getErrorMessage(error)}`;

			return new Response(errorMsg, {
				status: 400,
			});
		}

		return new Response(getErrorMessage(error), {
			status: 500,
		});
	}
}
