"use server";

import { getSupportRequestData } from "@/lib";
import { MatchNotFound, MatchFound } from "@/components/SupportRequestStatus";

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
				try {
					return await getSupportRequestData(Number(supportRequestId));
				} catch {
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
