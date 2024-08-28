import * as Yup from "yup";
import { SupportType } from "@prisma/client";
import {
	db,
	statusOnGoingMatch,
	statusSupportRequestisAlreadyInQueue,
	statusSupportRequestOngoingSocialWorker,
} from "@/lib";

const payloadSchema = Yup.object({
	email: Yup.string().email().required(),
	supportType: Yup.string().oneOf(Object.values(SupportType)).required(),
}).required();

export default async function checkMatchEligibility(
	payload: Yup.InferType<typeof payloadSchema>
) {
	await payloadSchema.validate(payload);

	const msr = await db.mSRPiiSec.findUnique({
		where: {
			email: payload.email,
		},
		select: {
			msrId: true,
			email: true,
		},
	});

	if (!msr) {
		return {
			supportRequestId: null,
			zendeskTicketId: null,
			shouldCreateMatch: true,
		};
	}

	const supportType: SupportType = payload.supportType;
	const msrId = msr.msrId;

	const ongoingMatch = await db.matches.findFirst({
		where: {
			msrId: msrId,
			status: { in: statusOnGoingMatch },
			supportType: supportType,
		},
		orderBy: {
			createdAt: "desc",
		},
		select: {
			supportRequestId: true,
			status: true,
			supportType: true,
			msrZendeskTicketId: true,
		},
	});

	if (ongoingMatch) {
		return {
			supportRequestId: ongoingMatch.supportRequestId,
			zendeskTicketId: ongoingMatch.msrZendeskTicketId,
			shouldCreateMatch: false,
		};
	}

	const supportRequest = await db.supportRequests.findFirst({
		where: {
			msrId: msrId,
			supportType,
			status: { not: "duplicated" },
		},
		orderBy: {
			createdAt: "asc",
		},
		select: {
			supportRequestId: true,
			status: true,
			supportType: true,
			zendeskTicketId: true,
		},
	});

	if (!supportRequest) {
		return {
			supportRequestId: null,
			zendeskTicketId: null,
			shouldCreateMatch: true,
		};
	}

	const statusOngoingSupportRequest: string[] = [
		...statusSupportRequestisAlreadyInQueue,
		...statusSupportRequestOngoingSocialWorker,
	];
	const hasOngoingSupport = statusOngoingSupportRequest.includes(
		supportRequest.status
	);

	return {
		supportRequestId: supportRequest.supportRequestId,
		zendeskTicketId: supportRequest.zendeskTicketId,
		shouldCreateMatch: !hasOngoingSupport,
	};
}
