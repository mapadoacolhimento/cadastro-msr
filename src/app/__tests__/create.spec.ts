import { NextRequest } from "next/server";
import { mockReset } from "vitest-mock-extended";
import { type Gender, type MSRStatus, type Race } from "@prisma/client";
import mockedDb from "../../lib/__mocks__/db";
import msrPayload from "../../lib/__mocks__/payloads";
import { POST } from "../create/route";

const mockPayload = msrPayload();

const mockPayload2 = msrPayload({
	gender: "cis_woman",
	status: "registered",
	dateOfBirth: "1990-03-14",
	hasDisability: false,
	acceptsOnlineSupport: true,
});

const mockIncompletePayload = {
	email: "msr@email.br",
	phone: "71999999999",
	firstName: "Msr",
	city: "SALVADOR",
	state: "BA",
	neighborhood: "Bairro",
	zipcode: "00000000",
	dateOfBirth: "1990-10-10",
	color: "black",
	gender: "cis_woman",
	status: "registered",
	hasDisability: null,
	acceptsOnlineSupport: false,
};

const mockMsr = {
	msrId: mockPayload.msrZendeskUserId,
	city: mockPayload.city,
	state: mockPayload.state,
	neighborhood: mockPayload.neighborhood,
	zipcode: "00000000",
	dateOfBirth: null,
	raceColor: mockPayload.color as Race,
	gender: "cis_woman" as Gender,
	status: mockPayload.status as MSRStatus,
	hasDisability: false,
	acceptsOnlineSupport: true,
	createdAt: new Date(),
	updatedAt: new Date(),
};

const mockMsrPii = {
	msrId: mockPayload.msrZendeskUserId,
	firstName: mockPayload.firstName,
	email: mockPayload.email,
	phone: mockPayload.phone,
	dateOfBirth: null,
	createdAt: new Date(),
	updatedAt: new Date(),
};

const mockMsr2 = {
	msrId: mockPayload2.msrZendeskUserId,
	city: mockPayload2.city,
	state: mockPayload2.state,
	neighborhood: mockPayload2.neighborhood,
	zipcode: mockPayload2.zipcode,
	raceColor: mockPayload2.color as Race,
	gender: mockPayload2.gender as Gender,
	status: mockPayload2.status as MSRStatus,
	hasDisability: mockPayload2.hasDisability,
	acceptsOnlineSupport: mockPayload2.acceptsOnlineSupport,
	createdAt: new Date(),
	updatedAt: new Date(),
};

const mockMsrPii2 = {
	msrId: mockPayload2.msrZendeskUserId,
	firstName: mockPayload2.firstName,
	email: mockPayload2.email,
	phone: mockPayload2.phone,
	dateOfBirth: new Date("1990-03-14"),
	createdAt: new Date(),
	updatedAt: new Date(),
};

describe("POST /create", () => {
	beforeEach(() => {
		mockReset(mockedDb);
	});

	it("should create new msr with basics fields on db", async () => {
		mockedDb.mSRs.upsert.mockResolvedValueOnce(mockMsr);
		mockedDb.mSRPiiSec.upsert.mockResolvedValueOnce(mockMsrPii);
		const request = new NextRequest(
			new Request("http://localhost:3000/create", {
				method: "POST",
				body: JSON.stringify(mockPayload),
			})
		);
		const response = await POST(request);
		expect(mockedDb.mSRs.upsert).toHaveBeenCalledTimes(1);
		expect(mockedDb.mSRPiiSec.upsert).toHaveBeenCalledTimes(1);
		expect(response.status).toEqual(200);
		expect(await response.json()).toStrictEqual({
			msrId: mockPayload.msrZendeskUserId.toString(),
		});
	});

	it("should create new msr with all fields on db", async () => {
		mockedDb.mSRs.upsert.mockResolvedValueOnce(mockMsr2);
		mockedDb.mSRPiiSec.upsert.mockResolvedValueOnce(mockMsrPii2);
		const request = new NextRequest(
			new Request("http://localhost:3000/create", {
				method: "POST",
				body: JSON.stringify(mockPayload2),
			})
		);
		const response = await POST(request);
		expect(mockedDb.mSRs.upsert).toHaveBeenCalledTimes(1);
		expect(mockedDb.mSRPiiSec.upsert).toHaveBeenCalledTimes(1);
		expect(response.status).toEqual(200);
		expect(await response.json()).toStrictEqual({
			msrId: mockPayload2.msrZendeskUserId.toString(),
		});
	});

	it("returns error when dont have a valid payload", async () => {
		const request = new NextRequest(
			new Request("http://localhost:3000/create", {
				method: "POST",
				body: JSON.stringify(mockIncompletePayload),
			})
		);
		const response = await POST(request);
		expect(response.status).toEqual(400);
		expect(await response.text()).toEqual(
			"Validation error: msrZendeskUserId is a required field"
		);
	});
});
