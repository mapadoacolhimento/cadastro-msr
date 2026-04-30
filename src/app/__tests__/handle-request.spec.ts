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
import { SupportRequests } from "@prisma/client";

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
	ticketWasClosed: false,
};

const mockResTicketLegal = {
	ticketId: 1234,
};

const mockResTicketPsychological = {
	ticketId: 7890,
};

const mockResCheckEligibilityClosedTicketLegal = {
	supportRequestId: 1234,
	zendeskTicketId: 1234 as unknown as bigint,
	shouldCreateMatch: true,
	ticketWasClosed: true,
};

const mockResCheckEligibilityLegal = {
	supportRequestId: 1234,
	zendeskTicketId: 1234 as unknown as bigint,
	shouldCreateMatch: true,
	ticketWasClosed: false,
};

const mockResCheckEligibilityPsychological = {
	supportRequestId: 5678,
	zendeskTicketId: 7890 as unknown as bigint,
	shouldCreateMatch: false,
	ticketWasClosed: false,
};

const mockMatchLegal = {
	supportRequestId: 1234,
};

const mockMatchPsychological = {
	supportRequestId: 7890,
};

const mockCreatedSupportRequestLegal = {
	supportRequestId: 1234,
} as SupportRequests;

const mockCreatedSupportRequestPsychological = {
	supportRequestId: 7890,
} as SupportRequests;

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
	public_services_referral: null,
	referral_date: null,
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
			mockedDb.supportRequests.create.mockResolvedValueOnce(
				mockCreatedSupportRequestLegal
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

		it("should return legal match info", async () => {
			const request = new NextRequest(
				new Request("http://localhost:3000/handle-request", {
					method: "POST",
					body: JSON.stringify(mockPayloadLegal),
				})
			);

			const response = await POST(request);

			expect(response.status).toStrictEqual(200);
			expect(await response.json()).toStrictEqual({
				legal: { supportRequestId: mockMatchLegal.supportRequestId },
			});
		});

		it("should call checkMatchEligibility with correct params", () => {
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

		it("should call validateAndUpsertZendeskTicket with correct params", () => {
			expect(mockValidateAndUpsertZendeskTicket).toHaveBeenCalledWith(
				expect.objectContaining({
					ticketId: null,
					msrZendeskUserId: mockPayloadLegal.msrZendeskUserId,
					status: "pending",
					subject: "[Jurídico] Msr, SALVADOR - BA",
					statusAcolhimento: "solicitação_recebida",
					msrName: mockPayloadLegal.firstName,
					supportType: "legal",
					comment: expect.objectContaining({
						html_body: expect.stringContaining(
							"Nova solicitação de acolhimento jurídico"
						),
						public: false,
					}),
				})
			);

			const firstCall = mockValidateAndUpsertZendeskTicket.mock.calls[0][0];
			const htmlBody = firstCall.comment.html_body;

			expect(firstCall.comment).not.toHaveProperty("body");
			expect(firstCall.comment).toHaveProperty("html_body");

			expect(htmlBody).toContain("<strong>Dados gerais</strong>");
			expect(htmlBody).toContain("<strong>Dados socioeconômicos</strong>");
			expect(htmlBody).toContain("<strong>Histórico de violência</strong>");

			expect(htmlBody).toContain("<strong>Raça/cor:</strong> Preta");
			expect(htmlBody).toContain(
				"<strong>Situação de trabalho:</strong> Trabalhadora com carteira de trabalho assinada"
			);
			expect(htmlBody).toContain(
				"<strong>Tipos de violência:</strong> Violência física"
			);
			expect(htmlBody).toContain(
				"<strong>Gênero da pessoa agressora:</strong> Homem"
			);
			expect(htmlBody).toContain(
				"<strong>Pessoa agressora:</strong> Ex-parceiro(a)"
			);
		});

		it("should create support request on db when supportRequestId is null", () => {
			expect(mockedDb.supportRequests.create).toHaveBeenCalledWith({
				data: {
					msrId: mockResZendeskUser.msrZendeskUserId,
					supportType: "legal",
					status: "open",
					zendeskTicketId: mockResTicketLegal.ticketId,
					lat: mockPayloadLegal.lat,
					lng: mockPayloadLegal.lng,
					city: mockPayloadLegal.city,
					state: mockPayloadLegal.state,
					hasDisability: mockPayloadLegal.hasDisability,
					acceptsOnlineSupport: mockPayloadLegal.acceptsOnlineSupport,
				},
			});
		});

		it("should NOT update support request on db when supportRequestId is null", () => {
			expect(mockedDb.supportRequests.update).not.toHaveBeenCalled();
		});

		it("should call match lambda /sign endpoint", () => {
			expect(fetch).toHaveBeenNthCalledWith(1, `${MATCH_LAMBDA_URL}/sign`, {
				method: "GET",
			});
		});

		it("should call handle-match lambda with the new supportRequestId created on db", () => {
			// após o db.create, supportRequestId é 1234 (não-nulo), então createMatch roteia para /handle-match em vez de /compose
			const bodyHandleMatchLegal = {
				supportRequest: {
					...bodyComposeLegal,
					supportRequestId: mockCreatedSupportRequestLegal.supportRequestId,
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

			mockedDb.supportRequests.update.mockResolvedValueOnce({
				status: "duplicated",
			} as SupportRequests);
		});

		afterAll(() => {
			mockReset(mockedDb);
			vi.resetAllMocks();
		});

		it("should respond with `{ psychological: {status: 'duplicated'} }`", async () => {
			const request = new NextRequest(
				new Request("http://localhost:3000/db/handle-request", {
					method: "POST",
					body: JSON.stringify(mockPayloadPsychological),
				})
			);

			const response = await POST(request);

			expect(response.status).toEqual(200);
			expect(await response.json()).toEqual({
				psychological: { status: "duplicated" },
			});
		});

		it("should call checkMatchEligibility with correct params", () => {
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

		it("should call validateAndUpsertZendeskTicket with correct params", () => {
			expect(mockValidateAndUpsertZendeskTicket).toHaveBeenCalledWith({
				ticketId: mockResTicketPsychological.ticketId,
				status: "open",
				statusAcolhimento: "solicitação_repetida",
				supportType: "psychological",
				comment: {
					html_body: emailDuplicated(mockPayloadPsychological.firstName),
					public: true,
				},
			});
		});

		it("should NOT create a support request on db when request is duplicated", () => {
			expect(mockedDb.supportRequests.create).not.toHaveBeenCalled();
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
				select: {
					supportRequestId: true,
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
			mockedDb.supportRequests.create.mockResolvedValueOnce(
				mockCreatedSupportRequestLegal
			);
			mockedDb.supportRequests.create.mockResolvedValueOnce(
				mockCreatedSupportRequestPsychological
			);

			fetch.mockResolvedValueOnce(createFetchResponse({ message: undefined }));
			fetch.mockResolvedValueOnce(
				createFetchResponse({ message: [mockMatchLegal] })
			);

			fetch.mockResolvedValueOnce(createFetchResponse({ message: undefined }));
			fetch.mockResolvedValueOnce(
				createFetchResponse({ message: [mockMatchPsychological] })
			);
		});

		afterAll(() => {
			mockReset(mockedDb);
			vi.resetAllMocks();
		});

		it("should respond with legal and psychological matches", async () => {
			const request = new NextRequest(
				new Request("http://localhost:3000/db/handle-request", {
					method: "POST",
					body: JSON.stringify(mockPayloadBoth),
				})
			);

			const response = await POST(request);

			expect(response.status).toEqual(200);
			expect(await response.json()).toEqual({
				psychological: {
					supportRequestId: mockMatchPsychological.supportRequestId,
				},
				legal: { supportRequestId: mockMatchLegal.supportRequestId },
			});
		});

		it("should call checkMatchEligibility with correct params", () => {
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

		it("should call validateAndUpsertZendeskTicket with correct params", () => {
			expect(mockValidateAndUpsertZendeskTicket).toHaveBeenNthCalledWith(
				1,
				expect.objectContaining({
					ticketId: null,
					msrZendeskUserId: mockPayloadBoth.msrZendeskUserId,
					status: "pending",
					subject: "[Jurídico] Msr, SALVADOR - BA",
					statusAcolhimento: "solicitação_recebida",
					msrName: mockPayloadBoth.firstName,
					supportType: "legal",
					comment: expect.objectContaining({
						html_body: expect.stringContaining(
							"Nova solicitação de acolhimento jurídico"
						),
						public: false,
					}),
				})
			);

			expect(mockValidateAndUpsertZendeskTicket).toHaveBeenNthCalledWith(
				2,
				expect.objectContaining({
					ticketId: null,
					msrZendeskUserId: mockPayloadBoth.msrZendeskUserId,
					status: "pending",
					subject: "[Psicológico] Msr, SALVADOR - BA",
					statusAcolhimento: "solicitação_recebida",
					msrName: mockPayloadBoth.firstName,
					supportType: "psychological",
					comment: expect.objectContaining({
						html_body: expect.stringContaining(
							"Nova solicitação de acolhimento psicológico"
						),
						public: false,
					}),
				})
			);
		});

		it("should create legal support request on db when supportRequestId is null", () => {
			expect(mockedDb.supportRequests.create).toHaveBeenNthCalledWith(1, {
				data: {
					msrId: mockResZendeskUser.msrZendeskUserId,
					supportType: "legal",
					status: "open",
					zendeskTicketId: mockResTicketLegal.ticketId,
					lat: mockPayloadBoth.lat,
					lng: mockPayloadBoth.lng,
					city: mockPayloadBoth.city,
					state: mockPayloadBoth.state,
					hasDisability: mockPayloadBoth.hasDisability,
					acceptsOnlineSupport: mockPayloadBoth.acceptsOnlineSupport,
				},
			});
		});

		it("should create psychological support request on db when supportRequestId is null", () => {
			expect(mockedDb.supportRequests.create).toHaveBeenNthCalledWith(2, {
				data: {
					msrId: mockResZendeskUser.msrZendeskUserId,
					supportType: "psychological",
					status: "open",
					zendeskTicketId: mockResTicketPsychological.ticketId,
					lat: mockPayloadBoth.lat,
					lng: mockPayloadBoth.lng,
					city: mockPayloadBoth.city,
					state: mockPayloadBoth.state,
					hasDisability: mockPayloadBoth.hasDisability,
					acceptsOnlineSupport: mockPayloadBoth.acceptsOnlineSupport,
				},
			});
		});

		it("should call db.supportRequests.create exactly twice for two new requests", () => {
			expect(mockedDb.supportRequests.create).toHaveBeenCalledTimes(2);
		});

		it("should NOT update any support request on db for new requests", () => {
			expect(mockedDb.supportRequests.update).not.toHaveBeenCalled();
		});

		it("should call match lambda /sign endpoint", () => {
			expect(fetch).toHaveBeenNthCalledWith(1, `${MATCH_LAMBDA_URL}/sign`, {
				method: "GET",
			});
			expect(fetch).toHaveBeenNthCalledWith(3, `${MATCH_LAMBDA_URL}/sign`, {
				method: "GET",
			});
		});

		it("should call handle-match lambda with correct params for both new requests", () => {
			// após db.create, ambos os supportRequestId são não-nulos, então createMatch roteia para /handle-match em vez de /compose
			const bodyHandleMatchLegal = {
				supportRequest: {
					...bodyComposeLegal,
					supportRequestId: mockCreatedSupportRequestLegal.supportRequestId,
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

			const bodyHandleMatchPsychological = {
				supportRequest: {
					...bodyComposeLegal,
					supportType: "psychological",
					zendeskTicketId: mockResTicketPsychological.ticketId,
					supportRequestId:
						mockCreatedSupportRequestPsychological.supportRequestId,
				},
				shouldRandomize: true,
				matchType: "msr",
			};

			expect(fetch).toHaveBeenNthCalledWith(
				4,
				`${MATCH_LAMBDA_URL}/handle-match`,
				{
					body: JSON.stringify(bodyHandleMatchPsychological),
					method: "POST",
					headers: {
						Authorization: undefined,
					},
				}
			);
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

			mockedDb.supportRequests.update.mockResolvedValueOnce({
				status: "duplicated",
			} as SupportRequests);

			fetch.mockResolvedValueOnce(createFetchResponse({ message: undefined }));
			fetch.mockResolvedValueOnce(
				createFetchResponse({ message: mockMatchLegal })
			);
		});

		afterAll(() => {
			mockReset(mockedDb);
			vi.resetAllMocks();
		});

		it("should respond with legal match and psychological as duplicated`", async () => {
			const request = new NextRequest(
				new Request("http://localhost:3000/db/handle-request", {
					method: "POST",
					body: JSON.stringify(mockPayloadBoth),
				})
			);

			const response = await POST(request);

			expect(response.status).toEqual(200);
			expect(await response.json()).toEqual({
				psychological: { status: "duplicated" },
				legal: { supportRequestId: mockMatchLegal.supportRequestId },
			});
		});

		it("should call checkMatchEligibility with correct params", () => {
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

		it("should call validateAndUpsertZendeskTicket with correct params", () => {
			expect(mockValidateAndUpsertZendeskTicket).toHaveBeenNthCalledWith(
				1,
				expect.objectContaining({
					ticketId: mockResCheckEligibilityLegal.zendeskTicketId,
					msrZendeskUserId: mockPayloadBoth.msrZendeskUserId,
					status: "pending",
					subject: "[Jurídico] Msr, SALVADOR - BA",
					statusAcolhimento: "solicitação_recebida",
					msrName: mockPayloadBoth.firstName,
					supportType: "legal",
					comment: expect.objectContaining({
						html_body: expect.stringContaining(
							"Nova solicitação de acolhimento jurídico"
						),
						public: false,
					}),
				})
			);

			expect(mockValidateAndUpsertZendeskTicket).toHaveBeenNthCalledWith(
				2,
				expect.objectContaining({
					ticketId: mockResTicketPsychological.ticketId,
					status: "open",
					statusAcolhimento: "solicitação_repetida",
					supportType: "psychological",
					comment: expect.objectContaining({
						html_body: emailDuplicated(mockPayloadBoth.firstName),
						public: true,
					}),
				})
			);
		});

		it("should NOT create support request on db when supportRequestId already exists", () => {
			expect(mockedDb.supportRequests.create).not.toHaveBeenCalled();
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
				select: {
					supportRequestId: true,
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

	describe("Legal support request with closed ticket", () => {
		beforeAll(async () => {
			mockcheckMatchEligibility.mockResolvedValueOnce(
				mockResCheckEligibilityClosedTicketLegal
			);
			mockValidateAndUpsertZendeskUser.mockResolvedValueOnce(
				mockResZendeskUser
			);
			mockUpsertMsrOnDb.mockResolvedValueOnce(mockResMsr);
			// validateAndUpsertZendeskTicket recebe o ticketId antigo mas deve gerar um novo
			mockValidateAndUpsertZendeskTicket.mockResolvedValueOnce(
				mockResTicketLegal
			);
			// update do support_request com o novo zendeskTicketId
			mockedDb.supportRequests.update.mockResolvedValueOnce({
				supportRequestId:
					mockResCheckEligibilityClosedTicketLegal.supportRequestId,
				zendeskTicketId: mockResTicketLegal.ticketId,
				status: "open",
			} as unknown as SupportRequests);

			fetch.mockResolvedValueOnce(createFetchResponse({ message: undefined }));
			fetch.mockResolvedValueOnce(
				createFetchResponse({ message: mockMatchLegal })
			);
		});

		afterAll(() => {
			mockReset(mockedDb);
			vi.resetAllMocks();
		});

		it("should return legal match info", async () => {
			const request = new NextRequest(
				new Request("http://localhost:3000/handle-request", {
					method: "POST",
					body: JSON.stringify(mockPayloadLegal),
				})
			);

			const response = await POST(request);

			expect(response.status).toStrictEqual(200);
			expect(await response.json()).toStrictEqual({
				legal: { supportRequestId: mockMatchLegal.supportRequestId },
			});
		});

		it("should call validateAndUpsertZendeskTicket with the old ticketId to generate a new ticket", () => {
			expect(mockValidateAndUpsertZendeskTicket).toHaveBeenCalledWith(
				expect.objectContaining({
					ticketId: mockResCheckEligibilityClosedTicketLegal.zendeskTicketId,
					status: "pending",
					statusAcolhimento: "solicitação_recebida",
					supportType: "legal",
				})
			);
		});

		it("should update existing support request with new zendeskTicketId and status open", () => {
			//não cria novo registro, atualiza o existente para evitar violação de unique constraint
			expect(mockedDb.supportRequests.update).toHaveBeenCalledWith({
				where: {
					supportRequestId:
						mockResCheckEligibilityClosedTicketLegal.supportRequestId,
				},
				data: {
					zendeskTicketId: mockResTicketLegal.ticketId,
					status: "open",
				},
			});
		});

		it("should NOT create a new support request on db when ticket was closed", () => {
			expect(mockedDb.supportRequests.create).not.toHaveBeenCalled();
		});

		it("should call match lambda /sign endpoint", () => {
			expect(fetch).toHaveBeenNthCalledWith(1, `${MATCH_LAMBDA_URL}/sign`, {
				method: "GET",
			});
		});

		it("should call handle-match lambda with the existing supportRequestId and new zendeskTicketId", () => {
			const bodyHandleMatchLegal = {
				supportRequest: {
					...bodyComposeLegal,
					supportRequestId:
						mockResCheckEligibilityClosedTicketLegal.supportRequestId,
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
	});
});
