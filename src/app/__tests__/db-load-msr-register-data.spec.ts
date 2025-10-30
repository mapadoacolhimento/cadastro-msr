import { expect } from "vitest";
import { NextRequest } from "next/server";
import { mockReset } from "vitest-mock-extended";
import mockedMongodb from "@/tests/unit/mongodb";
import { GET } from "../db/load-msr-register-data/route";

const mockMsrData = {
	id: "6703e81abb2c10af44a38338",
	gender: "cis_woman",
	dateOfBirth: new Date("1990-10-10").toISOString(),
	genderViolence: "yes",
	violenceOccurredInBrazil: "yes",
	externalSupport: ["no"],
	financialNeed: "yes",
	supportType: ["legal"],
	email: "msr@email.br",
	confirmEmail: "msr@email.br",
	firstName: "Msr",
	phone: "71999999999",
	color: "white",
	hasDisability: "no",
	acceptsOnlineSupport: "yes",
	terms: "yes",
	zipcode: "41950-150",
	neighborhood: "Rio Vermelho",
	city: "SALVADOR",
	state: "BA",
	lat: "-12.971",
	lng: "-38.511",
	createdAt: "2024-10-09T19:15:37.473Z",
	updatedAt: "2024-10-09T19:16:59.312Z",
};

const mockValues = {
	gender: "cis_woman",
	dateOfBirth: new Date("1990-10-10").toISOString(),
	genderViolence: "yes",
	violenceOccurredInBrazil: "yes",
	externalSupport: ["no"],
	financialNeed: "yes",
	supportType: ["legal"],
	email: "msr@email.br",
	confirmEmail: "msr@email.br",
	firstName: "Msr",
	phone: "71999999999",
	color: "white",
	hasDisability: "no",
	acceptsOnlineSupport: "yes",
	terms: "yes",
	zipcode: "41950-150",
	neighborhood: "Rio Vermelho",
	city: "SALVADOR",
	state: "BA",
	lat: "-12.971",
	lng: "-38.511",
};

describe("GET /load-msr-register-data", () => {
	beforeEach(() => {
		mockReset(mockedMongodb);
	});

	it("should return found msrRegisterFormData", async () => {
		mockedMongodb.msrRegisterData.findFirst.mockResolvedValueOnce(mockMsrData);
		const request = new NextRequest(
			new Request(
				"http://localhost:3000/db/load-msr-register-data/?email=msr@email.br",
				{
					method: "GET",
				}
			)
		);
		const response = await GET(request);
		expect(mockedMongodb.msrRegisterData.findFirst).toHaveBeenCalledWith({
			where: {
				email: "msr@email.br",
			},
		});
		expect(response.status).toEqual(200);
		expect(await response.json()).toStrictEqual({
			values: mockValues,
		});
	});

	it("should reurturn null when not found data", async () => {
		mockedMongodb.msrRegisterData.findFirst.mockResolvedValueOnce(null);
		const request = new NextRequest(
			new Request(
				"http://localhost:3000/db/load-msr-register-data/?email=msr@email.br",
				{
					method: "GET",
				}
			)
		);
		const response = await GET(request);
		expect(mockedMongodb.msrRegisterData.findFirst).toHaveBeenCalledWith({
			where: {
				email: "msr@email.br",
			},
		});
		expect(response.status).toEqual(200);
		expect(await response.json()).toStrictEqual({
			values: null,
		});
	});

	it("should return an error when the is not a valid email", async () => {
		const request = new NextRequest(
			new Request(
				"http://localhost:3000/db/load-msr-register-data/?email=msr",
				{
					method: "GET",
				}
			)
		);
		const response = await GET(request);
		expect(response.status).toEqual(400);
		expect(await response.text()).toEqual(
			"Validation error: this must be a valid email"
		);
	});

	it("should return an error when the query fail", async () => {
		mockedMongodb.msrRegisterData.findFirst.mockRejectedValue({
			code: "P1001",
			message: "Can’t reach database server at `localhost`:`27017`",
		});
		const request = new NextRequest(
			new Request(
				"http://localhost:3000/db/load-msr-register-data/?email=msr@email.br",
				{
					method: "GET",
				}
			)
		);
		const response = await GET(request);
		expect(mockedMongodb.msrRegisterData.findFirst).toHaveBeenCalledWith({
			where: {
				email: "msr@email.br",
			},
		});
		expect(response.status).toEqual(500);
		expect(await response.text()).toEqual(
			"Can’t reach database server at `localhost`:`27017`"
		);
	});
});
