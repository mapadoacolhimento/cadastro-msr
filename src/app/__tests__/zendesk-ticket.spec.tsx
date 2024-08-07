import { NextRequest } from "next/server";
import { POST } from "../zendesk/ticket/route";
import * as createTicket from "../../lib/zendesk/createTicket";
import * as updateManyTickets from "../../lib/zendesk/updateManyTickets";

const mockcreateTicket = vi.spyOn(createTicket, "default");
const mockUpdateManyTickets = vi.spyOn(updateManyTickets, "default");
const mockPayloadCreate = {
	msrZendeskUserID: 12345678,
	msrName: "Sol",
	phone: "19999999999",
	city: "CAMPINAS",
	state: "SP",
	neighborhood: "Vila Santa Isabel",
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
		mockcreateTicket.mockResolvedValue({
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
		expect(mockcreateTicket).toHaveBeenCalled();
		expect(await response.json()).toEqual({ ticketId: 1234 });
	});

	it("should update zendesk ticket with payload", async () => {
		mockUpdateManyTickets.mockResolvedValue({
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
		expect(mockUpdateManyTickets).toHaveBeenCalled();
		expect(await response.json()).toEqual({ ticketId: 5678 });
	});
});
