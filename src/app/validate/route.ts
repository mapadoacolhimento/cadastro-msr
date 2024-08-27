import { db } from "@/lib";
import { getErrorMessage } from "@/utils";
import * as Yup from "yup";

const payloadSchema = Yup.object({
	email: Yup.string().email().required(),
	phone: Yup.string().required(),
});

export async function POST(request: Request) {
	try {
		const payload = await request.json();

		await payloadSchema.validate(payload);

		const msrExistsOnDb = await db.mSRPiiSec.findUnique({
			where: {
				email: payload.email,
			},
		});

		return Response.json({ isSupportRequestValid: !!msrExistsOnDb });
	} catch (e) {
		const error = e as Record<string, unknown>;

		if (error["name"] === "ValidationError") {
			const errorMsg = `Validation error: ${getErrorMessage(error)}`;

			return new Response(errorMsg, {
				status: 400,
			});
		}

		const errorMsg = getErrorMessage(error);

		return new Response(errorMsg, {
			status: 500,
		});
	}
}
