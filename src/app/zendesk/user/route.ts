import * as Yup from "yup";
import {
	colorOptions,
	createOrUpdateUser,
	getErrorMessage,
} from "../../../lib";
import { Race } from "@prisma/client";

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
}).required();

function getColor(color: string) {
	let result = "";
	colorOptions.forEach((option) => {
		if (option.value === color) {
			result = option.label.toLowerCase().normalize("NFD");
		}
	});
	return result;
}

export async function POST(request: Request) {
	try {
		const payload = await request.json();

		await payloadSchema.validate(payload);

		const user = {
			name: payload.firstName,
			role: "end-user",
			organization_id: 360273031591 as unknown as bigint,
			email: payload.email,
			phone: payload.phone,
			user_fields: {
				condition: "inscrita",
				state: payload.state,
				city: payload.city,
				cep: payload.zipcode,
				neighborhood: payload.neighborhood,
				cor: getColor(payload.color),
				whatsapp: payload.phone,
				date_of_birth: payload.dateOfBirth,
			},
		};

		const res = await createOrUpdateUser(user);

		let msrZendeskUserId;

		if (res.data) {
			msrZendeskUserId = res.data.user.id;
		} else {
			msrZendeskUserId = res.user.id;
		}

		return Response.json({
			msrZendeskUserId: msrZendeskUserId,
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
