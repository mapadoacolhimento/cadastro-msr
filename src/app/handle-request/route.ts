import { Gender, Race, SupportRequests, SupportType } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import * as Yup from "yup";
import {
	getErrorMessage,
	handleDuplicatedSupportRequest,
	validateAndUpsertZendeskTicket,
	validateAndUpsertZendeskUser,
	upsertMsr,
	checkMatchEligibility,
	HandleRequestResponse,
} from "../../lib";
import { createMatch } from "../../integration";

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
	acceptsOnlineSupport: Yup.boolean().required(),
	supportType: Yup.array(
		Yup.string().oneOf(Object.values(SupportType)).required()
	).required(),
}).required();

const handleUpsertMsr = async (
	payload: Yup.InferType<typeof payloadSchema>
) => {
	const zendeskUser = await validateAndUpsertZendeskUser(payload);

	if (!zendeskUser) {
		throw new Error("Unable to upsert user on Zendesk");
	}

	const msrZendeskUserId = zendeskUser.msrZendeskUserId;

	await upsertMsr({
		...payload,
		msrZendeskUserId: zendeskUser.msrZendeskUserId,
		status: "registered",
	});

	return msrZendeskUserId;
};

type CreateMatch = Pick<SupportRequests, "msrId" | "supportType"> & {
	msr: Yup.InferType<typeof payloadSchema>;
	supportRequestId: SupportRequests["supportRequestId"] | null;
	zendeskTicketId: SupportRequests["zendeskTicketId"] | null;
};

const handleCreateMatch = async ({
	supportType,
	supportRequestId,
	msrId,
	zendeskTicketId,
	msr,
}: CreateMatch) => {
	const subjectSupportType =
		supportType === "legal" ? "Jurídico" : "Psicológico";

	const bodyTicket = {
		ticketId: zendeskTicketId as unknown as number,
		msrZendeskUserId: msrId as unknown as number,
		status: "new",
		subject: `[${subjectSupportType}] ${msr.firstName}, ${msr.city} - ${msr.state}`,
		statusAcolhimento: "solicitação_recebida",
		msrName: msr.firstName,
		supportType: supportType,
		comment: {
			body: `${msr.firstName} solicitou acolhimento pelo cadastro`,
			public: false,
		},
	};

	const zendeskTicket = await validateAndUpsertZendeskTicket(bodyTicket);

	if (!zendeskTicket) {
		throw new Error("Unable to upsert ticket on Zendesk");
	}

	const matchBody = {
		supportRequestId: supportRequestId,
		msrId: msrId,
		zendeskTicketId: zendeskTicket.ticketId,
		supportType: supportType,
		status: "open" as const,
		hasDisability: msr.hasDisability,
		lat: msr.lat as unknown as Decimal,
		lng: msr.lng as unknown as Decimal,
		city: msr.city,
		state: msr.state,
		acceptsOnlineSupport: msr.acceptsOnlineSupport,
		requiresLibras: null,
		supportExpertise: null,
		priority: null,
	};

	const match = await createMatch(matchBody);

	if (!match) {
		throw new Error("Unable to create match");
	}

	return match;
};

export async function POST(request: Request) {
	try {
		const payload = await request.json();

		await payloadSchema.validate(payload);

		let response: HandleRequestResponse = {};
		const msrZendeskUserId = await handleUpsertMsr(payload);

		for (let i = 0; payload.supportType.length > i; i++) {
			const supportType: SupportType = payload.supportType[i];

			const { supportRequestId, zendeskTicketId, shouldCreateMatch } =
				await checkMatchEligibility({
					email: payload.email,
					supportType: supportType,
				});

			if (shouldCreateMatch) {
				const match = await handleCreateMatch({
					supportType,
					supportRequestId,
					msrId: msrZendeskUserId,
					zendeskTicketId,
					msr: payload,
				});

				response[supportType] = supportRequestId
					? match.status
					: match[0].status;
			} else {
				await handleDuplicatedSupportRequest({
					firstName: payload.firstName,
					supportRequestId: supportRequestId!,
					zendeskTicketId: zendeskTicketId as unknown as number,
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
