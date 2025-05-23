import { expect } from "vitest";
import { NextRequest } from "next/server";
import {
	LEGAL_ZENDESK_TICKET_ID,
	PSYCHOLOGICAL_ZENDESK_TICKET_ID,
} from "../helpers/constants";
import initDB from "../helpers/init-db";
import insertSupportRequests from "../helpers/insert-support-requests";
import { POST } from "../../../app/handle-request/route";
import { msrPayload } from "@/tests/unit/payloads";
import { db } from "@/lib";
import resetDb from "../helpers/reset-db";

const mockMatchLegalNew = {
	matchId: 3456,
	supportRequestId: 1,
	msrZendeskTicketId: 1234,
	supportType: "legal",
	status: "waiting_contact",
};

const mockMatchPsychologicalNew = {
	matchId: 3456,
	supportRequestId: 1,
	msrZendeskTicketId: 1234,
	supportType: "psychological",
	status: "waiting_contact",
};

describe("/handle-request", async () => {
	beforeEach(async () => {
		await db.$transaction(resetDb());
	});

	describe("MSR registers asking for LEGAL support, already having an ongoing PSYCHOLOGICAL support", () => {
		it("should create match for LEGAL support", async () => {
			await db.$transaction(initDB());
			const supportRequest = {
				supportType: "psychological" as const,
				status: "social_worker" as const,
				zendeskTicketId: PSYCHOLOGICAL_ZENDESK_TICKET_ID as unknown as bigint,
			};

			insertSupportRequests([supportRequest]);

			const mockPayloadLegal = msrPayload({
				supportType: ["legal"],
				email: "msr.dev.mapa@gmail.com",
			});

			const request = new NextRequest(
				new Request("http://localhost:3000/db/handle-request", {
					method: "POST",
					body: JSON.stringify(mockPayloadLegal),
				})
			);

			const response = await POST(request);
			expect(response.status).toStrictEqual(200);
			expect(await response.json()).toStrictEqual({
				legal: { supportRequestId: mockMatchLegalNew.supportRequestId },
			});
		});
	});

	describe("MSR registers asking for PSYCHOLOGICAL support, already having an ongoing LEGAL support", () => {
		it("should create match for PSYCHOLOGICAL support", async () => {
			await db.$transaction(initDB());

			const supportRequest = {
				supportType: "legal" as const,
				status: "matched" as const,
				zendeskTicketId: LEGAL_ZENDESK_TICKET_ID as unknown as bigint,
				matchStatus: "in_contact" as const,
			};
			insertSupportRequests([supportRequest]);

			const mockPayload = msrPayload({
				supportType: ["psychological"],
				email: "msr.dev.mapa@gmail.com",
			});

			const request = new NextRequest(
				new Request("http://localhost:3000/db/handle-request", {
					method: "POST",
					body: JSON.stringify(mockPayload),
				})
			);

			const response = await POST(request);
			expect(response.status).toStrictEqual(200);
			expect(await response.json()).toStrictEqual({
				psychological: {
					supportRequestId: mockMatchPsychologicalNew.supportRequestId,
				},
			});
		});
	});

	describe("MSR registers asking for LEGAL and PSYCHOLOGICAL support, already having a ongoing request for PSYCHOLOGICAL support with status 'Encaminhamento: Realizado para Serviço Público'", () => {
		it("should create match for both support requests", async () => {
			await db.$transaction(initDB());

			const supportRequest = {
				supportType: "psychological" as const,
				status: "public_service" as const,
				zendeskTicketId: PSYCHOLOGICAL_ZENDESK_TICKET_ID as unknown as bigint,
			};
			const newPsySupportRequest = await insertSupportRequests([
				supportRequest,
			]);

			const mockPayload = msrPayload({
				supportType: ["psychological", "legal"],
				email: "msr.dev.mapa@gmail.com",
			});

			const request = new NextRequest(
				new Request("http://localhost:3000/db/handle-request", {
					method: "POST",
					body: JSON.stringify(mockPayload),
				})
			);

			const response = await POST(request);

			expect(response.status).toStrictEqual(200);
			expect(await response.json()).toStrictEqual({
				legal: { supportRequestId: mockMatchLegalNew.supportRequestId },
				psychological: {
					supportRequestId: newPsySupportRequest[0].supportRequestId,
				},
			});
		});
	});

	describe("MSR registers asking for LEGAL and PSYCHOLOGICAL support, already having a ongoing request for PSYCHOLOGICAL support with status 'Encaminhamento: Realizado'", () => {
		it("should create match for LEGAL support and update PSYCHOLOGICAL support to 'duplicated'", async () => {
			await db.$transaction(initDB());

			const supportRequest = {
				supportType: "psychological" as const,
				status: "matched" as const,
				zendeskTicketId: PSYCHOLOGICAL_ZENDESK_TICKET_ID as unknown as bigint,
				matchStatus: "waiting_contact" as const,
			};
			const newPsySupportRequest = await insertSupportRequests([
				supportRequest,
			]);

			const mockPayload = msrPayload({
				supportType: ["psychological", "legal"],
				email: "msr.dev.mapa@gmail.com",
			});

			const request = new NextRequest(
				new Request("http://localhost:3000/db/handle-request", {
					method: "POST",
					body: JSON.stringify(mockPayload),
				})
			);

			const response = await POST(request);
			const supportRequestUpdated = await db.supportRequests.findFirst({
				where: { zendeskTicketId: PSYCHOLOGICAL_ZENDESK_TICKET_ID },
			});

			expect(response.status).toStrictEqual(200);
			expect(await response.json()).toStrictEqual({
				legal: { supportRequestId: mockMatchLegalNew.supportRequestId },
				psychological: {
					supportRequestId: newPsySupportRequest[0].supportRequestId,
				},
			});
			expect(supportRequestUpdated?.status).toStrictEqual("duplicated");
		});
	});

	describe("MSR registers asking for LEGAL and PSYCHOLOGICAL support, already having an expired LEGAL support", () => {
		it("should create match for both support requests", async () => {
			await db.$transaction(initDB());

			const supportRequest = {
				supportType: "legal" as const,
				status: "matched" as const,
				zendeskTicketId: LEGAL_ZENDESK_TICKET_ID as unknown as bigint,
				matchStatus: "expired" as const,
			};
			const newLegalSupportRequest = await insertSupportRequests([
				supportRequest,
			]);

			const mockPayload = msrPayload({
				supportType: ["psychological", "legal"],
				email: "msr.dev.mapa@gmail.com",
			});

			const request = new NextRequest(
				new Request("http://localhost:3000/db/handle-request", {
					method: "POST",
					body: JSON.stringify(mockPayload),
				})
			);

			const response = await POST(request);

			expect(response.status).toStrictEqual(200);
			expect(await response.json()).toStrictEqual({
				legal: { supportRequestId: newLegalSupportRequest[0].supportRequestId },
				psychological: {
					supportRequestId: mockMatchPsychologicalNew.supportRequestId,
				},
			});
		});
	});

	describe("MSR registers asking for LEGAL and PSYCHOLOGICAL support, already having a ongoing LEGAL support with status 'Atendimento: Iniciado'", () => {
		it("should create match for PSYCHOLOGICAL support and update LEGAL support to 'duplicated'", async () => {
			await db.$transaction(initDB());

			const supportRequest = {
				supportType: "legal" as const,
				status: "matched" as const,
				zendeskTicketId: LEGAL_ZENDESK_TICKET_ID as unknown as bigint,
				matchStatus: "in_contact" as const,
			};
			insertSupportRequests([supportRequest]);

			const mockPayload = msrPayload({
				supportType: ["psychological", "legal"],
				email: "msr.dev.mapa@gmail.com",
			});

			const request = new NextRequest(
				new Request("http://localhost:3000/db/handle-request", {
					method: "POST",
					body: JSON.stringify(mockPayload),
				})
			);

			const response = await POST(request);
			const supportRequestUpdated = await db.supportRequests.findFirst({
				where: { zendeskTicketId: LEGAL_ZENDESK_TICKET_ID },
			});

			expect(response.status).toStrictEqual(200);
			expect(await response.json()).toStrictEqual({
				legal: { supportRequestId: supportRequestUpdated?.supportRequestId },
				psychological: {
					supportRequestId: mockMatchPsychologicalNew.supportRequestId,
				},
			});
			expect(supportRequestUpdated?.status).toStrictEqual("duplicated");
		});
	});
});
