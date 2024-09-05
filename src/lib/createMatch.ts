import { SupportRequests } from "@prisma/client";
import { MATCH_LAMBDA_URL } from "@/constants";
import { getErrorMessage } from "@/utils";

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
			throw new Error(resCreateMatch.statusText);
		}

		const { message: body } = await resCreateMatch.json();

		return supportRequestId ? body.status : body[0].status;
	} catch (e) {
		console.error(
			`[createMatch] - Something went wrong when creating a match for this support request '${
				supportRequest.supportRequestId
			}' for this user '${supportRequest.msrId}': ${getErrorMessage(e)}`
		);
		return null;
	}
}
