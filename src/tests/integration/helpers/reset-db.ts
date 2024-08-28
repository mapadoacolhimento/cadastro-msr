import { db } from "@/lib";

export default async function resetDb() {
	await db.$transaction([
		db.mSRStatusHistory.deleteMany(),
		db.mSRPiiSec.deleteMany(),
		db.mSRs.deleteMany(),
		db.matches.deleteMany(),
		db.supportRequestStatusHistory.deleteMany(),
		db.supportRequests.deleteMany(),
		db.volunteers.deleteMany(),
	]);
}
