import { Decimal } from "@prisma/client/runtime/library";
import {
	ZENDESK_API_TOKEN,
	ZENDESK_API_USER,
	ZENDESK_SUBDOMAIN,
} from "../constants";
import getErrorMessage from "../getErrorMessage";

type User = {
	id?: bigint;
	name: string;
	role: "end-user";
	organization_id: bigint;
	email: string;
	phone: string;
	user_fields: {
		condition: string;
		state: string;
		city: string;
		cep?: string;
		address?: string;
		cor: string;
		whatsapp: string;
		latitude: Decimal;
		longitude: Decimal;
	};
};

export default async function updateOrCreateUser(user: User) {
	try {
		const endpoint = ZENDESK_SUBDOMAIN + "/api/v2/users/create_or_update";

		const response = await fetch(endpoint, {
			body: JSON.stringify(user),
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization:
					"Basic " +
					Buffer.from(`${ZENDESK_API_USER}:${ZENDESK_API_TOKEN}`).toString(
						"base64"
					),
			},
		});

		if (!response.ok) {
			throw new Error(response.statusText);
		}

		return response;
	} catch (e) {
		const error = e as Record<string, unknown>;

		return new Response(getErrorMessage(error), {
			status: 500,
		});
	}
}
