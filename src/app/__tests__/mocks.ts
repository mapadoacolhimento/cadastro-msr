import mockedDb from "../../lib/__mocks__/db";
import msrPayload from "../../lib/__mocks__/payloads";

const mockPayloadLegal = msrPayload({ supportType: ["legal"] });
const mockPayloadPsychlogical = msrPayload({ supportType: ["psychological"] });
const mockPayloadBoth = msrPayload({ supportType: ["legal", "psychological"] });

const mockResZendeskUser = {
	msrZendeskUserId: 12346789 as unknown as bigint,
};

const mockResMsr = {
	data: {
		msrId: 12346789 as unknown as bigint,
		status: "inscrita",
	},
};

const mockedsupportRequestsLegal = {
	supportRequestId: 1234,
};

const mockedsupportRequestsPsychological = {
	supportRequestId: 7890,
};

const mocksupportRequestStatusHistory = {
	supportRequestStatusHistoryId: 2,
};

const bodyCheckEligibilityLegal = {
	email: mockPayloadLegal.email,
	supportType: "legal",
};

const bodyCheckEligibilityPsychological = {
	email: mockPayloadPsychlogical.email,
	supportType: "psychological",
};

const mockResCheckEligibility = {
	supportRequestId: null,
	ticketId: null,
	shouldCreateMatch: true,
};

const mockResTicketLegal = {
	ticketId: 1234,
};

const mockResTicketPsychological = {
	ticketId: 7890,
};

const mockResCheckEligibilityLegal = {
	supportRequestId: 1234,
	ticketId: 1234,
	shouldCreateMatch: true,
};

const mockResCheckEligibilityPsychological = {
	supportRequestId: 5678,
	ticketId: 7890,
	shouldCreateMatch: false,
};

const mockResLambdaLegal = {
	matchId: 3456,
	supportRequestId: mockedsupportRequestsLegal.supportRequestId,
	msrId: 12346789 as unknown as bigint,
	volunteerId: 1,
	msrZendeskTicketId: mockResTicketLegal.ticketId,
	volunteerZendeskTicketId: 4567,
	supportType: "legal",
	createdAt: "2024-08-13",
	updatedAt: "2024-08-13",
	status: "matched",
};

const mockResLambdaPsychological = {
	...mockResLambdaLegal,
	supportType: "psychological",
	supportRequestId: mockedsupportRequestsLegal.supportRequestId,
	msrZendeskTicketId: mockResTicketLegal.ticketId,
	matchId: 3457,
	volunteerZendeskTicketId: 4568,
};

const bodyComposeLegal = {
	supportRequestId: null,
	msrId: mockPayloadLegal.msrZendeskUserId,
	zendeskTicketId: mockResTicketLegal.ticketId,
	supportType: "legal",
	status: "open",
	hasDisability: mockPayloadLegal.hasDisability,
	lat: mockPayloadLegal.lat,
	lng: mockPayloadLegal.lng,
	city: mockPayloadLegal.city,
	state: mockPayloadLegal.state,
};

const bodyHandleMatchLegal = {
	supportRequest: {
		...bodyComposeLegal,
		supportRequestId: mockResCheckEligibilityLegal.supportRequestId,
		zendeskTicketId: mockResTicketLegal.ticketId,
	},
};

const bodyMatchPsychological = {
	supportRequest: {
		...bodyComposeLegal,
		supportRequestId: mockResCheckEligibilityPsychological.supportRequestId,
		zendeskTicketId: mockResTicketPsychological.ticketId,
	},
};
