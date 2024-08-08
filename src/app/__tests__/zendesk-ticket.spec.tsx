import { NextRequest } from "next/server";
import { POST } from "../zendesk/ticket/route";
import * as createOrUpdateTicket from "../../lib/zendesk/createOrUpdateTicket";

const mockcreateOrUpdateTicket = vi.spyOn(createOrUpdateTicket, "default");
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
	statusAcolhimento: "solicitação_repitida",
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
	custom_fields: [
		{ id: 360014379412, value: mockPayloadUpdate.statusAcolhimento },
	],
};

describe("POST /zendesk/ticket", () => {
	it("returns error when dont have a valid payload", async () => {
		const request = new NextRequest(
			new Request("http://localhost:3000/zendesk/ticket", {
				method: "POST",
				body: JSON.stringify(""),
			})
		);
		const response = await POST(request);
		expect(response.status).toEqual(500);
		expect(await response.text()).toEqual("Error: Body is empty");
	});

	it("should create new zendesk ticket with payload", async () => {
		mockcreateOrUpdateTicket.mockResolvedValueOnce({
			ticket: {
				id: 1234,
			},
		});

		const request = new NextRequest(
			new Request("http://localhost:3000/zendesk/ticket", {
				method: "POST",
				body: JSON.stringify(mockPayloadCreate),
			})
		);
		const response = await POST(request);
		expect(response.status).toEqual(200);
		expect(mockcreateOrUpdateTicket).toHaveBeenCalledWith(mockCreateTicket);
		expect(await response.json()).toEqual({ ticketId: 1234 });
	});

	it("should update zendesk ticket with payload", async () => {
		mockcreateOrUpdateTicket.mockResolvedValueOnce({
			ticket: {
				id: 5678,
			},
		});
		const request = new NextRequest(
			new Request("http://localhost:3000/zendesk/ticket", {
				method: "POST",
				body: JSON.stringify(mockPayloadUpdate),
			})
		);
		const response = await POST(request);
		expect(response.status).toEqual(200);
		expect(mockcreateOrUpdateTicket).toHaveBeenCalledWith(mockUpdateTicket);
		expect(await response.json()).toEqual({ ticketId: 5678 });
	});
});
