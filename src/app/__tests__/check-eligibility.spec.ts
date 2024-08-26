import { NextRequest } from "next/server";
import { mockReset } from "vitest-mock-extended";
import mockedDb from "../../lib/__mocks__/db";
import { POST } from "../check-eligibility/route";

describe("POST /check-eligibility", () => {
	beforeEach(() => {
		mockReset(mockedDb);
	});

	const msr = {
		email: "lua@email.com",
		supportType: "psychological",
	};

	const msr2 = {
		email: "sol@email.com",
		supportType: "psychological",
	};

	const msr3 = {
		email: "venus@email.com",
		supportType: "legal",
	};

	const mockMsrPiiSec = {
		msrId: 12345566 as unknown as bigint,
		email: "lua@email.com",
	};

	const mockMsrPiiSec2 = {
		msrId: 12344455 as unknown as bigint,
		email: "sol@email.com",
	};

	const mockMsrPiiSec3 = {
		msrId: 12347788 as unknown as bigint,
		email: "venus@email.com",
	};

	const mockSupportRequest = [
		{
			supportRequestId: 222,
			status: "social_worker",
			supportType: "psychological",
			zendeskTicketId: 5678,
		},

		{
			supportRequestId: 223,
			status: "matched",
			supportType: "legal",
			zendeskTicketId: 9012,
		},
	];

	const mockMatch = {
		supportRequestId: 224,
		status: "waiting_contact",
		supportType: "legal",
		msrZendeskTicketId: 1234,
	};

	it("should return `psychological: {shouldCreateMatch: false, supportRequestId: 222}` when msr and support request exists", async () => {
		mockedDb.mSRPiiSec.findUnique.mockResolvedValueOnce(mockMsrPiiSec);
		mockedDb.matches.findFirst.mockResolvedValue(null);
		mockedDb.supportRequests.findFirst.mockResolvedValue(mockSupportRequest[0]);

		const request = new NextRequest(
			new Request("http://localhost:3000/check-eligibility", {
				method: "POST",
				body: JSON.stringify(msr),
			})
		);
		const response = await POST(request);
		expect(response.status).toStrictEqual(200);
		expect(await response.json()).toStrictEqual({
			supportRequestId: 222,
			zendeskTicketId: 5678,
			shouldCreateMatch: false,
		});
		expect(mockedDb.supportRequests.findFirst).toHaveBeenCalledWith({
			select: {
				supportRequestId: true,
				status: true,
				supportType: true,
				zendeskTicketId: true,
			},
			orderBy: {
				createdAt: "asc",
			},
			where: {
				msrId: mockMsrPiiSec.msrId,
				supportType: msr.supportType,
				status: { not: "duplicated" },
			},
		});
	});

	it("should return `psychological: {shouldCreateMatch: false, legal: {shouldCreateMatch: true, supportRequestId: 223}` when msr exists and has one match", async () => {
		mockedDb.mSRPiiSec.findUnique.mockResolvedValueOnce(mockMsrPiiSec2);

		mockedDb.supportRequests.findFirst.mockResolvedValue(mockSupportRequest[1]);

		const request = new NextRequest(
			new Request("http://localhost:3000/check-eligibility", {
				method: "POST",
				body: JSON.stringify(msr2),
			})
		);
		const response = await POST(request);
		expect(response.status).toStrictEqual(200);
		expect(await response.json()).toStrictEqual({
			supportRequestId: 223,
			zendeskTicketId: 9012,
			shouldCreateMatch: true,
		});
		expect(mockedDb.supportRequests.findFirst).toHaveBeenCalledWith({
			select: {
				supportRequestId: true,
				status: true,
				supportType: true,
				zendeskTicketId: true,
			},
			orderBy: { createdAt: "asc" },
			where: {
				msrId: mockMsrPiiSec2.msrId,
				supportType: msr2.supportType,
				status: { not: "duplicated" },
			},
		});
	});

	it("should return `legal: {shouldCreateMatch: false, supportRequestId: 224}` when msr exists and has one match", async () => {
		mockedDb.mSRPiiSec.findUnique.mockResolvedValueOnce(mockMsrPiiSec3);

		mockedDb.matches.findFirst.mockResolvedValue(mockMatch);

		const request = new NextRequest(
			new Request("http://localhost:3000/check-eligibility", {
				method: "POST",
				body: JSON.stringify(msr3),
			})
		);
		const response = await POST(request);
		expect(response.status).toStrictEqual(200);
		expect(await response.json()).toStrictEqual({
			supportRequestId: 224,
			zendeskTicketId: 1234,
			shouldCreateMatch: false,
		});
	});

	it("should return `psychological: {supportRequestId: null,  shouldCreateMatch: true}` when msr does not exist", async () => {
		const request = new NextRequest(
			new Request("http://localhost:3000/check-eligibility", {
				method: "POST",
				body: JSON.stringify(msr),
			})
		);
		const response = await POST(request);
		expect(response.status).toStrictEqual(200);
		expect(await response.json()).toStrictEqual({
			supportRequestId: null,
			zendeskTicketId: null,
			shouldCreateMatch: true,
		});
	});

	it("should return `psychological: {supportRequestId: null,  shouldCreateMatch: true}` when msr exists but she has no matches and no support_requests", async () => {
		mockedDb.mSRPiiSec.findUnique.mockResolvedValueOnce(mockMsrPiiSec);

		mockedDb.matches.findFirst.mockResolvedValue(null);
		mockedDb.supportRequests.findFirst.mockResolvedValue(null);

		const request = new NextRequest(
			new Request("http://localhost:3000/check-eligibility", {
				method: "POST",
				body: JSON.stringify(msr),
			})
		);
		const response = await POST(request);
		expect(response.status).toStrictEqual(200);
		expect(await response.json()).toStrictEqual({
			supportRequestId: null,
			zendeskTicketId: null,
			shouldCreateMatch: true,
		});
	});

	it("should return an error when theres not a valid payload", async () => {
		const request = new NextRequest(
			new Request("http://localhost:3000/check-eligibility", {
				method: "POST",
				body: JSON.stringify({}),
			})
		);
		const response = await POST(request);
		expect(response.status).toStrictEqual(400);
		expect(await response.text()).toStrictEqual(
			"Validation error: supportType is a required field"
		);
	});
});
