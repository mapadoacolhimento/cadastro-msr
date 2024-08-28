import {
	ZENDESK_API_TOKEN,
	ZENDESK_API_USER,
	ZENDESK_SUBDOMAIN,
} from "@/constants";
import { getErrorMessage, stringifyBigInt } from "@/utils";
import { ZendeskTicket } from "@/types";

export default async function upserZendeskTicket(ticket: ZendeskTicket) {
	try {
		const body = stringifyBigInt(ticket);
		const endpoint = `${ZENDESK_SUBDOMAIN}/api/v2/tickets/${ticket.id ? ticket.id : ""}`;
		const response = await fetch(endpoint, {
			body: JSON.stringify({ ticket: body }),
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

		return {
			ticketId: data.ticket.id,
		};
	} catch (e) {
		console.error(
			`[upsertZendeskTicket] - Something went wrong when upserting this ticket '${
				ticket?.id || ""
			}' for this user '${ticket.requester_id}': ${getErrorMessage(e)}`
		);
		return null;
	}
}
