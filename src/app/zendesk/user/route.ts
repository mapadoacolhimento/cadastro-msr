import { NextRequest } from "next/server";
import { logger, validateAndUpsertZendeskUser } from "@/lib";
import { getErrorMessage } from "@/utils";

export async function POST(request: NextRequest) {
	try {
		const payload = await request.json();

		const data = await validateAndUpsertZendeskUser(payload);

		if (!data) {
			throw new Error("Unable to upsert user on Zendesk");
		}

		return Response.json(data);
	} catch (e) {
		const error = e as Record<string, unknown>;
		if (error["name"] === "ValidationError") {
			const errorMsg = `Validation error: ${getErrorMessage(error)}`;

			logger.error(`[upsertZendeskUser] - 400: ${errorMsg}`);
			return new Response(errorMsg, {
				status: 400,
			});
		}

		logger.error(`[upsertZendeskUser] - 500: ${getErrorMessage(error)}`);
		return new Response(getErrorMessage(error), {
			status: 500,
		});
	}
}
