import * as Yup from "yup";
import {
	createOrUpdateTicket,
	getErrorMessage,
	msrOrganizationId,
	Ticket,
} from "../../../lib";
import { SupportType } from "@prisma/client";
import { ZENDESK_CUSTOM_FIELDS_DICIO } from "../../../lib";

const payloadSchemaCreate = Yup.object({
	msrZendeskUserId: Yup.number().required(),
	subject: Yup.string().required(),
	status: Yup.string().required(),
	statusAcolhimento: Yup.string().required(),
	supportType: Yup.string().oneOf(Object.values(SupportType)),
	comment: Yup.object(),
	msrName: Yup.string(),
}).required();

const payloadSchemaUpdate = Yup.object({
	ticketId: Yup.number().required(),
	subject: Yup.string(),
	status: Yup.string(),
	statusAcolhimento: Yup.string(),
	supportType: Yup.string().oneOf(Object.values(SupportType)),
	comment: Yup.object(),
	msrZendeskUserId: Yup.number(),
	msrName: Yup.string(),
}).test(
	"atLeastOneField",
	"Must have at least one field to update",
	function (obj) {
		for (const [key, value] of Object.entries(obj)) {
			if (key != "ticketId" && value) {
				return true;
			}
		}
		return false;
	}
);

function getCustomFieldsTicket(payload: any) {
	let custom_fields: any = [];

	if (payload.msrName) {
		custom_fields.push({
			id: ZENDESK_CUSTOM_FIELDS_DICIO["nomeMsr"],
			value: payload.msrName,
		});
	}

	if (payload.statusAcolhimento) {
		custom_fields.push({
			id: ZENDESK_CUSTOM_FIELDS_DICIO["statusAcolhimento"],
			value: payload.statusAcolhimento,
		});
	}

	if (custom_fields.length === 0) return;

	return custom_fields;
}

export async function POST(request: Request) {
	try {
		const payload = await request.json();

		if (payload.ticketId) await payloadSchemaUpdate.validate(payload);
		else await payloadSchemaCreate.validate(payload);

		const ticket: Ticket = {
			id: payload.ticketId,
			requester_id: payload.msrZendeskUserId,
			subject: payload.subject,
			organization_id: msrOrganizationId,
			status: payload.status,
			comment: payload.comment,
			custom_fields: getCustomFieldsTicket(payload),
		};

		const ticketWithoutEmptyProperties = Object.entries(ticket).filter(
			([_, value]) => value !== null && typeof value !== "undefined"
		);
		const validTicket = Object.fromEntries(ticketWithoutEmptyProperties);
		const response = await createOrUpdateTicket(validTicket);

		return Response.json({
			ticketId: response.ticket.id,
		});
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
