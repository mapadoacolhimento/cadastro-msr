import {
	Gender,
	SupportType,
	Race,
	type MSRPiiSec,
	type SupportRequests,
	EmploymentStatus,
} from "@prisma/client";
import * as Yup from "yup";
import {
	handleDuplicatedSupportRequest,
	validateAndUpsertZendeskTicket,
	validateAndUpsertZendeskUser,
	upsertMsrOnDb,
	checkMatchEligibility,
	createMatch,
	logger,
} from "@/lib";
import type { HandleRequestResponse } from "@/types";
import { getErrorMessage } from "@/utils";
import { ZENDESK_NEW_TICKET_STATUS } from "@/constants";

export const maxDuration = 30;

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
	dateOfBirth: Yup.string().datetime().required(),
	hasDisability: Yup.boolean().required().nullable(),
	acceptsOnlineSupport: Yup.boolean().required(),
	employmentStatus: Yup.string()
		.oneOf(Object.values(EmploymentStatus))
		.required(),
	supportType: Yup.array(
		Yup.string().oneOf(Object.values(SupportType)).required()
	).required(),
}).required();

const handleUpsertMsrOnZendeskAndDb = async (
	payload: Yup.InferType<typeof payloadSchema>
) => {
	const zendeskUser = await validateAndUpsertZendeskUser(payload);

	if (!zendeskUser) {
		throw new Error(`Unable to upsert user on Zendesk`);
	}

	const msrZendeskUserId = zendeskUser.msrZendeskUserId;

	await upsertMsrOnDb({
		...payload,
		msrZendeskUserId: zendeskUser.msrZendeskUserId,
		status: "registered",
	});

	return msrZendeskUserId;
};

type CreateMatch = {
	msr: Pick<MSRPiiSec, "firstName"> &
		Pick<
			SupportRequests,
			| "lat"
			| "lng"
			| "msrId"
			| "city"
			| "state"
			| "hasDisability"
			| "acceptsOnlineSupport"
		>;
	supportRequestId: SupportRequests["supportRequestId"] | null;
	zendeskTicketId: SupportRequests["zendeskTicketId"] | null;
	supportType: SupportRequests["supportType"];
};

const handleCreateMatch = async ({
	supportType,
	supportRequestId,
	zendeskTicketId,
	msr,
}: CreateMatch) => {
	const subjectSupportType =
		supportType === "legal" ? "Jurídico" : "Psicológico";

	const bodyTicket = {
		ticketId: zendeskTicketId,
		msrZendeskUserId: msr.msrId as unknown as number,
		status: "pending",
		subject: `[${subjectSupportType}] ${msr.firstName}, ${msr.city} - ${msr.state}`,
		statusAcolhimento: ZENDESK_NEW_TICKET_STATUS,
		msrName: msr.firstName,
		supportType: supportType,
		comment: {
			body: `${msr.firstName} solicitou acolhimento ${subjectSupportType.toLowerCase()} pelo cadastro.`,
			public: false,
		},
	};

	const zendeskTicket = await validateAndUpsertZendeskTicket(bodyTicket);

	if (!zendeskTicket) {
		throw new Error(
			`Unable to upsert ticket ${zendeskTicketId ?? ""} from user '${msr.msrId}' on Zendesk`
		);
	}

	const matchBody = {
		msrId: msr.msrId,
		zendeskTicketId: zendeskTicket.ticketId,
		supportType: supportType,
		status: "open" as const,
		supportExpertise: null,
		priority: null,
		hasDisability: msr.hasDisability,
		requiresLibras: null,
		acceptsOnlineSupport: msr.acceptsOnlineSupport,
		lat: msr.lat,
		lng: msr.lng,
		city: msr.city,
		state: msr.state,
		supportRequestId: supportRequestId,
	};

	const match = await createMatch(matchBody);

	if (!match) {
		throw new Error(
			`Unable to create match for MSR '${msr.msrId}' of supportRequestId '${supportRequestId}'`
		);
	}

	return match;
};

export async function POST(request: Request) {
	try {
		const payload = await request.json();

		await payloadSchema.validate(payload);

		let response: HandleRequestResponse = {};

		const msrZendeskUserId = await handleUpsertMsrOnZendeskAndDb(payload);

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
					zendeskTicketId,
					msr: {
						...payload,
						msrId: msrZendeskUserId,
					},
				});

				response[supportType] = {
					supportRequestId: supportRequestId ?? match.supportRequestId,
				};
			} else {
				const updatedSupportRequest = await handleDuplicatedSupportRequest(
					{
						supportRequestId: supportRequestId!,
						zendeskTicketId: zendeskTicketId!,
						supportType,
					},
					payload.firstName
				);

				response[supportType] = updatedSupportRequest;
			}
		}

		return Response.json(response);
	} catch (e) {
		const error = e as Record<string, unknown>;
		if (error["name"] === "ValidationError") {
			const errorMsg = `Validation error: ${getErrorMessage(error)}`;

			logger.error(`[checkMatchEligibility] - 400: ${errorMsg}`);
			return new Response(errorMsg, {
				status: 400,
			});
		}

		logger.error(`[checkMatchEligibility] - 500: ${getErrorMessage(error)}`);
		return new Response(getErrorMessage(error), {
			status: 500,
		});
	}
}
