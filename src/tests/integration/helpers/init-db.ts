import { db } from "@/lib";
import {
	THERAPIST_ZENDESK_USER_ID,
	LAWYER_ZENDESK_USER_ID,
	MSR_ZENDESK_USER_ID,
} from "./constants";
import {
	MonthlyIncomeRange,
	EmploymentStatus,
	FamilyProvider,
} from "@prisma/client";

const monthlyIncomeRangeMap: Record<number, MonthlyIncomeRange> = {
	0: MonthlyIncomeRange.no_income,
	0.5: MonthlyIncomeRange.half_minimum_wage,
	1: MonthlyIncomeRange.up_to_one_minimum_wage,
	2: MonthlyIncomeRange.up_to_two_minimum_wages,
	3: MonthlyIncomeRange.up_to_three_minimum_wages,
	4: MonthlyIncomeRange.up_to_four_minimum_wages,
	5: MonthlyIncomeRange.five_minimum_wages_or_more,
};
const mapMonthlyIncomeRange = (
	value?: number | null
): MonthlyIncomeRange | null => {
	if (value === null || value === undefined) {
		return null;
	}
	return monthlyIncomeRangeMap[value] ?? null;
};

export default function initDB() {
	return [
		db.volunteers.create({
			data: {
				condition: "disponivel",
				firstName: "Teste Psi",
				lastName: "Local",
				email: "dev.psi@gmail.com",
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
		}),
		db.volunteers.create({
			data: {
				condition: "disponivel",
				firstName: "Teste Advogada",
				lastName: "Local",
				email: "dev.adv@gmail.com",
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
				occupation: "lawyer",
				moodle_id: null,
				form_entries_id: null,
				zendeskUserId: LAWYER_ZENDESK_USER_ID,
				availability: 3,
				offers_libras_support: true,
				street: "Rua da Consolação",
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			},
		}),
		db.mSRs.create({
			data: {
				msrId: MSR_ZENDESK_USER_ID,
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
		}),
		db.mSRPiiSec.create({
			data: {
				msrId: MSR_ZENDESK_USER_ID,
				firstName: "Joana",
				email: "msr.dev.mapa@gmail.com",
				phone: "11999999999",
				dateOfBirth: null,
			},
		}),
		db.mSRSocioeconomicData.create({
			data: {
				msrId: MSR_ZENDESK_USER_ID,
				hasMonthlyIncome: "yes" as const,
				monthlyIncomeRange: mapMonthlyIncomeRange(1),
				employmentStatus: "employed_clt" as EmploymentStatus,
				hasFinancialDependents: false,
				familyProvider: "shared_responsibility" as FamilyProvider,
				propertyOwnership: false,
			},
		}),

		db.cities.create({
			data: {
				city_value: "SAO PAULO",
				city_label: "SÃO PAULO",
				state: "SP",
				ibge_code: 123,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			},
		}),
	];
}
