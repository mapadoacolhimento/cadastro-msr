import {
	ZENDESK_API_TOKEN,
	ZENDESK_API_USER,
	ZENDESK_SUBDOMAIN,
} from "../constants";
import getErrorMessage from "../getErrorMessage";
import { TicketUpdate, TicketsUpdate } from "../types";

export default async function updateManyTickets(
	ids: string,
	ticketUpdate: TicketUpdate | TicketsUpdate
) {
	try {
		const endpoint =
			ZENDESK_SUBDOMAIN + "/api/v2/tickets/update_many.json?ids=" + ids;

		const response = await fetch(endpoint, {
			body: JSON.stringify({ ...ticketUpdate }),
			method: "PUT",
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
