import { NextRequest } from "next/server";
import { POST } from "../zendesk/ticket/route";
import {
	ZENDESK_SUBDOMAIN,
	ZENDESK_API_TOKEN,
	ZENDESK_API_USER,
} from "@/constants";

const mockPayloadCreate = {
	msrZendeskUserId: 12345678,
	msrName: "Sol",
	subject: "[Jurídico] Sol, São Paulo - SP",
	status: "new",
	statusAcolhimento: "solicitação_recebida",
	supportType: "legal",
	comment: {
		body: "Gerado pelo cadastro",
		public: false,
	},
};
const mockPayloadUpdate = {
	ticketId: 5678,
	status: "open",
	supportType: "legal",
	comment: {
		body: "MSR tentou fazer pedido de acolhimento novamente",
		public: false,
	},
};

const mockCreateTicket = {
	requester_id: mockPayloadCreate.msrZendeskUserId,
	subject: mockPayloadCreate.subject,
	organization_id: 360273031591,
	status: mockPayloadCreate.status,
	comment: mockPayloadCreate.comment,
	custom_fields: [
		{ id: 360016681971, value: mockPayloadCreate.msrName },
		{ id: 360014379412, value: mockPayloadCreate.statusAcolhimento },
	],
};

const mockUpdateTicket = {
	id: mockPayloadUpdate.ticketId,
	organization_id: 360273031591,
	status: mockPayloadUpdate.status,
	comment: mockPayloadUpdate.comment,
};

const endpoint = `${ZENDESK_SUBDOMAIN}/api/v2/tickets/`;
const authorization =
	"Basic " +
	Buffer.from(`${ZENDESK_API_USER}:${ZENDESK_API_TOKEN}`).toString("base64");

describe("POST /zendesk/ticket", () => {
	it("returns error when have a empty payload", async () => {
		const request = new NextRequest(
			new Request("http://localhost:3000/zendesk/ticket", {
				method: "POST",
				body: JSON.stringify({}),
			})
		);
		const response = await POST(request);
		expect(response.status).toEqual(400);
		expect(await response.text()).toEqual(
			"Validation error: msrName is a required field"
		);
	});

	it("returns error when dont have any field to update just the ticketId", async () => {
		const request = new NextRequest(
			new Request("http://localhost:3000/zendesk/ticket", {
				method: "POST",
				body: JSON.stringify({
					ticketId: 1234,
				}),
			})
		);
		const response = await POST(request);
		expect(response.status).toEqual(400);
		expect(await response.text()).toEqual(
			"Validation error: Must have at least one field to update"
		);
	});

	it("should create new zendesk ticket with payload", async () => {
		fetch.mockResolvedValueOnce(Response.json({ ticket: { id: 1234 } }));
		const request = new NextRequest(
			new Request("http://localhost:3000/zendesk/ticket", {
				method: "POST",
				body: JSON.stringify(mockPayloadCreate),
			})
		);
		const response = await POST(request);
		expect(response.status).toEqual(200);
		expect(fetch).toHaveBeenCalledWith(endpoint, {
			body: JSON.stringify({ ticket: mockCreateTicket }),
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: authorization,
			},
		});
		expect(await response.json()).toEqual({ ticketId: 1234 });
	});

	it("should update zendesk ticket with payload", async () => {
		fetch.mockResolvedValueOnce(Response.json({ ticket: { id: 5678 } }));
		const request = new NextRequest(
			new Request("http://localhost:3000/zendesk/ticket", {
				method: "POST",
				body: JSON.stringify(mockPayloadUpdate),
			})
		);
		const response = await POST(request);
		expect(response.status).toEqual(200);
		expect(fetch).toHaveBeenCalledWith(`${endpoint}5678`, {
			body: JSON.stringify({ ticket: mockUpdateTicket }),
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: authorization,
			},
		});
		expect(await response.json()).toEqual({ ticketId: 5678 });
	});

	it("should return a error when createOrUpdateTicket return a error", async () => {
		fetch.mockRejectedValueOnce(new Error("Invalid body"));

		const request = new NextRequest(
			new Request("http://localhost:3000/zendesk/ticket", {
				method: "POST",
				body: JSON.stringify(mockPayloadCreate),
			})
		);
		const response = await POST(request);
		expect(response.status).toEqual(500);
		expect(await response.text()).toEqual("Unable to upsert ticket on Zendesk");
	});
});
