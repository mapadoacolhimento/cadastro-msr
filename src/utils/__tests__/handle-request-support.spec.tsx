import { describe, it, expect, vi, beforeEach } from "vitest";
import { validateAndUpsertZendeskTicket } from "@/lib";
import * as lib from "@/lib";
import {
	ZENDESK_CUSTOM_FIELDS_DICIO,
	ZENDESK_MSR_ORGANIZATION_ID,
} from "@/constants";

const mockUpsertZendeskTicket = vi.spyOn(lib, "upsertZendeskTicket");

describe("validateAndUpsertZendeskTicket", () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it("should create a ticket with html_body comment", async () => {
		mockUpsertZendeskTicket.mockResolvedValueOnce({
			ticketId: 1234,
		} as never);

		await validateAndUpsertZendeskTicket({
			ticketId: null,
			msrZendeskUserId: 123456,
			subject: "[Jurídico] Maria, Salvador - BA",
			status: "pending",
			statusAcolhimento: "solicitação_recebida",
			supportType: "legal",
			msrName: "Maria",
			comment: {
				html_body: "<p><strong>Teste HTML</strong></p>",
				public: false,
			},
		});

		expect(mockUpsertZendeskTicket).toHaveBeenCalledWith({
			requester_id: 123456,
			subject: "[Jurídico] Maria, Salvador - BA",
			organization_id: ZENDESK_MSR_ORGANIZATION_ID,
			status: "pending",
			comment: {
				html_body: "<p><strong>Teste HTML</strong></p>",
				public: false,
			},
			custom_fields: [
				{
					id: ZENDESK_CUSTOM_FIELDS_DICIO.nomeMsr,
					value: "Maria",
				},
				{
					id: ZENDESK_CUSTOM_FIELDS_DICIO.statusAcolhimento,
					value: "solicitação_recebida",
				},
			],
		});
	});

	it("should update a ticket with html_body comment", async () => {
		mockUpsertZendeskTicket.mockResolvedValueOnce({
			ticketId: 5678,
		} as never);

		await validateAndUpsertZendeskTicket({
			ticketId: 5678,
			msrZendeskUserId: 123456,
			subject: "[Psicológico] Maria, Salvador - BA",
			status: "open",
			statusAcolhimento: "solicitação_recebida",
			supportType: "psychological",
			msrName: "Maria",
			comment: {
				html_body: "<p><strong>Atualização HTML</strong></p>",
				public: false,
			},
		});

		expect(mockUpsertZendeskTicket).toHaveBeenCalledWith({
			id: 5678,
			requester_id: 123456,
			subject: "[Psicológico] Maria, Salvador - BA",
			organization_id: ZENDESK_MSR_ORGANIZATION_ID,
			status: "open",
			comment: {
				html_body: "<p><strong>Atualização HTML</strong></p>",
				public: false,
			},
			custom_fields: [
				{
					id: ZENDESK_CUSTOM_FIELDS_DICIO.nomeMsr,
					value: "Maria",
				},
				{
					id: ZENDESK_CUSTOM_FIELDS_DICIO.statusAcolhimento,
					value: "solicitação_recebida",
				},
			],
		});
	});

	it("should not include empty optional fields", async () => {
		mockUpsertZendeskTicket.mockResolvedValueOnce({
			ticketId: 9999,
		} as never);

		await validateAndUpsertZendeskTicket({
			ticketId: 9999,
			supportType: "legal",
			comment: {
				html_body: "<p>Teste</p>",
				public: false,
			},
		} as never);

		expect(mockUpsertZendeskTicket).toHaveBeenCalledWith(
			expect.objectContaining({
				id: 9999,
				comment: {
					html_body: "<p>Teste</p>",
					public: false,
				},
			})
		);
	});

	it("should throw validation error when comment.html_body is missing", async () => {
		await expect(
			validateAndUpsertZendeskTicket({
				ticketId: null,
				msrZendeskUserId: 123456,
				subject: "[Jurídico] Maria, Salvador - BA",
				status: "pending",
				statusAcolhimento: "solicitação_recebida",
				supportType: "legal",
				msrName: "Maria",
				comment: {
					public: false,
				},
			} as never)
		).rejects.toThrow();
	});
});
