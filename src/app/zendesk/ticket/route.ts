import { NextRequest } from "next/server";
import { logger, validateAndUpsertZendeskTicket } from "@/lib";
import { getErrorMessage } from "@/utils";

export async function POST(request: NextRequest) {
	try {
		const payload = await request.json();

		const data = await validateAndUpsertZendeskTicket(payload);

		if (!data) {
			throw new Error(
				`Unable to upsert ticket '${payload?.ticketId || ""}' from user '${payload?.msrZendeskUserId}' on Zendesk`
			);
		}

		return Response.json(data);
	} catch (e) {
		const error = e as Record<string, unknown>;
		if (error["name"] === "ValidationError") {
			const errorMsg = `Validation error: ${getErrorMessage(error)}`;

			logger.error(`[upsertZendeskTicket] - 400: ${errorMsg}`);
			return new Response(errorMsg, {
				status: 400,
			});
		}

		logger.error(`[upsertZendeskTicket] - 500: ${getErrorMessage(error)}`);
		return new Response(getErrorMessage(error), {
			status: 500,
		});
	}
}
