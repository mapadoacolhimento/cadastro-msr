import { SupportRequests } from "@prisma/client";

export type HandleRequestResponse = {
	psychological?: Pick<SupportRequests, "supportRequestId">;
	legal?: Pick<SupportRequests, "supportRequestId">;
};
