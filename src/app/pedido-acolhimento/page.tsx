"use server";

import { getSupportRequestData } from "@/lib";
import { NoMatchFound, MatchFound } from "@/components/SupportRequestStatus";

export default async function Page({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
	const { psychologicalSupportRequestId, legalSupportRequestId } =
		await searchParams;

	const supportRequests = await Promise.all(
		[psychologicalSupportRequestId, legalSupportRequestId].map(
			async (supportRequestId) => {
				if (!supportRequestId) return null;
				return await getSupportRequestData(Number(supportRequestId));
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
			{!hasVolunteer ? (
				<NoMatchFound supportRequests={validSupportRequests} />
			) : (
				<MatchFound supportRequests={validSupportRequests} />
			)}
		</>
	);
}
