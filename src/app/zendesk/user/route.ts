import { NextRequest } from "next/server";
import { validateAndUpsertZendeskUser } from "@/lib";
import { getErrorMessage } from "@/utils";

export async function POST(request: NextRequest) {
	try {
		const payload = await request.json();

		const data = await validateAndUpsertZendeskUser(payload);

		if (!data) {
			throw new Error("Unable to upsert user on Zendesk");
		}

		let msrZendeskUserId;

		if (data.data) {
			msrZendeskUserId = data.data.user.id;
		} else {
			msrZendeskUserId = data.user.id;
		}

		return Response.json({
			msrZendeskUserId: msrZendeskUserId,
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
