import { expect } from "vitest";
import { NextRequest } from "next/server";
import { mockReset } from "vitest-mock-extended";
import {
	type Gender,
	type MSRStatus,
	type Race,
	type EmploymentStatus,
} from "@prisma/client";
import mockedDb from "@/tests/unit/db";
import { msrPayload } from "@/tests/unit/payloads";
import { POST } from "../db/upsert-msr/route";
import { employmentStatusOptions } from "@/lib";

const mockPayload = msrPayload();

const mockPayload2 = msrPayload({
	gender: "cis_woman",
	hasDisability: false,
});

const mockIncompletePayload = {
	email: "msr@email.br",
	phone: "71999999999",
	firstName: "Msr",
	city: "SALVADOR",
	state: "BA",
	neighborhood: "Bairro",
	zipcode: "00000000",
	dateOfBirth: new Date("1990-10-10").toISOString(),
	color: "black",
	gender: "cis_woman",
	status: "registered",
	hasDisability: null,
	acceptsOnlineSupport: false,
	employmentStatus: "employed_clt" as EmploymentStatus,
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
	employmentStatus: mockPayload2.employmentStatus,
	createdAt: new Date(),
	updatedAt: new Date(),
};

describe("POST /db/upsert-msr", () => {
	beforeEach(() => {
		mockReset(mockedDb);
	});

	it("should create new msr with basics fields on db", async () => {
		mockedDb.mSRs.upsert.mockResolvedValueOnce(mockMsr);
		const request = new NextRequest(
			new Request("http://localhost:3000/db/upsert-msr", {
				method: "POST",
				body: JSON.stringify(mockPayload),
			})
		);
		const response = await POST(request);
		expect(mockedDb.mSRs.upsert).toHaveBeenCalledTimes(1);
		expect(response.status).toEqual(200);
		expect(await response.json()).toStrictEqual({
			msrId: mockPayload.msrZendeskUserId,
		});
	});

	it("should create new msr with all fields on db", async () => {
		mockedDb.mSRs.upsert.mockResolvedValueOnce(mockMsr2);
		const request = new NextRequest(
			new Request("http://localhost:3000/db/upsert-msr", {
				method: "POST",
				body: JSON.stringify(mockPayload2),
			})
		);
		const response = await POST(request);
		expect(mockedDb.mSRs.upsert).toHaveBeenCalledTimes(1);
		expect(response.status).toEqual(200);
		expect(await response.json()).toStrictEqual({
			msrId: mockPayload2.msrZendeskUserId,
		});
	});

	it("returns error when dont have a valid payload", async () => {
		const request = new NextRequest(
			new Request("http://localhost:3000/db/upsert-msr", {
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
