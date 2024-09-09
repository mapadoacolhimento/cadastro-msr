import * as Yup from "yup";
import { type SupportRequests, SupportType } from "@prisma/client";
import { upsertZendeskTicket } from "@/lib";
import {
	ZENDESK_CUSTOM_FIELDS_DICIO,
	ZENDESK_MSR_ORGANIZATION_ID,
} from "@/constants";
import type { ZendeskTicket } from "@/types";

type CustomFieldsType = {
	id: number;
	value: string;
};

const ticketSchemaCreate = Yup.object({
	msrZendeskUserId: Yup.number().required(),
	subject: Yup.string().required(),
	status: Yup.string().required(),
	statusAcolhimento: Yup.string().required(),
	supportType: Yup.string().oneOf(Object.values(SupportType)).required(),
	comment: Yup.object({
		body: Yup.string().required(),
		public: Yup.boolean().required(),
	}).required(),
	msrName: Yup.string().required(),
}).required();

const ticketSchemaUpdate = Yup.object({
	ticketId: Yup.number().required(),
	subject: Yup.string(),
	status: Yup.string(),
	statusAcolhimento: Yup.string(),
	supportType: Yup.string().oneOf(Object.values(SupportType)),
	comment: Yup.object({
		body: Yup.string().required(),
		public: Yup.boolean().required(),
	}).default(null),
	msrZendeskUserId: Yup.number(),
	msrName: Yup.string().nullable(),
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

type UpdateZendeskTicketType = Omit<
	Yup.InferType<typeof ticketSchemaUpdate>,
	"ticketId"
>;

function getCustomFieldsTicket(payload: UpdateZendeskTicketType) {
	let custom_fields: CustomFieldsType[] = [];

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

	if (custom_fields.length === 0) return null;

	return custom_fields;
}

export default async function validateAndUpsertZendeskTicket(
	payload: {
		ticketId: SupportRequests["zendeskTicketId"] | null;
	} & UpdateZendeskTicketType
) {
	const schema = payload.ticketId ? ticketSchemaUpdate : ticketSchemaCreate;
	const validatedPayload = await schema.validate(payload);

	const ticketId = payload.ticketId
		? {
				id: payload.ticketId,
			}
		: {};

	const ticket = {
		...ticketId,
		requester_id: validatedPayload.msrZendeskUserId,
		subject: validatedPayload.subject,
		organization_id: ZENDESK_MSR_ORGANIZATION_ID,
		status: validatedPayload.status,
		comment: validatedPayload.comment,
		custom_fields: getCustomFieldsTicket(validatedPayload),
	};

	const ticketWithoutEmptyProperties = Object.entries(ticket).filter(
		([_, value]) => value !== null && typeof value !== "undefined"
	);
	const validTicket = Object.fromEntries(ticketWithoutEmptyProperties);

	return await upsertZendeskTicket(validTicket);
}
