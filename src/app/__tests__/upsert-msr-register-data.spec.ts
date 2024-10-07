import { expect } from "vitest";
import { NextRequest } from "next/server";
import { mockReset } from "vitest-mock-extended";
//import { type Gender, type MSRStatus, type Race } from "@prisma/client";
import mockedMongodb from "@/tests/unit/mongodb";
import { POST } from "../upsert-msr-register-data/route";

const mockMsrIncompleteData = {
	gender: "cis_woman",
	dateOfBirth: new Date("1990-10-10").toISOString(),
	genderViolence: true,
	violenceLocation: true,
	externalSupport: false,
	financialNeed: true,
	SupportType: ["legal"],
	email: "msr@email.br",
	confirmEmail: "msr@email.br",
	firstName: "Msr",
	phone: "71999999999",
};

const mockIncompleteMSRRegisterData = {
	id: "6703e81abb2c10af44a38338",
	...mockMsrIncompleteData,
};

const mockMsrData = {
	...mockMsrIncompleteData,
	color: "white",
	hasDisability: false,
	acceptsOnlineSupport: true,
	terms: true,
	zipcode: "41950-150",
	neighborhood: "Rio Vermelho",
	city: "SALVADOR",
	state: "BA",
	lat: "-12.971",
	lng: "-38.511",
};

const mockMSRRegisterData = {
	id: "6703e81abb2c10af44a38338",
	...mockMsrData,
};

describe("POST /upsert-msr-register-data", () => {
	beforeEach(() => {
		mockReset(mockedMongodb);
	});

	it("should create new msrRegisterFormData", async () => {
		mockedMongodb.msrRegisterData.upsert.mockResolvedValueOnce(
			mockIncompleteMSRRegisterData
		);
		const request = new NextRequest(
			new Request("http://localhost:3000/upsert-msr-register-data", {
				method: "POST",
				body: JSON.stringify(mockMsrIncompleteData),
			})
		);
		const response = await POST(request);
		expect(mockedMongodb.msrRegisterData.upsert).toHaveBeenCalledTimes(1);
		expect(response.status).toEqual(200);
		expect(await response.json()).toStrictEqual({
			id: mockIncompleteMSRRegisterData.id,
		});
	});

	it("should update  new msrRegisterFormData", async () => {
		mockedMongodb.msrRegisterData.upsert.mockResolvedValueOnce(
			mockMSRRegisterData
		);
		const request = new NextRequest(
			new Request("http://localhost:3000/upsert-msr-register-data", {
				method: "POST",
				body: JSON.stringify(mockMsrData),
			})
		);
		const response = await POST(request);
		expect(mockedMongodb.msrRegisterData.upsert).toHaveBeenCalledTimes(1);
		expect(response.status).toEqual(200);
		expect(await response.json()).toStrictEqual({
			id: mockMSRRegisterData.id,
		});
	});

	it("returns error when dont have a valid payload", async () => {
		const request = new NextRequest(
			new Request("http://localhost:3000/upsert-msr-register-data", {
				method: "POST",
				body: JSON.stringify({}),
			})
		);
		const response = await POST(request);
		expect(response.status).toEqual(400);
		expect(await response.text()).toEqual(
			"Validation error: email is a required field"
		);
	});
});
