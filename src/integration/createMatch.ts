import { SupportRequests, SupportType } from "@prisma/client";
import { MATCH_LAMBDA_URL, getErrorMessage } from "../lib";

export default async function createMatch(
	supportRequest: Omit<
		SupportRequests,
		"createdAt" | "updatedAt" | "supportRequestId"
	> & {
		supportRequestId: SupportRequests["supportRequestId"] | null;
	}
) {
	try {
		const token = await fetch(MATCH_LAMBDA_URL + "/sign", {
			method: "GET",
		});

		if (!token.ok) {
			throw new Error(await token.text());
		}

		const authToken = await token.json();

		const createMatchLambdaUrl = `${MATCH_LAMBDA_URL}/${supportRequest?.supportRequestId ? "handle-match" : "compose"}`;
		const resCreateMatch = await fetch(createMatchLambdaUrl, {
			body: JSON.stringify(
				supportRequest.supportRequestId
					? { supportRequest: supportRequest }
					: [supportRequest]
			),
			method: "POST",
			headers: {
				Authorization: authToken.message,
			},
		});

		if (!resCreateMatch.ok) {
			throw new Error(await resCreateMatch.text());
		}

		const match = await resCreateMatch.json();

		return match;
	} catch (e) {
		console.error(
			`[createMatch] - Something went wrong when creating a match for this support request '${
				supportRequest.supportRequestId
			}' for this user '${supportRequest.msrId}': ${getErrorMessage(e)}`
		);
		return null;
	}
}
