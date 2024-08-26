import {
	ZENDESK_API_TOKEN,
	ZENDESK_API_USER,
	ZENDESK_SUBDOMAIN,
} from "../constants";
import getErrorMessage from "../getErrorMessage";
import { ZendeskTicket } from "../types";

export default async function createOrUpdateTicket(ticket: ZendeskTicket) {
	try {
		const endpoint = `${ZENDESK_SUBDOMAIN}/api/v2/tickets/${ticket.id ? ticket.id : ""}`;
		const response = await fetch(endpoint, {
			body: JSON.stringify({ ticket }),
			method: ticket.id ? "PUT" : "POST",
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

		const data = await response.json();

		return data;
	} catch (e) {
		console.error(
			`[upsertTicket] - Something went wrong when upserting this ticket '${
				ticket.id
			}' for this user '${ticket.requester_id}': ${getErrorMessage(e)}`
		);
		return null;
	}
}
