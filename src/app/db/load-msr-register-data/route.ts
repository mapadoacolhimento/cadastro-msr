import { NextRequest } from "next/server";
import * as Yup from "yup";
import { logger, mongodb } from "@/lib";
import { getErrorMessage } from "@/utils";

const paramSchema = Yup.string().email().nonNullable().required();

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const email = searchParams.get("email");
		let values = null;

		await paramSchema.validate(email);

		if (email) {
			const msrRegisterData = await mongodb.msrRegisterData.findFirst({
				where: {
					email: email,
				},
			});
			if (msrRegisterData) {
				const { id, createdAt, updatedAt, ...data } = msrRegisterData;
				values = data;
			}
		}

		return Response.json({ values });
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
