import { MatchStatus, SupportRequestsStatus } from "@prisma/client";

export const BRAZILIAN_STATES_OPTIONS = [
	{ value: "AC", label: "Acre" },
	{ value: "AL", label: "Alagoas" },
	{ value: "AP", label: "Amapá" },
	{ value: "AM", label: "Amazonas" },
	{ value: "BA", label: "Bahia" },
	{ value: "CE", label: "Ceará" },
	{ value: "DF", label: "Distrito Federal" },
	{ value: "ES", label: "Espírito Santo" },
	{ value: "GO", label: "Goiás" },
	{ value: "MA", label: "Maranhão" },
	{ value: "MT", label: "Mato Grosso" },
	{ value: "MS", label: "Mato Grosso do Sul" },
	{ value: "MG", label: "Minas Gerais" },
	{ value: "PA", label: "Pará" },
	{ value: "PB", label: "Paraíba" },
	{ value: "PR", label: "Paraná" },
	{ value: "PE", label: "Pernambuco" },
	{ value: "PI", label: "Piauí" },
	{ value: "RJ", label: "Rio de Janeiro" },
	{ value: "RN", label: "Rio Grande do Norte" },
	{ value: "RS", label: "Rio Grande do Sul" },
	{ value: "RO", label: "Rondônia" },
	{ value: "RR", label: "Roraima" },
	{ value: "SC", label: "Santa Catarina" },
	{ value: "SP", label: "São Paulo" },
	{ value: "SE", label: "Sergipe" },
	{ value: "TO", label: "Tocantins" },
];

export const colorOptions = [
	{ value: "black", label: "Preta" },
	{ value: "brown", label: "Parda" },
	{ value: "indigenous", label: "Indígena" },
	{ value: "asian", label: "Amarela" },
	{ value: "white", label: "Branca" },
];

export const DISABILITY_OPTIONS = [
	{ value: "yes", label: "Sim" },
	{ value: "no", label: "Não" },
];

export const acceptsOnlineSupportOptions = [
	{ value: "yes", name: "Sim, aceito ser atendida online" },
	{
		value: "no",
		name: "Não, só posso receber atendimento presencial",
	},
];

export const supportTypeOptions = [
	{
		name: "Acolhimento psicológico",
		value: "psychological",
	},
	{
		name: "Acolhimento jurídico",
		value: "legal",
	},
];

export const genderIdentityOptions = [
	{ value: "cis_woman", name: "Eu sou uma mulher cis" },
	{
		value: "trans_woman",
		name: "Eu sou uma mulher trans/travesti",
	},
	{
		value: "no-woman",
		name: "Não me identifico como mulher",
	},
];

export const genderViolenceOptions = [
	{ value: "yes", name: "Sim" },
	{
		value: "no",
		name: "Não",
	},
];

export const violenceLocationOptions = [
	{ value: "yes", name: "Sim" },
	{
		value: "no",
		name: "Não",
	},
];

export const externalSupportOptions = [
	{ value: "yes", name: "Sim" },
	{
		value: "no",
		name: "Não",
	},
];

export const financialNeedOptions = [
	{ value: "yes", name: "Sim" },
	{
		value: "no",
		name: "Não",
	},
];

export const statusOnGoingMatch = [
	MatchStatus.waiting_contact,
	MatchStatus.in_contact,
];

export const statusSupportRequestOngoingSocialWorker = [
	SupportRequestsStatus.scheduled_social_worker,
	SupportRequestsStatus.social_worker,
];
export const statusSupportRequestisAlreadyInQueue = [
	SupportRequestsStatus.waiting_for_match,
	SupportRequestsStatus.waiting_for_match_with_priority,
];

export const ZENDESK_SUBDOMAIN = process.env["ZENDESK_SUBDOMAIN"];
export const ZENDESK_API_USER = `${process.env["ZENDESK_API_USER"]}/token`;
export const ZENDESK_API_TOKEN = process.env["ZENDESK_API_TOKEN"];
export const VOLUNTEER_API_URL = process.env["VOLUNTEER_API_URL"];
export const MATCH_LAMBDA_URL = process.env["MATCH_LAMBDA_URL"];
export const JWT_SECRET = process.env["JWT_SECRET"];
export const BASE_URL = process.env["PUBLIC_BASE_URL"];

export const ZENDESK_CUSTOM_FIELDS_DICIO = {
	nomeMsr: 360016681971,
	linkMatch: 360016631632,
	statusAcolhimento: 360014379412,
	dataEncaminhamento: 360017432652,
	nomeVoluntaria: 360016631592,
	estado: 360021879791,
	telefone: 360021812712,
	cidade: 360021879811,
};

export const msrOrganizationId = 360273031591 as unknown as bigint;
