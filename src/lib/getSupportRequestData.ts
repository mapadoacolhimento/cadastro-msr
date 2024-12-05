import type { Matches, SupportRequests } from "@prisma/client";
import { db } from ".";

async function getVolunteerFromMatch(matchId: Matches["matchId"]) {
	const { volunteer } = await db.matches.findFirstOrThrow({
		select: {
			volunteer: {
				select: {
					id: true,
					firstName: true,
					lastName: true,
					email: true,
					phone: true,
					registrationNumber: true,
					occupation: true,
					city: true,
					state: true,
				},
			},
		},
		where: {
			matchId,
		},
	});

	return volunteer;
}

export default async function getSupportRequestData(
	supportRequestId: SupportRequests["supportRequestId"]
) {
	const supportRequest = await db.supportRequests.findFirstOrThrow({
		select: {
			status: true,
			supportRequestId: true,
			supportType: true,
			Matches: {
				select: {
					matchId: true,
				},
				orderBy: {
					createdAt: "desc",
				},
			},
		},
		where: {
			supportRequestId,
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	const {
		status,
		Matches: [match],
	} = supportRequest;

	return {
		...supportRequest,
		volunteer:
			status === "matched" && match.matchId
				? await getVolunteerFromMatch(match.matchId)
				: null,
	};
}
