import { NextRequest } from "next/server";
import { mockReset } from "vitest-mock-extended";
import mockedDb from "../../lib/__mocks__/db";
import msrPayload from "../../lib/__mocks__/payloads";
import createFetchResponse from "../../lib/__mocks__/fetch";
import { POST } from "../handle-request/route";
import { BASE_URL, MATCH_LAMBDA_URL, emailDuplicated } from "../../lib";

const mockPayloadLegal = msrPayload({ supportType: ["legal"] });
const mockPayloadPsychlogical = msrPayload({ supportType: ["psychological"] });
const mockPayloadBoth = msrPayload({ supportType: ["legal", "psychological"] });

const mockResZendeskUser = {
	msrZendeskUserId: 12346789 as unknown as bigint,
};

const mockResMsr = {
	data: {
		msrId: 12346789 as unknown as bigint,
		status: "inscrita",
	},
};

const mockSupportRequestsLegal = {
	supportRequestId: 1234,
};

const mockSupportRequestsPsychological = {
	supportRequestId: 7890,
};

const mockSupportRequestStatusHistory = {
	supportRequestStatusHistoryId: 2,
};

const bodyCheckEligibilityLegal = {
	email: mockPayloadLegal.email,
	supportType: "legal",
};

const bodyCheckEligibilityPsychological = {
	email: mockPayloadPsychlogical.email,
	supportType: "psychological",
};

const mockResCheckEligibility = {
	supportRequestId: null,
	ticketId: null,
	shouldCreateMatch: true,
};

const mockResTicketLegal = {
	ticketId: 1234,
};

const mockResTicketPsychological = {
	ticketId: 7890,
};

const mockResCheckEligibilityLegal = {
	supportRequestId: 1234,
	ticketId: 1234,
	shouldCreateMatch: true,
};

const mockResCheckEligibilityPsychological = {
	supportRequestId: 5678,
	ticketId: 7890,
	shouldCreateMatch: false,
};

const mockResLambdaLegal = {
	matchId: 3456,
	supportRequestId: mockSupportRequestsLegal.supportRequestId,
	msrId: 12346789 as unknown as bigint,
	volunteerId: 1,
	msrZendeskTicketId: mockResTicketLegal.ticketId,
	volunteerZendeskTicketId: 4567,
	supportType: "legal",
	createdAt: "2024-08-13",
	updatedAt: "2024-08-13",
	status: "matched",
};

const mockResLambdaPsychological = {
	...mockResLambdaLegal,
	supportType: "psychological",
	supportRequestId: mockSupportRequestsPsychological.supportRequestId,
	msrZendeskTicketId: mockResTicketLegal.ticketId,
	matchId: 3457,
	volunteerZendeskTicketId: 4568,
};

const bodyComposeLegal = {
	supportRequestId: null,
	msrId: mockPayloadLegal.msrZendeskUserId,
	zendeskTicketId: mockResTicketLegal.ticketId,
	supportType: "legal",
	status: "open",
	hasDisability: mockPayloadLegal.hasDisability,
	lat: mockPayloadLegal.lat,
	lng: mockPayloadLegal.lng,
	city: mockPayloadLegal.city,
	state: mockPayloadLegal.state,
};

const bodyHandleMatchLegal = {
	supportRequest: {
		...bodyComposeLegal,
		supportRequestId: mockResCheckEligibilityLegal.supportRequestId,
		zendeskTicketId: mockResTicketLegal.ticketId,
	},
};
const bodyComposePsychological = {
	...bodyComposeLegal,
	supportType: "psychological",
	zendeskTicketId: mockResTicketPsychological.ticketId,
};
const bodyHandleMatchPsychological = {
	supportRequest: {
		...bodyComposeLegal,
		supportRequestId: mockResCheckEligibilityPsychological.supportRequestId,
		zendeskTicketId: mockResTicketPsychological.ticketId,
	},
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
			"Validation error: supportType is a required field"
		);
	});

	it("should create match for support request legal", async () => {
		fetch.mockResolvedValueOnce(createFetchResponse(mockResCheckEligibility));
		fetch.mockResolvedValueOnce(createFetchResponse(mockResZendeskUser));
		fetch.mockResolvedValueOnce(createFetchResponse(mockResMsr));
		fetch.mockResolvedValueOnce(createFetchResponse(mockResTicketLegal));
		fetch.mockResolvedValueOnce(createFetchResponse(mockResLambdaLegal));

		const request = new NextRequest(
			new Request("http://localhost:3000/db/handle-request", {
				method: "POST",
				body: JSON.stringify(mockPayloadLegal),
			})
		);
		const response = await POST(request);

		expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/check-eligibility`, {
			body: JSON.stringify({
				email: mockPayloadLegal.email,
				supportType: mockPayloadLegal.supportType[0],
			}),
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});
		expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/zendesk/user`, {
			body: JSON.stringify({
				...mockPayloadLegal,
			}),
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});

		expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/db/upsert-msr`, {
			body: JSON.stringify({
				...mockPayloadLegal,
			}),
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});
		expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/zendesk/ticket`, {
			body: JSON.stringify({
				ticketId: null,
				msrZendeskUserId: mockPayloadLegal.msrZendeskUserId,
				status: "new",
				subject: "[Jurídico] Msr, SALVADOR - BA",
				statusAcolhimento: "solicitação_recebida",
				supportType: "legal",
				comment: {
					body: `${mockPayloadLegal.firstName} solicitou acolhimento pelo cadastro`,
					public: false,
				},
			}),
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});
		expect(fetch).toHaveBeenCalledWith(`${MATCH_LAMBDA_URL}/compose`, {
			body: JSON.stringify([bodyComposeLegal]),
			method: "POST",
			headers: {
				Authorization: undefined,
			},
		});
		expect(response.status).toEqual(200);
		expect(await response.json()).toEqual({ legal: "matched" });
	});

	it("should just update ticket and psychological support request as duplicated", async () => {
		mockedDb.supportRequests.findFirst.mockResolvedValue(
			mockSupportRequestsPsychological
		);
		mockedDb.supportRequestStatusHistory.findFirst.mockResolvedValue(
			mockSupportRequestStatusHistory
		);
		fetch.mockResolvedValueOnce(
			createFetchResponse(mockResCheckEligibilityPsychological)
		);
		fetch.mockResolvedValueOnce(
			createFetchResponse(mockResTicketPsychological)
		);

		const request = new NextRequest(
			new Request("http://localhost:3000/db/handle-request", {
				method: "POST",
				body: JSON.stringify(mockPayloadPsychlogical),
			})
		);
		const response = await POST(request);
		expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/check-eligibility`, {
			body: JSON.stringify(bodyCheckEligibilityPsychological),
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});
		expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/zendesk/ticket`, {
			body: JSON.stringify({
				ticketId: mockResTicketPsychological.ticketId,
				status: "open",
				statusAcolhimento: "solicitação_repetida",
				supportType: "psychological",
				comment: {
					body: emailDuplicated(mockPayloadPsychlogical.firstName),
					public: true,
				},
			}),
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});
		expect(mockedDb.supportRequests.update).toHaveBeenCalledWith({
			where: {
				supportRequestId: mockResCheckEligibilityPsychological.supportRequestId,
			},
			data: {
				status: "duplicated",
			},
		});

		expect(mockedDb.supportRequestStatusHistory.create).toHaveBeenCalledWith({
			data: {
				supportRequestId: mockResCheckEligibilityPsychological.supportRequestId,
				status: "duplicated",
			},
		});
		expect(response.status).toEqual(200);
		expect(await response.json()).toEqual({ psychological: "duplicated" });
	});

	it("should create matches for support requests legal and psychological", async () => {
		fetch.mockResolvedValueOnce(createFetchResponse(mockResCheckEligibility));
		fetch.mockResolvedValueOnce(createFetchResponse(mockResZendeskUser));
		fetch.mockResolvedValueOnce(createFetchResponse(mockResMsr));
		fetch.mockResolvedValueOnce(createFetchResponse(mockResTicketLegal));
		fetch.mockResolvedValueOnce(createFetchResponse(mockResLambdaLegal));

		fetch.mockResolvedValueOnce(createFetchResponse(mockResCheckEligibility));
		fetch.mockResolvedValueOnce(createFetchResponse(mockResZendeskUser));
		fetch.mockResolvedValueOnce(createFetchResponse(mockResMsr));
		fetch.mockResolvedValueOnce(
			createFetchResponse(mockResTicketPsychological)
		);
		fetch.mockResolvedValueOnce(
			createFetchResponse(mockResLambdaPsychological)
		);

		const request = new NextRequest(
			new Request("http://localhost:3000/db/handle-request", {
				method: "POST",
				body: JSON.stringify(mockPayloadBoth),
			})
		);
		const response = await POST(request);

		expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/check-eligibility`, {
			body: JSON.stringify(bodyCheckEligibilityLegal),
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});
		expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/zendesk/user`, {
			body: JSON.stringify({
				...mockPayloadBoth,
			}),
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});

		expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/db/upsert-msr`, {
			body: JSON.stringify({
				...mockPayloadBoth,
			}),
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});
		expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/zendesk/ticket`, {
			body: JSON.stringify({
				ticketId: null,
				msrZendeskUserId: mockPayloadBoth.msrZendeskUserId,
				status: "new",
				subject: "[Jurídico] Msr, SALVADOR - BA",
				statusAcolhimento: "solicitação_recebida",
				supportType: "legal",
				comment: {
					body: `${mockPayloadBoth.firstName} solicitou acolhimento pelo cadastro`,
					public: false,
				},
			}),
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});
		expect(fetch).toHaveBeenCalledWith(`${MATCH_LAMBDA_URL}/compose`, {
			body: JSON.stringify([bodyComposeLegal]),
			method: "POST",
			headers: {
				Authorization: undefined,
			},
		});

		expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/check-eligibility`, {
			body: JSON.stringify(bodyCheckEligibilityPsychological),
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});
		expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/zendesk/user`, {
			body: JSON.stringify({
				...mockPayloadBoth,
			}),
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});

		expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/db/upsert-msr`, {
			body: JSON.stringify({
				...mockPayloadBoth,
			}),
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});
		expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/zendesk/ticket`, {
			body: JSON.stringify({
				ticketId: null,
				msrZendeskUserId: mockPayloadBoth.msrZendeskUserId,
				status: "new",
				subject: "[Psicológico] Msr, SALVADOR - BA",
				statusAcolhimento: "solicitação_recebida",
				supportType: "psychological",
				comment: {
					body: `${mockPayloadBoth.firstName} solicitou acolhimento pelo cadastro`,
					public: false,
				},
			}),
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});
		expect(fetch).toHaveBeenCalledWith(`${MATCH_LAMBDA_URL}/compose`, {
			body: JSON.stringify([bodyComposePsychological]),
			method: "POST",
			headers: {
				Authorization: undefined,
			},
		});

		expect(response.status).toEqual(200);
		expect(await response.json()).toEqual({
			psychological: "matched",
			legal: "matched",
		});
	});

	it("should just update ticket and psychological support request as duplicated and create match for legal support request", async () => {
		fetch.mockResolvedValueOnce(
			createFetchResponse(mockResCheckEligibilityLegal)
		);
		fetch.mockResolvedValueOnce(createFetchResponse(mockResZendeskUser));
		fetch.mockResolvedValueOnce(createFetchResponse(mockResMsr));
		fetch.mockResolvedValueOnce(createFetchResponse(mockResTicketLegal));
		fetch.mockResolvedValueOnce(createFetchResponse(mockResLambdaLegal));

		mockedDb.supportRequests.findFirst.mockResolvedValue(
			mockSupportRequestsPsychological
		);
		mockedDb.supportRequestStatusHistory.findFirst.mockResolvedValue(
			mockSupportRequestStatusHistory
		);
		fetch.mockResolvedValueOnce(
			createFetchResponse(mockResCheckEligibilityPsychological)
		);
		fetch.mockResolvedValueOnce(
			createFetchResponse(mockResTicketPsychological)
		);

		const request = new NextRequest(
			new Request("http://localhost:3000/db/handle-request", {
				method: "POST",
				body: JSON.stringify(mockPayloadBoth),
			})
		);
		const response = await POST(request);

		expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/check-eligibility`, {
			body: JSON.stringify(bodyCheckEligibilityLegal),
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});
		expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/zendesk/user`, {
			body: JSON.stringify({
				...mockPayloadBoth,
			}),
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});

		expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/db/upsert-msr`, {
			body: JSON.stringify({
				...mockPayloadBoth,
			}),
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});
		expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/zendesk/ticket`, {
			body: JSON.stringify({
				ticketId: mockResCheckEligibilityLegal.ticketId,
				msrZendeskUserId: mockPayloadBoth.msrZendeskUserId,
				status: "new",
				subject: "[Jurídico] Msr, SALVADOR - BA",
				statusAcolhimento: "solicitação_recebida",
				supportType: "legal",
				comment: {
					body: `${mockPayloadBoth.firstName} solicitou acolhimento pelo cadastro`,
					public: false,
				},
			}),
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});
		expect(fetch).toHaveBeenCalledWith(`${MATCH_LAMBDA_URL}/handle-match`, {
			body: JSON.stringify(bodyHandleMatchLegal),
			method: "POST",
			headers: {
				Authorization: undefined,
			},
		});
		expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/check-eligibility`, {
			body: JSON.stringify(bodyCheckEligibilityPsychological),
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});
		expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/zendesk/ticket`, {
			body: JSON.stringify({
				ticketId: mockResTicketPsychological.ticketId,
				status: "open",
				statusAcolhimento: "solicitação_repetida",
				supportType: "psychological",
				comment: {
					body: emailDuplicated(mockPayloadBoth.firstName),
					public: true,
				},
			}),
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});
		expect(mockedDb.supportRequests.update).toHaveBeenCalledWith({
			where: {
				supportRequestId: mockResCheckEligibilityPsychological.supportRequestId,
			},
			data: {
				status: "duplicated",
			},
		});

		expect(mockedDb.supportRequestStatusHistory.create).toHaveBeenCalledWith({
			data: {
				supportRequestId: mockResCheckEligibilityPsychological.supportRequestId,
				status: "duplicated",
			},
		});
		expect(response.status).toEqual(200);
		expect(await response.json()).toEqual({
			psychological: "duplicated",
			legal: "matched",
		});
	});
});
