import { checkMatchEligibility, logger } from "@/lib";
import { getErrorMessage } from "@/utils";

export async function POST(request: Request) {
	try {
		const payload = await request.json();

		const data = await checkMatchEligibility(payload);

		return Response.json(data);
	} catch (e) {
		const error = e as Record<string, unknown>;
		if (error["name"] === "ValidationError") {
			const errorMsg = `Validation error: ${getErrorMessage(error)}`;
			logger.error(`[checkMatchEligibility] - 400: ${errorMsg}`);

			return new Response(errorMsg, {
				status: 400,
			});
		}

		logger.error(`[checkMatchEligibility] - 500: ${getErrorMessage(error)}`);
		return new Response(getErrorMessage(error), {
			status: 500,
		});
	}
}
