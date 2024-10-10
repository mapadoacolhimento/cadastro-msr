import { NextRequest } from "next/server";
import { logger, mongodb } from "@/lib";
import { getErrorMessage } from "@/utils";

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const email = searchParams.get("email");

		if (!email) {
			return Response.json({ values: null });
		}

		const msrRegisterData = await mongodb.msrRegisterData.findFirst({
			where: {
				email: email,
			},
		});

		return Response.json({ values: msrRegisterData });
	} catch (e) {
		const error = e as Record<string, unknown>;
		if (error["name"] === "ValidationError") {
			const errorMsg = `Validation error: ${getErrorMessage(error)}`;
			logger.error(`[loadMsrRegisterData] - 400: ${errorMsg}`);
			return new Response(errorMsg, {
				status: 400,
			});
		}

		logger.error(`[loadMsrRegisterData] - 500: ${getErrorMessage(error)}`);
		return new Response(getErrorMessage(error), {
			status: 500,
		});
	}
}
