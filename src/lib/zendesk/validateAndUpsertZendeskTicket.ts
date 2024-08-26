import * as Yup from "yup";
import {
	createOrUpdateTicket,
	msrOrganizationId,
	ZendeskTicket,
	ZENDESK_CUSTOM_FIELDS_DICIO,
} from "../";
import { SupportType } from "@prisma/client";

type CustomFields = {
	id: number;
	value: string;
};

const payloadSchemaCreate = Yup.object({
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

const payloadSchemaUpdate = Yup.object({
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

function getCustomFieldsTicket(
	payload: Omit<Yup.InferType<typeof payloadSchemaUpdate>, "ticketId">
) {
	let custom_fields: CustomFields[] = [];

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
		ticketId?: number;
	} & Yup.InferType<typeof payloadSchemaUpdate>
) {
	const schema = payload.ticketId ? payloadSchemaUpdate : payloadSchemaCreate;
	const validatedPayload = (await schema.validate(payload)) as Yup.InferType<
		typeof schema
	>;

	const ticketId = payload.ticketId
		? {
				id: payload.ticketId,
			}
		: {};

	const ticket: ZendeskTicket = {
		...ticketId,
		requester_id: validatedPayload.msrZendeskUserId,
		subject: validatedPayload.subject,
		organization_id: msrOrganizationId,
		status: validatedPayload.status,
		comment: validatedPayload.comment,
		custom_fields: getCustomFieldsTicket(validatedPayload),
	};

	const ticketWithoutEmptyProperties = Object.entries(ticket).filter(
		([_, value]) => value !== null && typeof value !== "undefined"
	);
	const validTicket = Object.fromEntries(ticketWithoutEmptyProperties);

	return await createOrUpdateTicket(validTicket);
}
