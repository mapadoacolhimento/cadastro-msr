import { getErrorMessage, checkMatchEligibility } from "../../lib";

export async function POST(request: Request) {
	try {
		const payload = await request.json();

		return await checkMatchEligibility(payload);
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
