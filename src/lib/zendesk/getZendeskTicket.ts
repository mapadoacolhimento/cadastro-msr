import {
	ZENDESK_API_TOKEN,
	ZENDESK_API_USER,
	ZENDESK_SUBDOMAIN,
} from "@/constants";

import logger from "../logger";
import { getErrorMessage } from "@/utils";

export default async function getZendeskTicket(ticket_id: BigInt) {
	try {
		const endpoint = `${ZENDESK_SUBDOMAIN}/api/v2/tickets/${ticket_id}`;
		const response = await fetch(endpoint, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization:
					"Basic " +
					Buffer.from(`${ZENDESK_API_USER}:${ZENDESK_API_TOKEN}`).toString(
						"base64"
					),
			},
		});

		const data = await response.json();

		if (data.error && response.status !== 200) {
			throw new Error(getErrorMessage(data));
		}

		return {
			...data.ticket,
		};
	} catch (e) {
		logger.error(
			`[upsertZendeskTicket] - Something went wrong when fetch this ticket '${
				ticket_id
			}}': ${getErrorMessage(e)}`
		);
		return null;
	}
}
