import { NextRequest } from "next/server";
import { upsertMsrOnDb } from "@/lib";
import { stringifyBigInt, getErrorMessage } from "@/utils";

export async function POST(request: NextRequest) {
	try {
		const payload = await request.json();
		const data = await upsertMsrOnDb(payload);

		return Response.json(stringifyBigInt(data));
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
