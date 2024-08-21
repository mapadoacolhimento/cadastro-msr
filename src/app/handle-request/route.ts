import { Gender, Race, SupportType } from "@prisma/client";
import * as Yup from "yup";
import { sign } from "jsonwebtoken";
import {
	getErrorMessage,
	MATCH_LAMBDA_URL,
	JWT_SECRET,
	handleDuplicatedSupportRequest,
	validateAndUpsertZendeskTicket,
	validateAndUpsertZendeskUser,
	upsertMsr,
	checkMatchEligibility,
	HandleRequestResponse,
} from "../../lib";

type SubjectInfo = {
	supportType: SupportType;
	firstName: string;
	city: string;
	state: string;
};

type CreateMatch = {
	msrZendeskUserId: bigint | null;
	supportRequestId: number | null;
	supportType: SupportType;
	zendeskTicketId: bigint | null;
	payload: Yup.InferType<typeof payloadSchema>;
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
	dateOfBirth: Yup.string().required().nullable(),
	hasDisability: Yup.boolean().required().nullable(),
	acceptsOnlineSupport: Yup.boolean().required(),
	supportType: Yup.array(
		Yup.string().oneOf(Object.values(SupportType)).required()
	).required(),
}).required();

const subject = (subjectInfo: SubjectInfo) => {
	const type: string =
		subjectInfo.supportType === "legal" ? "Jurídico" : "Psicológico";
	return `[${type}] ${subjectInfo.firstName}, ${subjectInfo.city} - ${subjectInfo.state}`;
};

const handleUpsertMsr = async (
	payload: Yup.InferType<typeof payloadSchema>
) => {
	const resZendeskUser = await validateAndUpsertZendeskUser(payload);

	if (!resZendeskUser.ok) {
		throw new Error(await resZendeskUser.text());
	}

	const user = await resZendeskUser.json();

	const msrZendeskUserId = user.msrZendeskUserId;

	await upsertMsr({
		msrZendeskUserId: user.msrZendeskUserId,
		...payload,
		status: "registered",
	});

	return msrZendeskUserId;
};

const handleCreateMatch = async (data: CreateMatch) => {
	const {
		supportType,
		supportRequestId,
		msrZendeskUserId,
		zendeskTicketId,
		payload,
	} = data;

	const bodyTicket = {
		ticketId: zendeskTicketId as unknown as number,
		msrZendeskUserId: msrZendeskUserId as unknown as number,
		status: "new",
		subject: subject({ ...payload, supportType: supportType }),
		statusAcolhimento: "solicitação_recebida",
		msrName: payload.firstName,
		supportType: supportType,
		comment: {
			body: `${payload.firstName} solicitou acolhimento pelo cadastro`,
			public: false,
		},
	};

	const resZendeskTicket = await validateAndUpsertZendeskTicket(bodyTicket);

	if (!resZendeskTicket.ok) {
		throw new Error(await resZendeskTicket.text());
	}

	const ticket = await resZendeskTicket.json();
	const lambdaUrl = `${MATCH_LAMBDA_URL}/${supportRequestId ? "handle-match" : "compose"}`;
	const jwtSecret = JWT_SECRET;
	const authToken = sign({ sub: "cadastro-msr" }, jwtSecret!, {
		expiresIn: 300, // expires in 5 minutes
	});
	const bodyLambda = {
		supportRequestId: supportRequestId,
		msrId: msrZendeskUserId,
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

	if (!resLambda.ok) {
		throw new Error(await resLambda.text());
	}

	const match = await resLambda.json();
	return match;
};

export async function POST(request: Request) {
	try {
		const payload = await request.json();

		await payloadSchema.validate(payload);
		let msrZendeskUserId = null;
		let response: HandleRequestResponse = {};

		for (let i = 0; payload.supportType.length > i; i++) {
			const supportType: SupportType = payload.supportType[i];

			const { supportRequestId, zendeskTicketId, shouldCreateMatch } =
				await checkMatchEligibility({
					email: payload.email,
					supportType: supportType,
				});

			if (shouldCreateMatch) {
				if (!msrZendeskUserId) {
					msrZendeskUserId = await handleUpsertMsr(payload);
				}
				const match = await handleCreateMatch({
					supportType,
					supportRequestId,
					msrZendeskUserId,
					zendeskTicketId,
					payload,
				});
				response[supportType] = supportRequestId
					? match.status
					: match[0].status;
			} else {
				if (supportRequestId && zendeskTicketId) {
					await handleDuplicatedSupportRequest({
						firstName: payload.firstName,
						supportRequestId,
						zendeskTicketId: zendeskTicketId as unknown as number,
						supportType,
					});

					response[supportType] = "duplicated";
				}
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
