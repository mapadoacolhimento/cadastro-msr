import { type NextRequest } from "next/server";
import * as Yup from "yup";
import { getErrorMessage, VOLUNTEER_API_URL } from "../../lib";

const zipcodeParamSchema = Yup.string().required().length(8);
const geolocationParamSchema = Yup.object({
	state: Yup.string().required().length(2),
	city: Yup.string().required(),
	neighborhood: Yup.string().required(),
}).required();

type GeolocationResponseData = {
	coordinates: {
		lat: number | null;
		lng: number | null;
	};
	state: string | null;
	city: string | null;
	neighborhood: string | null;
};

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const zipcode = searchParams.get("zipcode");
		let queryParams;

		if (zipcode) {
			await zipcodeParamSchema.validate(zipcode);
			queryParams = `zipcode=${zipcode}`;
		} else {
			const geolocation = await geolocationParamSchema.validate({
				state: searchParams.get("state"),
				city: searchParams.get("city"),
				neighborhood: searchParams.get("neighborhood"),
			});

			queryParams = `state=${geolocation.state}&city=${geolocation.city}&neighborhood=${geolocation.neighborhood}`;
		}

		const response = await fetch(
			`${VOLUNTEER_API_URL}/address?${queryParams}`,
			{
				method: "GET",
			}
		);

		if (!response.ok) {
			throw new Error(response.statusText);
		}

		const {
			coordinates: { lat, lng },
			...rest
		} = (await response.json()) as GeolocationResponseData;

		return Response.json({ lat, lng, ...rest });
	} catch (e) {
		const error = e as Record<string, unknown>;

		if (error["name"] === "ValidationError") {
			const errorMsg = `[geolocation] - Validation error: ${getErrorMessage(error)}`;

			return new Response(errorMsg, {
				status: 400,
			});
		}

		const errorMsg = getErrorMessage(error);

		return new Response(`[geolocation]: ${errorMsg}`, {
			status: 500,
		});
	}
}
