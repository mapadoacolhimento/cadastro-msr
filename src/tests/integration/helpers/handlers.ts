import { http, HttpResponse } from "msw";
import { MATCH_LAMBDA_URL, ZENDESK_SUBDOMAIN } from "@/lib";
import {
	MSR_ZENDESK_USER_ID,
	PSYCHOLOGICAL_ZENDESK_TICKET_ID,
	LEGAL_ZENDESK_TICKET_ID,
} from "./constants";

export const handlers = [
	http.post(`${ZENDESK_SUBDOMAIN}/api/v2/users/create_or_update`, () => {
		return HttpResponse.json({
			user: { id: MSR_ZENDESK_USER_ID },
		});
	}),

	http.post(`${ZENDESK_SUBDOMAIN}/api/v2/tickets/`, () => {
		return HttpResponse.json({
			ticket: { id: 1234 },
		});
	}),

	http.put(
		`${ZENDESK_SUBDOMAIN}/api/v2/tickets/${PSYCHOLOGICAL_ZENDESK_TICKET_ID}`,
		() => {
			return HttpResponse.json({
				ticket: { id: PSYCHOLOGICAL_ZENDESK_TICKET_ID },
			});
		}
	),

	http.put(
		`${ZENDESK_SUBDOMAIN}/api/v2/tickets/${LEGAL_ZENDESK_TICKET_ID}`,
		() => {
			return HttpResponse.json({
				ticket: { id: LEGAL_ZENDESK_TICKET_ID },
			});
		}
	),

	http.get(`${MATCH_LAMBDA_URL}/sign`, () => {
		return HttpResponse.json({
			message: "secret",
		});
	}),

	http.post(`${MATCH_LAMBDA_URL}/compose`, async (request) => {
		const body: any = await request.request.json();
		return HttpResponse.json({
			message: [
				{
					matchId: 3456,
					supportRequestId: 1,
					msrZendeskTicketId: body[0]?.zendeskTicketId,
					supportType: body[0]?.supportType,
					status: "waiting_contact",
				},
			],
		});
	}),

	http.post(`${MATCH_LAMBDA_URL}/handle-match`, async (request) => {
		const body: any = await request.request.json();
		return HttpResponse.json({
			message: {
				matchId: 3456,
				supportRequestId: 1,
				msrZendeskTicketId: body?.supportRequest.zendeskTicketId,
				supportType: body?.supportRequest.supportType,
				status: "waiting_contact",
			},
		});
	}),
];
