import { SupportRequests } from "@prisma/client";
import { MATCH_LAMBDA_URL } from "@/constants";
import { getErrorMessage } from "@/utils";
import logger from "./logger";

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
			logger.error(`[createMatch] - Failed to fetch auth token. Status: ${token.status} - ${token.statusText}`);
			throw new Error(token.statusText);
		}

		const authToken = await token.json();

		const handleMatchPayload = {
			supportRequest,
			shouldRandomize: true,
			matchType: "msr",
		};
		const { supportRequestId, ...rest } = supportRequest;
		const composePayload = [rest];

		const createMatchLambdaUrl = `${MATCH_LAMBDA_URL}/${supportRequestId ? "handle-match" : "compose"}`;

		const resCreateMatch = await fetch(createMatchLambdaUrl, {
			body: JSON.stringify(
				supportRequestId ? handleMatchPayload : composePayload
			),
			method: "POST",
			headers: {
				Authorization: authToken.message,
			},
		});

		if (!resCreateMatch.ok) {
			logger.error(`[createMatch] - Lambda responded with error. Status: ${resCreateMatch.status} - ${resCreateMatch.statusText}`);
			throw new Error(resCreateMatch.statusText);
		}

		const { message } = await resCreateMatch.json();

		return supportRequestId ? message : message[0];
	} catch (e) {
		logger.error(
			`[createMatch] - Something went wrong when creating a match for this support request '${
				supportRequest.supportRequestId
			}' for this user '${supportRequest.msrId}': ${getErrorMessage(e)}`,
			{ cause: e instanceof Error ? e.cause : undefined, stack: e instanceof Error ? e.stack : undefined, targetUrl: MATCH_LAMBDA_URL }
		);
		return null;
	}
}
