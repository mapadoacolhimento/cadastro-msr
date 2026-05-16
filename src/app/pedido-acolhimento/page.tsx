"use server";

import { getSupportRequestData, logger } from "@/lib";
import { MatchNotFound, MatchFound } from "@/components/SupportRequestStatus";
import getErrorMessage from "@/utils/getErrorMessage";

export default async function Page({
	searchParams,
}: Readonly<{
	searchParams: Promise<{ [key: string]: string | undefined }>;
}>) {
	const { psychologicalSupportRequestId, legalSupportRequestId } =
		await searchParams;

	const supportRequests = await Promise.all(
		[psychologicalSupportRequestId, legalSupportRequestId].map(
			async (supportRequestId) => {
				if (!supportRequestId) return null;

				logger.warn(`[SupportRequestStatusPage] - supportRequestId is missing or undefined`);

				try {
					return await getSupportRequestData(Number(supportRequestId));
				} catch(e) {
					
					logger.error(`[SupportRequestStatusPage] - getSupportRequestData failed for supportRequestId '${supportRequestId}': ${getErrorMessage(e)}`);

					return null;
				}
			}
		)
	);
	const validSupportRequests = supportRequests.filter(
		(supportRequest) => supportRequest !== null
	);

	if (validSupportRequests.length < 1) {
		return <div>Link inválido</div>;
	}

	const hasVolunteer = validSupportRequests.find(
		(result) => result.status === "matched"
	);

	return (
		<>
			{hasVolunteer ? (
				<MatchFound supportRequests={validSupportRequests} />
			) : (
				<MatchNotFound supportRequests={validSupportRequests} />
			)}
		</>
	);
}
