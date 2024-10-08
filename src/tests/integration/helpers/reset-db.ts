import { db } from "@/lib";

export default function resetDb() {
	return [
		db.mSRStatusHistory.deleteMany(),
		db.mSRPiiSec.deleteMany(),
		db.mSRs.deleteMany(),
		db.matchStatusHistory.deleteMany(),
		db.matches.deleteMany(),
		db.supportRequestStatusHistory.deleteMany(),
		db.supportRequests.deleteMany(),
		db.volunteerStatusHistory.deleteMany(),
		db.volunteerAvailability.deleteMany(),
		db.volunteers.deleteMany(),
	];
}
