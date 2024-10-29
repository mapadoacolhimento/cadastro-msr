import { type NextRequest } from "next/server";
import * as Yup from "yup";
import { getErrorMessage } from "@/utils";
import { db, logger } from "@/lib";

const flagParamsSchema = Yup.string().required();

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const flag = await flagParamsSchema.validate(searchParams.get("flag"));

		const isEnabled = await db.featureFlag.findUnique({
			where: {
				featureName: flag,
			},
			select: {
				featureEnabled: true,
			},
		});

		return Response.json({
			isFeatureFlagEnabled: isEnabled ? isEnabled.featureEnabled : false,
		});
	} catch (e) {
		const error = e as Record<string, unknown>;

		if (error["name"] === "ValidationError") {
			const errorMsg = `Validation error: ${getErrorMessage(error)}`;

			logger.error(`[feature-flag] - 400: ${errorMsg}`);

			return new Response(errorMsg, {
				status: 400,
			});
		}

		const errorMsg = getErrorMessage(error);
		logger.error(`[feature-flag] - 500: ${errorMsg}`);
		return new Response(getErrorMessage(errorMsg), {
			status: 500,
		});
	}
}
