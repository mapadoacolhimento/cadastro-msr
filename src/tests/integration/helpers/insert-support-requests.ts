import { db } from "@/lib";
import {
	THERAPIST_ZENDESK_USER_ID,
	LAWYER_ZENDESK_USER_ID,
	MSR_ZENDESK_USER_ID,
} from "./constants";
import {
	MatchStatus,
	SupportRequestsStatus,
	SupportType,
	SupportRequests,
} from "@prisma/client";

type SupportRequestsInfo = {
	status: SupportRequestsStatus;
	supportType: SupportType;
	zendeskTicketId: SupportRequests["zendeskTicketId"];
	matchStatus?: MatchStatus;
};

export default async function insertSupportRequests(
	supportRequests: SupportRequestsInfo[]
) {
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
					volunteerZendeskTicketId: Math.ceil(Math.random()),
					supportType: supportType,
					matchType: "msr",
					matchStage: "ideal",
					status: matchStatus,
					supportRequestId: supportRequest.supportRequestId,
				},
			});
		}
	}
}
