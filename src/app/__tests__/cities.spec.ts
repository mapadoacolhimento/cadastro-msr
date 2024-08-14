import { NextRequest } from "next/server";
import { mockReset } from "vitest-mock-extended";
import mockedDb from "../../lib/__mocks__/db";
import { GET } from "../cities/route";
import { Cities } from "@prisma/client";

describe("POST /create", () => {
	beforeEach(() => {
		mockReset(mockedDb);
	});

	it("should return 400 and validation error if param is invalid", async () => {
		const request = new NextRequest(
			new Request(`http://localhost:3000/cities`, {
				method: "GET",
			})
		);
		const response = await GET(request);
		expect(response.status).toStrictEqual(400);
		expect(await response.text()).toStrictEqual(
			"[citites] - Validation error: this is a required field"
		);
	});

	it("should return 500 if something goes wrong", async () => {
		mockedDb.cities.findMany.mockRejectedValueOnce([]);
		const request = new NextRequest(
			new Request(`http://localhost:3000/cities?state=SP`, {
				method: "GET",
			})
		);
		const response = await GET(request);
		expect(response.status).toStrictEqual(500);
		expect(await response.text()).toStrictEqual("[cities]: []");
	});

	it("should return correct cities payload if req is valid", async () => {
		mockedDb.cities.findMany.mockResolvedValueOnce([
			{ city_label: "SÃO PAULO", city_value: "SAO PAULO" },
			{ city_label: "RIO DE JANEIRO", city_value: "RIO DE JANEIRO" },
		] as Cities[]);

		const request = new NextRequest(
			new Request(`http://localhost:3000/cities?state=SP`, {
				method: "GET",
			})
		);
		const response = await GET(request);
		expect(response.status).toStrictEqual(200);
		expect(await response.json()).toStrictEqual([
			{ label: "SÃO PAULO", value: "SAO PAULO" },
			{ label: "RIO DE JANEIRO", value: "RIO DE JANEIRO" },
		]);
	});
});
