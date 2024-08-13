import { NextRequest } from "next/server";
import { mockReset } from "vitest-mock-extended";
import mockedDb from "../../lib/__mocks__/db";
import msrPayload from "../../lib/__mocks__/payloads";
import { POST } from "../handle-request/route";

global.fetch = vi.fn();

function createFetchResponse(data: any) {
	return new Promise((resolve) => resolve(data));
}
const mockPayload = msrPayload();
const mockResCheckEligibility = {
	supportRequestId: null,
	ticketId: null,
	shouldCreateMatch: true,
};

describe("POST handle-request", () => {
	beforeEach(() => {
		mockReset(mockedDb);
	});
	it("should return a error when payload is not valid", async () => {
		const request = new NextRequest(
			new Request("http://localhost:3000/db/handle-request", {
				method: "POST",
				body: JSON.stringify({}),
			})
		);
		const response = await POST(request);
		expect(response.status).toEqual(400);
		expect(await response.text()).toEqual(
			"Validation error: supportTypes is a required field"
		);
	});

	it("should call check-eligibility", async () => {
		fetch.mockResolvedValueOnce(createFetchResponse(mockResCheckEligibility));
		const request = new NextRequest(
			new Request("http://localhost:3000/db/handle-request", {
				method: "POST",
				body: JSON.stringify(mockPayload),
			})
		);
		const response = await POST(request);
		expect(response.status).toEqual(500);
		expect(await response.text()).toEqual(
			"{Validation error: supportTypes is a required field}"
		);
	});
});
