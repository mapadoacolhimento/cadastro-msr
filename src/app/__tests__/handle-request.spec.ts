import { NextRequest } from "next/server";
import { mockReset } from "vitest-mock-extended";
import { expect } from "vitest";
import mockedDb from "@/tests/unit/db";
import { msrPayload } from "@/tests/unit/payloads";
import createFetchResponse from "@/tests/unit/fetch";
import { POST } from "../handle-request/route";
import { MATCH_LAMBDA_URL } from "@/constants";
import { emailDuplicated } from "@/lib/handleDuplicatedSupportRequest";
import * as validateAndUpsertZendeskTicket from "@/lib/zendesk/validateAndUpsertZendeskTicket";
import * as validateAndUpsertZendeskUser from "@/lib/zendesk/validateAndUpsertZendeskUser";
import * as upsertMsrOnDb from "@/lib/upsertMsrOnDb";
import * as checkMatchEligibility from "@/lib/checkMatchEligibility";

const mockValidateAndUpsertZendeskTicket = vi.spyOn(
	validateAndUpsertZendeskTicket,
	"default"
);
const mockValidateAndUpsertZendeskUser = vi.spyOn(
	validateAndUpsertZendeskUser,
	"default"
);
const mockUpsertMsrOnDb = vi.spyOn(upsertMsrOnDb, "default");
const mockcheckMatchEligibility = vi.spyOn(checkMatchEligibility, "default");

const mockPayloadLegal = msrPayload({ supportType: ["legal"] });
const mockPayloadPsychological = msrPayload({ supportType: ["psychological"] });
const mockPayloadBoth = msrPayload({ supportType: ["legal", "psychological"] });

const mockResZendeskUser = {
	msrZendeskUserId: 12346789 as unknown as bigint,
};

const mockResMsr = {
	msrId: 12346789 as unknown as bigint,
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
	email: mockPayloadPsychological.email,
	supportType: "psychological",
};

const mockResCheckEligibilityNew = {
	supportRequestId: null,
	zendeskTicketId: null,
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
	zendeskTicketId: 1234 as unknown as bigint,
	shouldCreateMatch: true,
};

const mockResCheckEligibilityPsychological = {
	supportRequestId: 5678,
	zendeskTicketId: 7890 as unknown as bigint,
	shouldCreateMatch: false,
};

const mockMatchLegal = {
	matchId: 3456,
	supportRequestId: mockSupportRequestsLegal.supportRequestId,
	msrZendeskTicketId: mockResTicketLegal.ticketId,
	supportType: "legal",
	status: "waiting_contact",
};

const bodyComposeLegal = {
	msrId: mockPayloadLegal.msrZendeskUserId,
	zendeskTicketId: mockResTicketLegal.ticketId,
	supportType: "legal",
	status: "open",
	supportExpertise: null,
	priority: null,
	hasDisability: mockPayloadLegal.hasDisability,
	requiresLibras: null,
	acceptsOnlineSupport: mockPayloadLegal.acceptsOnlineSupport,
	lat: mockPayloadLegal.lat,
	lng: mockPayloadLegal.lng,
	city: mockPayloadLegal.city,
	state: mockPayloadLegal.state,
	supportRequestId: null,
};

describe("POST handle-request", () => {
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

	describe("New legal support request", () => {
		beforeAll(async () => {
			mockcheckMatchEligibility.mockResolvedValueOnce(
				mockResCheckEligibilityNew
			);
			mockValidateAndUpsertZendeskUser.mockResolvedValueOnce(
				mockResZendeskUser
			);
			mockUpsertMsrOnDb.mockResolvedValueOnce(mockResMsr);
			mockValidateAndUpsertZendeskTicket.mockResolvedValueOnce(
				mockResTicketLegal
			);
			fetch.mockResolvedValueOnce(createFetchResponse({ message: undefined }));
			fetch.mockResolvedValueOnce(
				createFetchResponse({ message: [mockMatchLegal] })
			);
		});

		afterAll(() => {
			mockReset(mockedDb);
			vi.resetAllMocks();
		});

		it("should respond with `{ legal: 'waiting_contact' }`", async () => {
			const request = new NextRequest(
				new Request("http://localhost:3000/handle-request", {
					method: "POST",
					body: JSON.stringify(mockPayloadLegal),
				})
			);
			const response = await POST(request);

			expect(response.status).toStrictEqual(200);
			expect(await response.json()).toStrictEqual({ legal: "waiting_contact" });
		});

		it("should call checkMatchEligibility with correct params ", () => {
			expect(mockcheckMatchEligibility).toHaveBeenCalledWith({
				email: mockPayloadLegal.email,
				supportType: mockPayloadLegal.supportType[0],
			});
		});

		it("should call validateAndUpsertZendeskUser with correct params", () => {
			expect(mockValidateAndUpsertZendeskUser).toHaveBeenCalledWith(
				mockPayloadLegal
			);
		});

		it("should call upsertMsrOnDb with correct params", () => {
			expect(mockUpsertMsrOnDb).toHaveBeenCalledWith(mockPayloadLegal);
		});

		it("should call validateAndUpserZendeskTicket with correct params", () => {
			expect(mockValidateAndUpsertZendeskTicket).toHaveBeenCalledWith({
				ticketId: null,
				msrZendeskUserId: mockPayloadLegal.msrZendeskUserId,
				status: "new",
				subject: "[Jurídico] Msr, SALVADOR - BA",
				statusAcolhimento: "solicitação_recebida",
				msrName: mockPayloadLegal.firstName,
				supportType: "legal",
				comment: {
					body: `${mockPayloadLegal.firstName} solicitou acolhimento pelo cadastro`,
					public: false,
				},
			});
		});

		it("should call match lambda /sign endpoint", () => {
			expect(fetch).toHaveBeenNthCalledWith(1, `${MATCH_LAMBDA_URL}/sign`, {
				method: "GET",
			});
		});

		it("should call match lambda with correct params", () => {
			const { supportRequestId, ...rest } = bodyComposeLegal;
			expect(fetch).toHaveBeenNthCalledWith(2, `${MATCH_LAMBDA_URL}/compose`, {
				body: JSON.stringify([rest]),
				method: "POST",
				headers: {
					Authorization: undefined,
				},
			});
		});
	});

	describe("New psychological support request with old ongoing psychological support request", () => {
		beforeAll(async () => {
			mockUpsertMsrOnDb.mockResolvedValueOnce(mockResMsr);

			mockcheckMatchEligibility.mockResolvedValueOnce(
				mockResCheckEligibilityPsychological
			);

			mockValidateAndUpsertZendeskUser.mockResolvedValueOnce(
				mockResZendeskUser
			);

			mockValidateAndUpsertZendeskTicket.mockResolvedValueOnce(
				mockResTicketPsychological
			);
		});

		afterAll(() => {
			mockReset(mockedDb);
			vi.resetAllMocks();
		});

		it("should respond with `{ psychological: 'duplicated' }`", async () => {
			const request = new NextRequest(
				new Request("http://localhost:3000/db/handle-request", {
					method: "POST",
					body: JSON.stringify(mockPayloadPsychological),
				})
			);
			const response = await POST(request);
			expect(response.status).toEqual(200);
			expect(await response.json()).toEqual({ psychological: "duplicated" });
		});

		it("should call checkMatchEligibility with correct params ", () => {
			expect(mockcheckMatchEligibility).toHaveBeenCalledWith(
				bodyCheckEligibilityPsychological
			);
		});

		it("should call validateAndUpsertZendeskUser with correct params", () => {
			expect(mockValidateAndUpsertZendeskUser).toHaveBeenCalledWith(
				mockPayloadPsychological
			);
		});

		it("should call upsertMsrOnDb with correct params", () => {
			expect(mockUpsertMsrOnDb).toHaveBeenCalledWith(mockPayloadPsychological);
		});

		it("should call validateAndUpserZendeskTicket with correct params", () => {
			expect(mockValidateAndUpsertZendeskTicket).toHaveBeenCalledWith({
				ticketId: mockResTicketPsychological.ticketId,
				status: "open",
				statusAcolhimento: "solicitação_repetida",
				supportType: "psychological",
				comment: {
					body: emailDuplicated(mockPayloadPsychological.firstName),
					public: true,
				},
			});
		});

		it("should call to update support request with 'duplicated' status", () => {
			expect(mockedDb.supportRequests.update).toHaveBeenCalledWith({
				where: {
					supportRequestId:
						mockResCheckEligibilityPsychological.supportRequestId,
				},
				data: {
					status: "duplicated",
				},
			});
		});

		it("should call to update support request status history with 'duplicated' status", () => {
			expect(mockedDb.supportRequestStatusHistory.create).toHaveBeenCalledWith({
				data: {
					supportRequestId:
						mockResCheckEligibilityPsychological.supportRequestId,
					status: "duplicated",
				},
			});
		});
	});

	describe("New legal and psychological support requests", () => {
		beforeAll(async () => {
			mockcheckMatchEligibility.mockResolvedValueOnce(
				mockResCheckEligibilityNew
			);
			mockcheckMatchEligibility.mockResolvedValueOnce(
				mockResCheckEligibilityNew
			);

			mockValidateAndUpsertZendeskUser.mockResolvedValueOnce(
				mockResZendeskUser
			);
			mockUpsertMsrOnDb.mockResolvedValueOnce(mockResMsr);

			mockValidateAndUpsertZendeskTicket.mockResolvedValueOnce(
				mockResTicketLegal
			);
			mockValidateAndUpsertZendeskTicket.mockResolvedValueOnce(
				mockResTicketPsychological
			);

			fetch.mockResolvedValueOnce(createFetchResponse({ message: undefined }));
			fetch.mockResolvedValueOnce(
				createFetchResponse({ message: [mockMatchLegal] })
			);

			fetch.mockResolvedValueOnce(createFetchResponse({ message: undefined }));
			const mockMatchPsychological = {
				matchId: 3457,
				supportType: "psychological",
				supportRequestId: mockSupportRequestsPsychological.supportRequestId,
				msrZendeskTicketId: mockResTicketLegal.ticketId,
				status: "waiting_contact",
			};
			fetch.mockResolvedValueOnce(
				createFetchResponse({ message: [mockMatchPsychological] })
			);
		});

		afterAll(() => {
			mockReset(mockedDb);
			vi.resetAllMocks();
		});

		it("should respond with `{ legal: 'waiting_contact', psychological: 'waiting_contact' }`", async () => {
			const request = new NextRequest(
				new Request("http://localhost:3000/db/handle-request", {
					method: "POST",
					body: JSON.stringify(mockPayloadBoth),
				})
			);
			const response = await POST(request);

			expect(response.status).toEqual(200);
			expect(await response.json()).toEqual({
				psychological: "waiting_contact",
				legal: "waiting_contact",
			});
		});

		it("should call checkMatchEligibility with correct params ", () => {
			expect(mockcheckMatchEligibility).toHaveBeenNthCalledWith(
				1,
				bodyCheckEligibilityLegal
			);

			expect(mockcheckMatchEligibility).toHaveBeenNthCalledWith(
				2,
				bodyCheckEligibilityPsychological
			);
		});

		it("should call validateAndUpsertZendeskUser with correct params", () => {
			expect(mockValidateAndUpsertZendeskUser).toHaveBeenCalledWith(
				mockPayloadBoth
			);
		});

		it("should call upsertMsrOnDb with correct params", () => {
			expect(mockUpsertMsrOnDb).toHaveBeenCalledWith(mockPayloadBoth);
		});

		it("should call validateAndUpserZendeskTicket with correct params", () => {
			expect(mockValidateAndUpsertZendeskTicket).toHaveBeenNthCalledWith(1, {
				ticketId: null,
				msrZendeskUserId: mockPayloadBoth.msrZendeskUserId,
				status: "new",
				subject: "[Jurídico] Msr, SALVADOR - BA",
				statusAcolhimento: "solicitação_recebida",
				msrName: mockPayloadBoth.firstName,
				supportType: "legal",
				comment: {
					body: `${mockPayloadBoth.firstName} solicitou acolhimento pelo cadastro`,
					public: false,
				},
			});

			expect(mockValidateAndUpsertZendeskTicket).toHaveBeenNthCalledWith(2, {
				ticketId: null,
				msrZendeskUserId: mockPayloadBoth.msrZendeskUserId,
				status: "new",
				subject: "[Psicológico] Msr, SALVADOR - BA",
				statusAcolhimento: "solicitação_recebida",
				msrName: mockPayloadBoth.firstName,
				supportType: "psychological",
				comment: {
					body: `${mockPayloadBoth.firstName} solicitou acolhimento pelo cadastro`,
					public: false,
				},
			});
		});

		it("should call match lambda /sign endpoint", () => {
			expect(fetch).toHaveBeenNthCalledWith(1, `${MATCH_LAMBDA_URL}/sign`, {
				method: "GET",
			});
			expect(fetch).toHaveBeenNthCalledWith(3, `${MATCH_LAMBDA_URL}/sign`, {
				method: "GET",
			});
		});

		it("should call match lambda with correct params", () => {
			const { supportRequestId: legalId, ...legalRest } = bodyComposeLegal;
			expect(fetch).toHaveBeenNthCalledWith(2, `${MATCH_LAMBDA_URL}/compose`, {
				body: JSON.stringify([legalRest]),
				method: "POST",
				headers: {
					Authorization: undefined,
				},
			});

			const bodyComposePsychological = {
				...bodyComposeLegal,
				supportType: "psychological",
				zendeskTicketId: mockResTicketPsychological.ticketId,
			};
			const { supportRequestId: psyId, ...psyRest } = bodyComposePsychological;
			expect(fetch).toHaveBeenNthCalledWith(4, `${MATCH_LAMBDA_URL}/compose`, {
				body: JSON.stringify([psyRest]),
				method: "POST",
				headers: {
					Authorization: undefined,
				},
			});
		});
	});

	describe("New legal and psychological support requests with old legal support request", () => {
		beforeAll(async () => {
			mockcheckMatchEligibility.mockResolvedValueOnce(
				mockResCheckEligibilityLegal
			);
			mockcheckMatchEligibility.mockResolvedValueOnce(
				mockResCheckEligibilityPsychological
			);
			mockValidateAndUpsertZendeskUser.mockResolvedValueOnce(
				mockResZendeskUser
			);
			mockUpsertMsrOnDb.mockResolvedValueOnce(mockResMsr);
			mockValidateAndUpsertZendeskTicket.mockResolvedValueOnce(
				mockResTicketLegal
			);
			mockValidateAndUpsertZendeskTicket.mockResolvedValueOnce(
				mockResTicketPsychological
			);

			fetch.mockResolvedValueOnce(createFetchResponse({ message: undefined }));
			fetch.mockResolvedValueOnce(
				createFetchResponse({ message: mockMatchLegal })
			);
		});

		afterAll(() => {
			mockReset(mockedDb);
			vi.resetAllMocks();
		});

		it("should respond with `{ legal: 'waiting_contact', psychological: 'duplicated' }`", async () => {
			const request = new NextRequest(
				new Request("http://localhost:3000/db/handle-request", {
					method: "POST",
					body: JSON.stringify(mockPayloadBoth),
				})
			);
			const response = await POST(request);
			expect(response.status).toEqual(200);
			expect(await response.json()).toEqual({
				psychological: "duplicated",
				legal: "waiting_contact",
			});
		});

		it("should call checkMatchEligibility with correct params ", () => {
			expect(mockcheckMatchEligibility).toHaveBeenNthCalledWith(
				1,
				bodyCheckEligibilityLegal
			);
			expect(mockcheckMatchEligibility).toHaveBeenNthCalledWith(
				2,
				bodyCheckEligibilityPsychological
			);
		});

		it("should call validateAndUpsertZendeskUser with correct params", () => {
			expect(mockValidateAndUpsertZendeskUser).toHaveBeenCalledWith(
				mockPayloadBoth
			);
		});

		it("should call upsertMsrOnDb with correct params", () => {
			expect(mockUpsertMsrOnDb).toHaveBeenCalledWith(mockPayloadBoth);
		});

		it("should call validateAndUpserZendeskTicket with correct params", () => {
			expect(mockValidateAndUpsertZendeskTicket).toHaveBeenNthCalledWith(1, {
				ticketId: mockResCheckEligibilityLegal.zendeskTicketId,
				msrZendeskUserId: mockPayloadBoth.msrZendeskUserId,
				status: "new",
				subject: "[Jurídico] Msr, SALVADOR - BA",
				statusAcolhimento: "solicitação_recebida",
				msrName: mockPayloadBoth.firstName,
				supportType: "legal",
				comment: {
					body: `${mockPayloadBoth.firstName} solicitou acolhimento pelo cadastro`,
					public: false,
				},
			});
			expect(mockValidateAndUpsertZendeskTicket).toHaveBeenNthCalledWith(2, {
				ticketId: mockResTicketPsychological.ticketId,
				status: "open",
				statusAcolhimento: "solicitação_repetida",
				supportType: "psychological",
				comment: {
					body: emailDuplicated(mockPayloadBoth.firstName),
					public: true,
				},
			});
		});

		it("should call match lambda /sign endpoint", () => {
			expect(fetch).toHaveBeenNthCalledWith(1, `${MATCH_LAMBDA_URL}/sign`, {
				method: "GET",
			});
		});

		it("should call match lambda with correct params", () => {
			const bodyHandleMatchLegal = {
				supportRequest: {
					...bodyComposeLegal,
					supportRequestId: mockResCheckEligibilityLegal.supportRequestId,
					zendeskTicketId: mockResTicketLegal.ticketId,
				},
				shouldRandomize: true,
				matchType: "msr",
			};
			expect(fetch).toHaveBeenNthCalledWith(
				2,
				`${MATCH_LAMBDA_URL}/handle-match`,
				{
					body: JSON.stringify(bodyHandleMatchLegal),
					method: "POST",
					headers: {
						Authorization: undefined,
					},
				}
			);
		});

		it("should call to update support request with 'duplicated' status", () => {
			expect(mockedDb.supportRequests.update).toHaveBeenCalledWith({
				where: {
					supportRequestId:
						mockResCheckEligibilityPsychological.supportRequestId,
				},
				data: {
					status: "duplicated",
				},
			});
		});

		it("should call to update support request status history with 'duplicated' status", () => {
			expect(mockedDb.supportRequestStatusHistory.create).toHaveBeenCalledWith({
				data: {
					supportRequestId:
						mockResCheckEligibilityPsychological.supportRequestId,
					status: "duplicated",
				},
			});
		});
	});
});
