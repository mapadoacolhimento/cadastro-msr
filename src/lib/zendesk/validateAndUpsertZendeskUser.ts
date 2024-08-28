import * as Yup from "yup";
import { upsertZendeskUser } from "@/lib";
import {
	colorOptions,
	ZENDESK_MSR_ORGANIZATION_ID,
	ZENDESK_NEW_USER_STATUS,
} from "@/constants";
import { Race, SupportType } from "@prisma/client";

const payloadSchema = Yup.object({
	email: Yup.string().email().required(),
	phone: Yup.string().min(10).required(),
	firstName: Yup.string().required(),
	city: Yup.string().required(),
	state: Yup.string().length(2).required(),
	neighborhood: Yup.string().required(),
	color: Yup.string().oneOf(Object.values(Race)).required(),
	zipcode: Yup.string().min(8).max(9).required(),
	dateOfBirth: Yup.date().required().nullable(),
	supportType: Yup.array()
		.of(Yup.string().oneOf(Object.values(SupportType)).required())
		.required(),
}).required();

function getColor(color: Race) {
	const option = colorOptions.find((option) => option.value === color);
	return option ? option.label.toLowerCase().normalize("NFD") : null;
}

function getZendeskSupportType(supportType: SupportType[]) {
	if (supportType.length === 2) {
		return "psicológico_e_jurídico";
	}
	if (supportType[0] === "legal") {
		return "jurídico";
	}
	return "psicológico";
}

export default async function validateAndUpsertZendeskUser(
	payload: Yup.InferType<typeof payloadSchema>
) {
	await payloadSchema.validate(payload);

	const user = {
		name: payload.firstName,
		role: "end-user",
		organization_id: ZENDESK_MSR_ORGANIZATION_ID,
		email: payload.email,
		phone: payload.phone,
		user_fields: {
			condition: ZENDESK_NEW_USER_STATUS,
			state: payload.state,
			city: payload.city,
			cep: payload.zipcode,
			neighborhood: payload.neighborhood,
			cor: getColor(payload.color),
			whatsapp: `https://wa.me/55${payload.phone}`,
			date_of_birth: payload.dateOfBirth,
			tipo_de_acolhimento: getZendeskSupportType(payload.supportType),
		},
	};

	return await upsertZendeskUser(user);
}
