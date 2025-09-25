import { MSRPiiSec, MSRs, SupportRequests } from "@prisma/client";

export function msrPayload(
	msr?: { supportType?: string[] } & Partial<
		Omit<SupportRequests, "supportType">
	> &
		Partial<MSRPiiSec> &
		Partial<MSRs>
) {
	return {
		msrZendeskUserId: 12346789 as unknown as bigint,
		email: "msr@email.br",
		phone: "71999999999",
		firstName: "Msr",
		city: "SALVADOR",
		state: "BA",
		neighborhood: "Bairro",
		zipcode: "not_found",
		color: "black",
		status: "registered",
		dateOfBirth: new Date("1994-09-31").toISOString(),
		gender: "not_found",
		hasDisability: null,
		acceptsOnlineSupport: true,
		lat: -12.995,
		lng: -38.504,
		supportType: ["legal", "psychological"],
		...msr,
	};
}
