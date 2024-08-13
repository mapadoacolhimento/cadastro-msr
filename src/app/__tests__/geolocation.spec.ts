import { NextRequest } from "next/server";
import { GET } from "../geolocation/route";
import { VOLUNTEER_API_URL } from "../../lib";
import createFetchResponse from "../../lib/__mocks__/fetch";

const geolocationResponse = {
	coordinates: {
		lat: 123,
		lng: 456,
	},
	state: "SP",
	city: "SÃO PAULO",
	neighborhood: "VILA OLÍMPIA",
};

describe("/geolocation", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("With zipcode", () => {
		const validParams = `zipcode=12345678`;

		it("should pass validation and return 200 status with a geolocation object response", async () => {
			fetch.mockResolvedValueOnce(createFetchResponse(geolocationResponse));

			const request = new NextRequest(
				new Request(`http://localhost:3000/geolocation?${validParams}`, {
					method: "GET",
				})
			);
			const response = await GET(request);

			expect(fetch).toHaveBeenCalledWith(
				`${VOLUNTEER_API_URL}/address?${validParams}`,
				{
					method: "GET",
				}
			);

			expect(response.ok).toStrictEqual(true);
			expect(response.status).toStrictEqual(200);
			expect(await response.json()).toStrictEqual({
				city: geolocationResponse.city,
				state: geolocationResponse.state,
				neighborhood: geolocationResponse.neighborhood,
				lat: geolocationResponse.coordinates.lat,
				lng: geolocationResponse.coordinates.lng,
			});
		});

		it("should fail validation and return an error message with status 400 when zipcode is invalid", async () => {
			const invalidParams = `zipcode=123`;
			const request = new NextRequest(
				new Request(`http://localhost:3000/geolocation?${invalidParams}`, {
					method: "GET",
				})
			);
			const response = await GET(request);

			expect(fetch).not.toHaveBeenCalled();
			expect(response.ok).toStrictEqual(false);
			expect(response.status).toStrictEqual(400);
			expect(await response.text()).toStrictEqual(
				"[geolocation] - Validation error: this must be exactly 8 characters"
			);
		});

		it("should fail validation and return an error message with status 400 when zipcode is 'not_found'", async () => {
			const invalidParams = `zipcode=not_found`;
			const request = new NextRequest(
				new Request(`http://localhost:3000/geolocation?${invalidParams}`, {
					method: "GET",
				})
			);
			const response = await GET(request);

			expect(fetch).not.toHaveBeenCalled();
			expect(response.ok).toStrictEqual(false);
			expect(response.status).toStrictEqual(400);
			expect(await response.text()).toStrictEqual(
				'[geolocation] - Validation error: zipcode is "not_found"'
			);
		});

		it("should return an error 500 when fetch fails", async () => {
			fetch.mockRejectedValueOnce(createFetchResponse(null, false));

			const request = new NextRequest(
				new Request(`http://localhost:3000/geolocation?${validParams}`, {
					method: "GET",
				})
			);
			const response = await GET(request);

			expect(response.ok).toStrictEqual(false);
			expect(response.status).toStrictEqual(500);
			expect(await response.text()).toStrictEqual(
				`[geolocation]: {"ok":false}`
			);
		});
	});
	describe("With state, city and neighborhood", () => {
		const validParams = `state=${geolocationResponse.state}&city=${geolocationResponse.city}&neighborhood=${geolocationResponse.neighborhood}`;

		it("should pass validation and return 200 status with a geolocation object response", async () => {
			fetch.mockResolvedValueOnce(createFetchResponse(geolocationResponse));

			const request = new NextRequest(
				new Request(`http://localhost:3000/geolocation?${validParams}`, {
					method: "GET",
				})
			);
			const response = await GET(request);

			expect(fetch).toHaveBeenCalledWith(
				`${VOLUNTEER_API_URL}/address?${validParams}`,
				{
					method: "GET",
				}
			);

			expect(response.ok).toStrictEqual(true);
			expect(response.status).toStrictEqual(200);
			expect(await response.json()).toStrictEqual({
				city: geolocationResponse.city,
				state: geolocationResponse.state,
				neighborhood: geolocationResponse.neighborhood,
				lat: geolocationResponse.coordinates.lat,
				lng: geolocationResponse.coordinates.lng,
			});
		});

		it("should fail validation and return an error message with status 400 when any geolocation data is missing", async () => {
			const invalidParams = `city=${geolocationResponse.city}&neighborhood=${geolocationResponse.neighborhood}`;
			const request = new NextRequest(
				new Request(`http://localhost:3000/geolocation?${invalidParams}`, {
					method: "GET",
				})
			);
			const response = await GET(request);

			expect(fetch).not.toHaveBeenCalled();
			expect(response.ok).toStrictEqual(false);
			expect(response.status).toStrictEqual(400);
			expect(await response.text()).toStrictEqual(
				"[geolocation] - Validation error: state is a required field"
			);
		});

		it("should return an error when fetch fails", async () => {
			fetch.mockRejectedValueOnce(createFetchResponse(null, false));

			const request = new NextRequest(
				new Request(`http://localhost:3000/geolocation?${validParams}`, {
					method: "GET",
				})
			);
			const response = await GET(request);

			expect(response.ok).toStrictEqual(false);
			expect(response.status).toStrictEqual(500);
			expect(await response.text()).toStrictEqual(
				`[geolocation]: {"ok":false}`
			);
		});
	});
});
