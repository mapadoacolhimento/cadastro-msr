import { db } from "@/lib";
import {
	THERAPIST_ZENDESK_USER_ID,
	LAWYER_ZENDESK_USER_ID,
	MSR_ZENDESK_USER_ID,
	THERAPIST_ZENDESK_TICKET_ID,
	LAWYER_ZENDESK_TICKET_ID,
} from "./constants";
import {
	MatchStatus,
	SupportRequestsStatus,
	SupportType,
	SupportRequests,
} from "@prisma/client";
import { getErrorMessage } from "@/utils";

type SupportRequestsInfo = {
	status: SupportRequestsStatus;
	supportType: SupportType;
	zendeskTicketId: SupportRequests["zendeskTicketId"];
	matchStatus?: MatchStatus;
};

export default async function insertSupportRequests(
	supportRequests: SupportRequestsInfo[]
) {
	try {
		for (let i = 0; supportRequests.length > i; i++) {
			const { zendeskTicketId, supportType, status, matchStatus } =
				supportRequests[i];
			const supportRequest = await db.supportRequests.create({
				data: {
					msrId: MSR_ZENDESK_USER_ID,
					zendeskTicketId: zendeskTicketId,
					supportType: supportType,
					priority: null,
					supportExpertise: null,
					hasDisability: null,
					requiresLibras: null,
					acceptsOnlineSupport: true,
					lat: -23.55242,
					lng: -46.65735,
					city: "SAO PAULO",
					state: "SP",
					status: status,
				},
			});

			if (matchStatus) {
				const volunteer = await db.volunteers.findFirst({
					where: {
						zendeskUserId:
							supportType === "legal"
								? LAWYER_ZENDESK_USER_ID
								: THERAPIST_ZENDESK_USER_ID,
					},
				});
				await db.matches.create({
					data: {
						msrId: MSR_ZENDESK_USER_ID,
						volunteerId: volunteer?.id,
						msrZendeskTicketId: zendeskTicketId,
						volunteerZendeskTicketId:
							supportType === "legal"
								? LAWYER_ZENDESK_TICKET_ID
								: THERAPIST_ZENDESK_TICKET_ID,
						supportType: supportType,
						matchType: "msr",
						matchStage: "ideal",
						status: matchStatus,
						supportRequestId: supportRequest.supportRequestId,
					},
				});
			}
		}
	} catch (error) {
		console.log(
			`[integration-tests]: Error while creating support requests or matches: ${getErrorMessage(error)}`
		);
	}
}
