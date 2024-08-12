import * as Yup from "yup";
import {
	db,
	getErrorMessage,
	statusOnGoingMatch,
	statusSupportRequestisAlreadyInQueue,
	statusSupportRequestOngoingSocialWorker,
} from "../../lib";
import { MSRPiiSec, SupportType } from "@prisma/client";

type MsrSearchResponse = {
	psychological?: {
		supportRequestId: number | null;
		shouldCreateMatch: boolean;
	};
	legal?: {
		supportRequestId: number | null;
		shouldCreateMatch: boolean;
	};
};

const payloadSchema = Yup.object({
	email: Yup.string().email().required(),
	supportType: Yup.string().oneOf(Object.values(SupportType)).required(),
}).required();

async function checkMatchEligibility(
	supportType: SupportType,
	msrId?: MSRPiiSec["msrId"]
) {
	if (!msrId) {
		return {
			supportRequestId: null,
			shouldCreateMatch: true,
		};
	}

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
		},
	});

	if (ongoingMatch) {
		return {
			supportRequestId: ongoingMatch.supportRequestId,
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
		},
	});

	if (!supportRequest) {
		return {
			supportRequestId: null,
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
		shouldCreateMatch: !hasOngoingSupport,
	};
}

export async function POST(request: Request) {
	try {
		const payload = await request.json();
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

		let matchEligibilityResponse: MsrSearchResponse = {};
		const supportType: SupportType = payload.supportType;
		matchEligibilityResponse[supportType] = await checkMatchEligibility(
			supportType,
			msr?.msrId
		);

		return Response.json(matchEligibilityResponse);
	} catch (e) {
		const error = e as Record<string, unknown>;
		if (error["name"] === "ValidationError") {
			const errorMsg = `Validation error: ${getErrorMessage(error)}`;

			return new Response(errorMsg, {
				status: 400,
			});
		}

		return new Response(getErrorMessage(error), {
			status: 500,
		});
	}
}
