import { NextRequest } from "next/server";
import {
	LEGAL_ZENDESK_TICKET_ID,
	PSYCHOLOGICAL_ZENDESK_TICKET_ID,
} from "../helpers/constants";
import initDB from "../helpers/init-db";
import insertSupportRequests from "../helpers/insert-support-requests";
import { POST } from "../../../app/handle-request/route";
import msrPayload from "@/lib/__mocks__/payloads";
import { db } from "@/lib";

describe("/handle-request", async () => {
	beforeEach(async () => {
		await initDB();
	});

	describe("msr registers asking for legal support, already having a ongoing request for psychological support", () => {
		it("should create match for legal support", async () => {
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
			expect(response.status).toEqual(200);
			expect(await response.json()).toEqual({ legal: "waiting_contact" });
		});
	});

	describe("msr registers asking for psychological support, already having a ongoing request for legal support", () => {
		it("should create match for psychological support", async () => {
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
			expect(response.status).toEqual(200);
			expect(await response.json()).toEqual({
				psychological: "waiting_contact",
			});
		});
	});

	describe("msr registers asking for legal and psychological support, already having a ongoing request for psychological support with status `encaminhamento realizado`", () => {
		it("should create match for legal support and update psychological support to duplicated", async () => {
			const supportRequest = {
				supportType: "psychological" as const,
				status: "matched" as const,
				zendeskTicketId: PSYCHOLOGICAL_ZENDESK_TICKET_ID as unknown as bigint,
				matchStatus: "waiting_contact" as const,
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
				where: { zendeskTicketId: PSYCHOLOGICAL_ZENDESK_TICKET_ID },
			});

			expect(response.status).toEqual(200);
			expect(await response.json()).toEqual({
				legal: "waiting_contact",
				psychological: "duplicated",
			});
			expect(supportRequestUpdated?.status).toEqual("duplicated");
		});
	});

	describe("msr registers asking for legal and psychological support, already having a expered legal support", () => {
		it("should create match for both support requests", async () => {
			const supportRequest = {
				supportType: "legal" as const,
				status: "matched" as const,
				zendeskTicketId: LEGAL_ZENDESK_TICKET_ID as unknown as bigint,
				matchStatus: "expired" as const,
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

			expect(response.status).toEqual(200);
			expect(await response.json()).toEqual({
				legal: "waiting_contact",
				psychological: "waiting_contact",
			});
		});
	});

	describe("msr registers asking for legal and psychological support, already having a ongoing legal support with status `atendimento: iniciado`", () => {
		it("should create match for psychological support and update legal support to duplicated", async () => {
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

			expect(response.status).toEqual(200);
			expect(await response.json()).toEqual({
				legal: "duplicated",
				psychological: "waiting_contact",
			});
			expect(supportRequestUpdated?.status).toEqual("duplicated");
		});
	});
});
