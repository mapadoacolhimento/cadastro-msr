import { getErrorMessage, validateAndUpsertZendeskUser } from "../../../lib";

export async function POST(request: Request) {
	try {
		const payload = await request.json();

		const response = await validateAndUpsertZendeskUser(payload);

		if (!response.ok) {
			throw new Error(await response.text());
		}

		const data = await response.json();
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
