import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();


const THERAPIST_ZENDESK_USER_ID = 417544904932;
const LAWYER_ZENDESK_USER_ID = 423092711812;

const insertMsrCase = async (email, msrZendeskUserId, supportRequests) => {

	const msr = await prisma.mSRs.create({

		data: {
			msrId: msrZendeskUserId,
			gender: "cis_woman",
			raceColor: "black",
			hasDisability: null,
			acceptsOnlineSupport: true,
			neighborhood: "Barra funda",
			city: "SAO PAULO",
			state: "SP",
			zipcode: "01153000",
			status: "registered",
		},
	});
	
	const msrPiiSec = await prisma.mSRPiiSec.create({
		data: {
			msrId: msrZendeskUserId,
			firstName: "Joana",
			email: email,
			phone: "11999999999",
			dateOfBirth: null
		},
	});

	console.log(msr, msrPiiSec);

	for (let i = 0; supportRequests.length > i; i++) {

		const { zendeskTicketId, supportType, status, match } = supportRequests[i]
		const sp = await prisma.supportRequests.create({
			data: {
				msrId: msrZendeskUserId,
				zendeskTicketId: zendeskTicketId,
				supportType: supportType,
				priority: null,
				supportExpertise: null,
				hasDisability: null,
				requiresLibras: null,
				acceptsOnlineSupport: true,
				lat: -23.55242,
				lng: -46.65735,
				city: "SAO PAULO",
				state: "SP",
				status: status,
			},
		});

		console.log(sp)

		if (match) {

			const m = await prisma.matches.create({
				data: {
					msrId: msrZendeskUserId,

					volunteer: { connect: match.volunteer},
					msrZendeskTicketId: zendeskTicketId,
					volunteerZendeskTicketId: match.volunteerZendeskTicketId,
					supportType: supportType,
					matchType: "msr",
					matchStage: "ideal",
					status: match.status,
					supportRequest: {
						     connect: sp
					}
				}
			});

			console.log(m)
		}

	}

}

async function main() {
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

	console.log({
		city,
	});

	const therapistVolunteer = await prisma.volunteers.create({
		data: {
			condition: 'disponivel',
			firstName: 'Teste Psi',
			lastName: 'Local',
			email: 'dev.psi@gmail.com',
			phone: '11911991199',
			zipcode: '01303020',
			state: 'SP',
			city: 'SAO PAULO',
			neighborhood: 'Centro',
			latitude: -23.55242,
			longitude: -46.65735,
			registrationNumber: '123123123',
			birth_date: new Date('1999-01-02'),
			color: 'black',
			gender: 'cis_female',
			modality: 'not_found',
			fields_of_work: 'not_found',
			years_of_experience: '5_ou_mais',
			approach: 'not_found',
			occupation: 'psychologist',
			moodle_id: null,
			form_entries_id: null,
			zendeskUserId: THERAPIST_ZENDESK_USER_ID,
			availability: 3,
			offers_libras_support: true,
			street: 'Rua da Consolação',
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		},
	});
	const therapistVolunteerAvailability =
		await prisma.volunteerAvailability.create({
			data: {
				volunteer_id: therapistVolunteer.id,
				current_matches: 0,
				max_matches: 3,
				is_available: true,
				support_type: 'psychological',
				support_expertise: 'not_found',
				offers_online_support: true,
				lat: -23.55242,
				lng: -46.65735,
				city: 'SAO PAULO',
				state: 'SP',
				offers_libras_support: false,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			},
		});
	const lawyerVolunteer = await prisma.volunteers.create({
		data: {
			condition: 'disponivel',
			firstName: 'Teste Advogada',
			lastName: 'Local',
			email: 'dev.adv@gmail.com',
			phone: '11911991199',
			zipcode: '01303020',
			state: 'SP',
			city: 'SAO PAULO',
			neighborhood: 'Centro',
			latitude: -23.55242,
			longitude: -46.65735,
			registrationNumber: '123123123',
			birth_date: new Date('1999-01-02'),
			color: 'black',
			gender: 'cis_female',
			modality: 'not_found',
			fields_of_work: 'not_found',
			years_of_experience: '5_ou_mais',
			approach: 'not_found',
			occupation: 'lawyer',
			moodle_id: null,
			form_entries_id: null,
			zendeskUserId: LAWYER_ZENDESK_USER_ID,
			availability: 3,
			offers_libras_support: true,
			street: 'Rua da Consolação',
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		},
	});
	const lawyerVolunteerAvailability =
		await prisma.volunteerAvailability.create({
			data: {
				volunteer_id: lawyerVolunteer.id,
				current_matches: 0,
				max_matches: 3,
				is_available: true,
				support_type: 'legal',
				support_expertise: 'not_found',
				offers_online_support: true,
				lat: -23.55242,
				lng: -46.65735,
				city: 'SAO PAULO',
				state: 'SP',
				offers_libras_support: true,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			},
		});

	//Fazer cadastro pedindo acolhimento jurídico, já tendo um pedido de acolhimento psicológico
	insertMsrCase("msr1@gmail.com", 123456780, [{
		zendeskTicketId: 1111,
		supportType: "psychological",
		status: "open",
		match: null
	}]);

	//Fazer cadastro pedindo acolhimento psicológico, já tendo um pedido de acolhimento jurídico
	insertMsrCase("msr2@gmail.com", 123456781, [{
		zendeskTicketId: 2222,
		supportType: "legal",
		status: "social_worker",
		match: null
	}]);
	//Fazer cadastro pedindo acolhimento jurídico e psicológico, sendo que já tem um match psicológico com status do acolhimento "encaminhamento: realizado”
	insertMsrCase("msr3@gmail.com", 123456782, [{
		zendeskTicketId: 3333,
		supportType: "psychological",
		status: "matched",
		match: {
			volunteer: therapistVolunteer,
			volunteerZendeskTicketId: 3334,
			status: "waiting_contact"
		}
	}]);

	//Fazer cadastro pedindo acolhimento jurídico e psicológico, sendo que já teve um match jurídico que expirou
	insertMsrCase("msr4@gmail.com", 123456783, [{
		zendeskTicketId: 4444,
		supportType: "legal",
		status: "matched",
		match: {
			volunteer: lawyerVolunteer,
			volunteerZendeskTicketId: 4445,
			status: "expired"
		}
	}]);

	//Fazer cadastro pedindo acolhimento jurídico e psicológico, sendo que tem um match jurídico com status do acolhimento "atendimento: iniciado”

	insertMsrCase("msr5@gmail.com", 123456784, [{
		zendeskTicketId: 5555,
		supportType: "legal",
		status: "matched",
		match: {
			volunteer: lawyerVolunteer,
			volunteerZendeskTicketId: 4445,
			status: "in_contact"
		}
	}]);
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
