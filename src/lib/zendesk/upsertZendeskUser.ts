import {
	ZENDESK_API_TOKEN,
	ZENDESK_API_USER,
	ZENDESK_SUBDOMAIN,
} from "../constants";
import { ZendeskUser } from "@/types";
import { getErrorMessage } from "@/utils";

export default async function upsertZendeskUser(user: ZendeskUser) {
	try {
		const endpoint = ZENDESK_SUBDOMAIN + "/api/v2/users/create_or_update";
		console.log("[upsertZendeskUser]:", {
			user: JSON.stringify(user, null, 2),
		});

		const response = await fetch(endpoint, {
			body: JSON.stringify({ user }),
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

		const data = await response.json();

		if (data.error && response.status !== 200) {
			throw new Error(
				`${data?.error?.title}: ${data?.error?.message || data?.error?.description} - ${JSON.stringify(data?.error?.details ?? {})}`
			);
		}

		let msrZendeskUserId;

		if (data.data) {
			msrZendeskUserId = data.data.user.id;
		} else {
			msrZendeskUserId = data.user.id;
		}

		return { msrZendeskUserId };
	} catch (e) {
		console.error(
			`[upsertZendeskUser] - Something went wrong when upserting this user on Zendesk '${
				user.id ?? user.email
			}': ${getErrorMessage(e)}`
		);

		return null;
	}
}
