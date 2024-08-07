import {
	ZENDESK_API_TOKEN,
	ZENDESK_API_USER,
	ZENDESK_SUBDOMAIN,
} from "../constants";
import getErrorMessage from "../getErrorMessage";
import { Ticket } from "../types";

export default async function createOrUpdateTicket(ticket: Ticket) {
	try {
		const endpoint =
			ZENDESK_SUBDOMAIN + "/api/v2/tickets/" + ticket.id?.toString();
		const method = ticket.id ? "PUT" : "POST";

		const response = await fetch(endpoint, {
			body: JSON.stringify({ ticket }),
			method: method,
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

		return await response.json();
	} catch (e) {
		const error = e as Record<string, unknown>;

		return new Response(getErrorMessage(error), {
			status: 500,
		});
	}
}
