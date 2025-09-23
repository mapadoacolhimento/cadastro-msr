import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	const MSR_ZENDESK_USER_ID = 22858077211028;
	const PSYCHOLOGICAL_ZENDESK_TICKET_ID = 82261;
	const LEGAL_ZENDESK_TICKET_ID = 82262;
	const THERAPIST_ZENDESK_USER_ID = 417544904932;

	const city = await prisma.cities.create({
		data: {
			city_value: "SAO PAULO",
			city_label: "SÃO PAULO",
			state: "SP",
			ibge_code: 123,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		},
	});
	const therapistVolunteer = await prisma.volunteers.create({
		data: {
			condition: "disponivel",
			firstName: "Teste Psi",
			lastName: "Local",
			email: "dev.psi.mapa@gmail.com",
			phone: "11911991199",
			zipcode: "01303020",
			state: "SP",
			city: "SAO PAULO",
			neighborhood: "Centro",
			latitude: -23.55242,
			longitude: -46.65735,
			registrationNumber: "123123123",
			birth_date: new Date("1999-01-02"),
			color: "black",
			gender: "cis_female",
			modality: "not_found",
			fields_of_work: "not_found",
			years_of_experience: "5_ou_mais",
			approach: "not_found",
			occupation: "psychologist",
			moodle_id: null,
			form_entries_id: null,
			zendeskUserId: THERAPIST_ZENDESK_USER_ID,
			availability: 3,
			offers_libras_support: true,
			street: "Rua da Consolação",
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		},
	});
	const psychologicalSupportRequest = await prisma.supportRequests.create({
		data: {
			msrId: MSR_ZENDESK_USER_ID,
			zendeskTicketId: PSYCHOLOGICAL_ZENDESK_TICKET_ID,
			supportType: "psychological",
			priority: null,
			supportExpertise: null,
			requiresLibras: null,
			acceptsOnlineSupport: true,
			lat: -23.55242,
			lng: -46.65735,
			city: "SAO PAULO",
			state: "SP",
			status: "matched",
		},
	});
	const psychologicalMatch = await prisma.matches.create({
		data: {
			supportRequestId: psychologicalSupportRequest.supportRequestId,
			msrId: MSR_ZENDESK_USER_ID,
			volunteerId: therapistVolunteer.id,
			msrZendeskTicketId: psychologicalSupportRequest.zendeskTicketId,
			supportType: "psychological",
			matchType: "msr",
			matchStage: "ideal",
			status: "waiting_contact",
		},
	});
	const legalSupportRequest = await prisma.supportRequests.create({
		data: {
			msrId: MSR_ZENDESK_USER_ID,
			zendeskTicketId: LEGAL_ZENDESK_TICKET_ID,
			supportType: "legal",
			priority: null,
			supportExpertise: null,
			requiresLibras: null,
			acceptsOnlineSupport: true,
			lat: -23.55242,
			lng: -46.65735,
			city: "SAO PAULO",
			state: "SP",
			status: "duplicated",
		},
	});

	console.log({
		city,
		psychologicalSupportRequest,
		legalSupportRequest,
		therapistVolunteer,
		psychologicalMatch,
	});
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})

	.catch(async (e) => {
		console.error(e);

		await prisma.$disconnect();

		process.exit(1);
	});
