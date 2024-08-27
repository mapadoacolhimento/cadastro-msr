import { db } from "@/lib";

export default async () => {
	await db.$transaction([
		db.mSRPiiSec.deleteMany(),
		db.mSRStatusHistory.deleteMany(),
		db.mSRs.deleteMany(),
		db.matches.deleteMany(),
		db.supportRequestStatusHistory.deleteMany(),
		db.supportRequests.deleteMany(),
		db.volunteers.deleteMany(),
	]);
};
