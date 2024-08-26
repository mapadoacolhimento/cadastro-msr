import { NextRequest } from "next/server";
import { getErrorMessage, validateAndUpsertZendeskTicket } from "../../../lib";

export async function POST(request: NextRequest) {
	try {
		const payload = await request.json();
		const data = await validateAndUpsertZendeskTicket(payload);

		if (!data) {
			throw new Error("Unable to upsert ticket on Zendesk");
		}

		return Response.json({
			ticketId: data.ticket.id,
		});
	} catch (e) {
		const error = e as Record<string, unknown>;
		if (error["name"] === "ValidationError") {
			const errorMsg = `Validation error: ${getErrorMessage(error)}`;

			return new Response(errorMsg, {
				status: 400,
			});
		}
		return new Response(getErrorMessage(error), {
			status: 500,
		});
	}
}
