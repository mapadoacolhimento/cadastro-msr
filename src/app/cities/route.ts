import { type NextRequest } from "next/server";
import * as Yup from "yup";
import { db, logger } from "@/lib";
import { getErrorMessage } from "@/utils";

const stateParamsSchema = Yup.string().required().length(2);

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const state = await stateParamsSchema.validate(searchParams.get("state"));

		const cities = await db.cities.findMany({
			where: {
				state,
			},
			select: {
				city_value: true,
				city_label: true,
			},
		});

		const citiesOptions = cities.map(({ city_label, city_value }) => ({
			value: city_value,
			label: city_label,
		}));

		return Response.json(citiesOptions);
	} catch (e) {
		const error = e as Record<string, unknown>;

		if (error["name"] === "ValidationError") {
			const errorMsg = `Validation error: ${getErrorMessage(error)}`;

			logger.error(`[cities] - 400: ${errorMsg}`);

			return new Response(errorMsg, {
				status: 400,
			});
		}

		const errorMsg = getErrorMessage(error);
		logger.error(`[cities] - 500: ${errorMsg}`);
		return new Response(getErrorMessage(errorMsg), {
			status: 500,
		});
	}
}
