import { NextRequest } from "next/server";
import { PSYCHOLOGICAL_ZENDESK_TICKET_ID } from "../helpers/constants";
import initDB from "../helpers/init-db";
import insertSupportRequests from "../helpers/insert-support-requests";
import { POST } from "../../../app/handle-request/route";
import msrPayload from "@/lib/__mocks__/payloads";

describe("/handle-request", async () => {
	beforeEach(async () => {
		await initDB();
	});

	describe("msr registers asking for legal support, already having a ongoing request for psychological support", () => {
		it("should create match for legal support", async () => {
			const supportRequest = {
				supportType: "psychological" as const,
				status: "matched" as const,
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
});
