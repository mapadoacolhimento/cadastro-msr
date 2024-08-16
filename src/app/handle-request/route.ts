import * as Yup from "yup";
import { sign } from "jsonwebtoken";
import {
	getErrorMessage,
	db,
	MATCH_LAMBDA_URL,
	JWT_SECRET,
	emailDuplicated,
	BASE_URL,
} from "../../lib";
import { Gender, Race, SupportType } from "@prisma/client";

type SubjectInfo = {
	supportType: SupportType;
	firstName: string;
	city: string;
	state: string;
};

type DuplicatedRequest = {
	firstName: string;
	supportRequestId: number;
	ticketId: number;
	supportType: SupportType;
};

type RequestResponse = {
	psychological?: string | null;
	legal?: string | null;
};
const payloadSchema = Yup.object({
	email: Yup.string().email().required(),
	phone: Yup.string().min(10).required(),
	firstName: Yup.string().required(),
	gender: Yup.string().oneOf(Object.values(Gender)).required(),
	color: Yup.string().oneOf(Object.values(Race)).required(),
	city: Yup.string().required(),
	state: Yup.string().length(2).required(),
	neighborhood: Yup.string().required(),
	lat: Yup.number().required().nullable(),
	lng: Yup.number().required().nullable(),
	zipcode: Yup.string().min(8).max(9).required(),
	dateOfBirth: Yup.date().required().nullable(),
	hasDisability: Yup.boolean().required().nullable(),
	acceptsOnlineSupport: Yup.boolean(),
	supportType: Yup.array(
		Yup.string().oneOf(Object.values(SupportType)).required()
	).required(),
}).required();

const subject = (subjectInfo: SubjectInfo) => {
	const type: string =
		subjectInfo.supportType === "legal" ? "Jurídico" : "Psicológico";
	return `[${type}] ${subjectInfo.firstName}, ${subjectInfo.city} - ${subjectInfo.state}`;
};

const handleDuplicated = async (supportRequest: DuplicatedRequest) => {
	await db.supportRequests.update({
		where: {
			supportRequestId: supportRequest.supportRequestId,
		},
		data: {
			status: "duplicated",
		},
	});

	await db.supportRequestStatusHistory.create({
		data: {
			supportRequestId: supportRequest.supportRequestId,
			status: "duplicated",
		},
	});

	const resTicket = await fetch(`${BASE_URL}/zendesk/ticket`, {
		body: JSON.stringify({
			ticketId: supportRequest.ticketId,
			status: "open",
			statusAcolhimento: "solicitação_repetida",
			supportType: supportRequest.supportType,
			comment: {
				body: emailDuplicated(supportRequest.firstName),
				public: true,
			},
		}),
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!resTicket.ok) {
		throw new Error(resTicket.statusText);
	}
};
export async function POST(request: Request) {
	try {
		const payload = await request.json();

		await payloadSchema.validate(payload);

		let response: RequestResponse = {};

		for (let i = 0; payload.supportType.length > i; i++) {
			const supportType: SupportType = payload.supportType[i];

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
			const { supportRequestId, ticketId, shouldCreateMatch } =
				await resEligibilitily.json();

			if (shouldCreateMatch) {
				const resZendeskUser = await fetch(`${BASE_URL}/zendesk/user`, {
					body: JSON.stringify(payload),
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
				});

				const user = await resZendeskUser.json();

				const resMsr = await fetch(`${BASE_URL}/db/upsert-msr`, {
					body: JSON.stringify({
						msrZendeskUserId: user.msrZendeskUserId,
						...payload,
					}),
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
				});
				const bodyTicket = {
					ticketId: ticketId,
					msrZendeskUserId: user.msrZendeskUserId,
					status: "new",
					subject: subject({ ...payload, supportType: supportType }),
					statusAcolhimento: "solicitação_recebida",
					supportType: supportType,
					comment: {
						body: `${payload.firstName} solicitou acolhimento pelo cadastro`,
						public: false,
					},
				};

				const resZendeskTicket = await fetch(`${BASE_URL}/zendesk/ticket`, {
					body: JSON.stringify(bodyTicket),
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
				});

				const ticket = await resZendeskTicket.json();
				const lambdaUrl = `${MATCH_LAMBDA_URL}/${supportRequestId ? "handle-match" : "compose"}`;
				const jwtSecret = JWT_SECRET;
				const authToken = sign({ sub: "cadastro-msr" }, jwtSecret!, {
					expiresIn: 300, // expires in 5 minutes
				});
				const bodyLambda = {
					supportRequestId: supportRequestId,
					msrId: user.msrZendeskUserId,
					zendeskTicketId: ticket.ticketId,
					supportType: supportType,
					status: "open",
					hasDisability: payload.hasDisability,
					lat: payload.lat,
					lng: payload.lng,
					city: payload.city,
					state: payload.state,
				};
				const resLambda = await fetch(lambdaUrl, {
					body: JSON.stringify(
						supportRequestId ? { supportRequest: bodyLambda } : [bodyLambda]
					),
					method: "POST",
					headers: {
						Authorization: authToken,
					},
				});
				const match = await resLambda.json();
				response[supportType] = match.status;
			} else {
				await handleDuplicated({
					firstName: payload.firstName,
					supportRequestId,
					ticketId,
					supportType,
				});
				response[supportType] = "duplicated";
			}
		}
		return Response.json(response);
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
