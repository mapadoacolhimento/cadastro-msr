import { NextRequest } from "next/server";
import { mockReset } from "vitest-mock-extended";
import mockedDb from "../../lib/__mocks__/db";
import msrPayload from "../../lib/__mocks__/payloads";
import createFetchResponse from "../../lib/__mocks__/fetch";
import { POST } from "../handle-request/route";
import { BASE_URL, MATCH_LAMBDA_URL, emailDuplicated } from "../../lib";

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
		const mockPayload = msrPayload({ supportType: ["legal"] });
		const mockResCheckEligibility = {
			supportRequestId: null,
			ticketId: null,
			shouldCreateMatch: true,
		};
		const mockResZendeskUser = {
			msrZendeskUserId: mockPayload.msrZendeskUserId,
		};

		const mockResMsr = {
			data: {
				msrId: mockPayload.msrZendeskUserId,
				status: mockPayload.status,
			},
		};

		const mockResTicket = {
			ticketId: 1234,
		};

		const mockResLambda = {
			matchId: 3456,
			supportRequestId: 234,
			msrId: mockPayload.msrZendeskUserId,
			volunteerId: 1,
			msrZendeskTicketId: 1234,
			volunteerZendeskTicketId: 4567,
			supportType: "legal",
			createdAt: "2024-08-13",
			updatedAt: "2024-08-13",
			status: "matched",
		};

		const bodyLambda = {
			supportRequest: {
				supportRequestId: null,
				msrId: mockPayload.msrZendeskUserId,
				zendeskTicketId: mockResTicket.ticketId,
				supportType: "legal",
				status: "open",
				hasDisability: mockPayload.hasDisability,
				lat: mockPayload.lat,
				lng: mockPayload.lng,
				city: mockPayload.city,
				state: mockPayload.state,
			},
		};

		fetch.mockResolvedValueOnce(createFetchResponse(mockResCheckEligibility));
		fetch.mockResolvedValueOnce(createFetchResponse(mockResZendeskUser));
		fetch.mockResolvedValueOnce(createFetchResponse(mockResMsr));
		fetch.mockResolvedValueOnce(createFetchResponse(mockResTicket));
		fetch.mockResolvedValueOnce(createFetchResponse(mockResLambda));

		const request = new NextRequest(
			new Request("http://localhost:3000/db/handle-request", {
				method: "POST",
				body: JSON.stringify(mockPayload),
			})
		);
		const response = await POST(request);

		expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/check-eligibility`, {
			body: JSON.stringify({
				email: mockPayload.email,
				supportType: mockPayload.supportType[0],
			}),
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});
		expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/zendesk/user`, {
			body: JSON.stringify({
				...mockPayload,
			}),
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});

		expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/db/upsert-msr`, {
			body: JSON.stringify({
				...mockPayload,
			}),
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});
		expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/zendesk/ticket`, {
			body: JSON.stringify({
				ticketId: null,
				msrZendeskUserId: mockPayload.msrZendeskUserId,
				status: "new",
				subject: "[Jurídico] Msr, SALVADOR - BA",
				statusAcolhimento: "solicitação_recebida",
				supportType: "legal",
				comment: {
					body: `${mockPayload.firstName} solicitou acolhimento pelo cadastro`,
					public: false,
				},
			}),
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});
		expect(fetch).toHaveBeenCalledWith(`${MATCH_LAMBDA_URL}/handle-match`, {
			body: JSON.stringify(bodyLambda),
			method: "POST",
			headers: {
				Authorization: undefined,
			},
		});
		expect(response.status).toEqual(200);
		expect(await response.json()).toEqual({ legal: "matched" });
	});

	it("should just update ticket and psychological support request as duplicated", async () => {
		const mockPayload = msrPayload({ supportType: ["psychological"] });
		const mockResCheckEligibility = {
			supportRequestId: 1234,
			ticketId: 3456,
			shouldCreateMatch: false,
		};

		const mockResTicket = {
			ticketId: 3456,
		};
		mockedDb.supportRequests.findFirst.mockResolvedValue({
			supportRequestId: 1234,
		});
		mockedDb.supportRequestStatusHistory.findFirst.mockResolvedValue({
			supportRequestStatusHistoryId: 2,
		});
		fetch.mockResolvedValueOnce(createFetchResponse(mockResCheckEligibility));
		fetch.mockResolvedValueOnce(createFetchResponse(mockResTicket));

		const request = new NextRequest(
			new Request("http://localhost:3000/db/handle-request", {
				method: "POST",
				body: JSON.stringify(mockPayload),
			})
		);
		const response = await POST(request);
		expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/check-eligibility`, {
			body: JSON.stringify({
				email: mockPayload.email,
				supportType: mockPayload.supportType[0],
			}),
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});
		expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/zendesk/ticket`, {
			body: JSON.stringify({
				ticketId: mockResTicket.ticketId,
				status: "open",
				statusAcolhimento: "solicitação_repetida",
				supportType: "psychological",
				comment: {
					body: emailDuplicated(mockPayload.firstName),
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
				supportRequestId: mockResCheckEligibility.supportRequestId,
			},
			data: {
				status: "duplicated",
			},
		});

		expect(mockedDb.supportRequestStatusHistory.create).toHaveBeenCalledWith({
			data: {
				supportRequestId: mockResCheckEligibility.supportRequestId,
				status: "duplicated",
			},
		});
		expect(response.status).toEqual(200);
		expect(await response.json()).toEqual({ psychological: "duplicated" });
	});

	it("should create match for support requests legal and psychological", async () => {
		const mockPayload = msrPayload({
			supportType: ["legal", "psychological"],
		});
		const mockResCheckEligibility = {
			supportRequestId: null,
			ticketId: null,
			shouldCreateMatch: true,
		};
		const mockResZendeskUser = {
			msrZendeskUserId: mockPayload.msrZendeskUserId,
		};

		const mockResMsr = {
			data: {
				msrId: mockPayload.msrZendeskUserId,
				status: mockPayload.status,
			},
		};

		const mockResTicketLegal = {
			ticketId: 1234,
		};
		const mockResTicketPsychological = {
			ticketId: 7890,
		};
		const mockResLambdaLegal = {
			matchId: 3456,
			supportRequestId: 234,
			msrId: mockPayload.msrZendeskUserId,
			volunteerId: 1,
			msrZendeskTicketId: 1234,
			volunteerZendeskTicketId: 4567,
			supportType: "legal",
			createdAt: "2024-08-13",
			updatedAt: "2024-08-13",
			status: "matched",
		};
		const mockResLambdaPsychological = {
			...mockResLambdaLegal,
			matchId: 3457,
			supportType: "psychological",
		};

		const bodyLambdaLegal = {
			supportRequest: {
				supportRequestId: null,
				msrId: mockPayload.msrZendeskUserId,
				zendeskTicketId: mockResTicketLegal.ticketId,
				supportType: "legal",
				status: "open",
				hasDisability: mockPayload.hasDisability,
				lat: mockPayload.lat,
				lng: mockPayload.lng,
				city: mockPayload.city,
				state: mockPayload.state,
			},
		};

		const bodyLambdaPsychological = {
			supportRequest: {
				...bodyLambdaLegal.supportRequest,
				supportType: "psychological",
				zendeskTicketId: mockResTicketPsychological.ticketId,
			},
		};

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
				body: JSON.stringify(mockPayload),
			})
		);
		const response = await POST(request);

		expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/check-eligibility`, {
			body: JSON.stringify({
				email: mockPayload.email,
				supportType: mockPayload.supportType[0],
			}),
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});
		expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/zendesk/user`, {
			body: JSON.stringify({
				...mockPayload,
			}),
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});

		expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/db/upsert-msr`, {
			body: JSON.stringify({
				...mockPayload,
			}),
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});
		expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/zendesk/ticket`, {
			body: JSON.stringify({
				ticketId: null,
				msrZendeskUserId: mockPayload.msrZendeskUserId,
				status: "new",
				subject: "[Jurídico] Msr, SALVADOR - BA",
				statusAcolhimento: "solicitação_recebida",
				supportType: "legal",
				comment: {
					body: `${mockPayload.firstName} solicitou acolhimento pelo cadastro`,
					public: false,
				},
			}),
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});
		expect(fetch).toHaveBeenCalledWith(`${MATCH_LAMBDA_URL}/handle-match`, {
			body: JSON.stringify(bodyLambdaLegal),
			method: "POST",
			headers: {
				Authorization: undefined,
			},
		});

		expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/check-eligibility`, {
			body: JSON.stringify({
				email: mockPayload.email,
				supportType: mockPayload.supportType[1],
			}),
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});
		expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/zendesk/user`, {
			body: JSON.stringify({
				...mockPayload,
			}),
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});

		expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/db/upsert-msr`, {
			body: JSON.stringify({
				...mockPayload,
			}),
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});
		expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/zendesk/ticket`, {
			body: JSON.stringify({
				ticketId: null,
				msrZendeskUserId: mockPayload.msrZendeskUserId,
				status: "new",
				subject: "[Psicológico] Msr, SALVADOR - BA",
				statusAcolhimento: "solicitação_recebida",
				supportType: "psychological",
				comment: {
					body: `${mockPayload.firstName} solicitou acolhimento pelo cadastro`,
					public: false,
				},
			}),
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});
		expect(fetch).toHaveBeenCalledWith(`${MATCH_LAMBDA_URL}/handle-match`, {
			body: JSON.stringify(bodyLambdaPsychological),
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
		const mockPayload = msrPayload({
			supportType: ["legal", "psychological"],
		});
		const mockResCheckEligibilityLegal = {
			supportRequestId: 1234,
			ticketId: 1111,
			shouldCreateMatch: true,
		};

		const mockResCheckEligibilityPsychological = {
			supportRequestId: 5678,
			ticketId: 2222,
			shouldCreateMatch: false,
		};

		const mockResZendeskUser = {
			msrZendeskUserId: mockPayload.msrZendeskUserId,
		};

		const mockResMsr = {
			data: {
				msrId: mockPayload.msrZendeskUserId,
				status: mockPayload.status,
			},
		};

		const mockResTicketLegal = {
			ticketId: 1111,
		};
		const mockResTicketPsychological = {
			ticketId: 2222,
		};
		const mockResLambdaLegal = {
			matchId: 123,
			supportRequestId: 234,
			msrId: mockPayload.msrZendeskUserId,
			volunteerId: 1,
			msrZendeskTicketId: 1234,
			volunteerZendeskTicketId: 4567,
			supportType: "legal",
			createdAt: "2024-08-13",
			updatedAt: "2024-08-13",
			status: "matched",
		};

		const bodyLambdaLegal = {
			supportRequestId: mockResCheckEligibilityLegal.supportRequestId,
			msrId: mockPayload.msrZendeskUserId,
			zendeskTicketId: mockResTicketLegal.ticketId,
			supportType: "legal",
			status: "open",
			hasDisability: mockPayload.hasDisability,
			lat: mockPayload.lat,
			lng: mockPayload.lng,
			city: mockPayload.city,
			state: mockPayload.state,
		};
		fetch.mockResolvedValueOnce(
			createFetchResponse(mockResCheckEligibilityLegal)
		);
		fetch.mockResolvedValueOnce(createFetchResponse(mockResZendeskUser));
		fetch.mockResolvedValueOnce(createFetchResponse(mockResMsr));
		fetch.mockResolvedValueOnce(createFetchResponse(mockResTicketLegal));
		fetch.mockResolvedValueOnce(createFetchResponse(mockResLambdaLegal));

		mockedDb.supportRequests.findFirst.mockResolvedValue({
			supportRequestId: mockResCheckEligibilityPsychological.supportRequestId,
		});
		mockedDb.supportRequestStatusHistory.findFirst.mockResolvedValue({
			supportRequestStatusHistoryId: 3,
		});
		fetch.mockResolvedValueOnce(
			createFetchResponse(mockResCheckEligibilityPsychological)
		);
		fetch.mockResolvedValueOnce(
			createFetchResponse(mockResTicketPsychological)
		);

		const request = new NextRequest(
			new Request("http://localhost:3000/db/handle-request", {
				method: "POST",
				body: JSON.stringify(mockPayload),
			})
		);
		const response = await POST(request);

		expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/check-eligibility`, {
			body: JSON.stringify({
				email: mockPayload.email,
				supportType: mockPayload.supportType[0],
			}),
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});
		expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/zendesk/user`, {
			body: JSON.stringify({
				...mockPayload,
			}),
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});

		expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/db/upsert-msr`, {
			body: JSON.stringify({
				...mockPayload,
			}),
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});
		expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/zendesk/ticket`, {
			body: JSON.stringify({
				ticketId: mockResCheckEligibilityLegal.ticketId,
				msrZendeskUserId: mockPayload.msrZendeskUserId,
				status: "new",
				subject: "[Jurídico] Msr, SALVADOR - BA",
				statusAcolhimento: "solicitação_recebida",
				supportType: "legal",
				comment: {
					body: `${mockPayload.firstName} solicitou acolhimento pelo cadastro`,
					public: false,
				},
			}),
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});
		expect(fetch).toHaveBeenCalledWith(`${MATCH_LAMBDA_URL}/compose`, {
			body: JSON.stringify([bodyLambdaLegal]),
			method: "POST",
			headers: {
				Authorization: undefined,
			},
		});
		expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/check-eligibility`, {
			body: JSON.stringify({
				email: mockPayload.email,
				supportType: mockPayload.supportType[1],
			}),
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
					body: emailDuplicated(mockPayload.firstName),
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
