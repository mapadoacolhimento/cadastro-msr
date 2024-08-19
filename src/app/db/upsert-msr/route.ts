import { NextRequest } from "next/server";
import { getErrorMessage, upsertMsr } from "../../../lib";

export async function POST(request: NextRequest) {
	try {
		const payload = await request.json();

		return await upsertMsr(payload);
	} catch (e) {
		const error = e as Record<string, unknown>;
		if (error["name"] === "ValidationError") {
			const errorMsg = `Validation error: ${getErrorMessage(error)}`;

			return new Response(errorMsg, {
				status: 400,
			});
		}
		if (
			error instanceof Error &&
			"code" in error &&
			(error as any).code === "P2002"
		) {
			return new Response(error.message, {
				status: 400,
			});
		}
		return new Response(getErrorMessage(error), {
			status: 500,
		});
	}
}
