import {
	Gender,
	MatchStatus,
	Race,
	SupportRequestsStatus,
} from "@prisma/client";

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
	{ value: Race.black, label: "Preta" },
	{ value: Race.brown, label: "Parda" },
	{ value: Race.indigenous, label: "Indígena" },
	{ value: Race.yellow, label: "Amarela" },
	{ value: Race.white, label: "Branca" },
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
	{ value: Gender.cis_woman, name: "Eu sou uma mulher cis" },
	{
		value: Gender.trans_woman,
		name: "Eu sou uma mulher trans/travesti",
	},
	{
		value: "not_woman",
		name: "Não me identifico como mulher",
	},
];

export const genderViolenceOptions = [
	{ value: "yes", name: "Sim, sofro ou sofri violência" },
	{
		value: "no",
		name: "Não, não sofro ou sofri violência",
	},
];

export const violenceLocationOptions = [
	{ value: "yes", name: "Sim, dentro do território brasileiro" },
	{
		value: "no",
		name: "Não, aconteceu em outro país",
	},
];

export const externalSupportOptions = [
	{
		value: "privateTherapist",
		name: "Estou sendo acompanhada por um(a) psicólogo(a) particular",
	},
	{
		value: "privateLawyer",
		name: "Estou sendo acompanhada por um(a) advogado(a) particular",
	},
	{
		value: "publicDefender",
		name: "Estou sendo acompanhada na defensoria pública/NUDEM",
	},
	{
		value: "no",
		name: "Não estou sendo acompanhada",
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

export const ZENDESK_MSR_ORGANIZATION_ID = 360273031591;

export const GOOGLE_ANALYTICS_ID = "G-H4HVJY8T0V";

export const ZENDESK_NEW_USER_STATUS = "inscrita";
export const ZENDESK_NEW_TICKET_STATUS = "solicitação_recebida";
export const ZENDESK_DUPLICATED_TICKET_STATUS = "solicitação_repetida";

export const monthlyIncomeOptions = [
	{ value: "yes", name: "Sim" },
	{
		value: "no",
		name: "Não",
	},
	{
		value: "noAccess",
		name: "Estou sem acesso a minha renda",
	},
];

export const monthlyIncomeRangeOptions = [
	{ value: 0.5, name: "Até meio salário mínimo (R$660,00)" },
	{ value: 1, name: "Até um salário mínimo (R$1.320,00)" },
	{ value: 2, name: "Até dois salários mínimos (R$2.640,00)" },
	{ value: 3, name: "Até três salários mínimos (R$3.960,00)" },
	{ value: 4, name: "Até quatro salários mínimos (R$5.280,00)" },
	{ value: 5, name: "Cinco salários mínimos ou mais (R$6.600,00 ou mais)" },
];

export const employmentStatusOptions = [
	{
		value: "employedClt",
		name: "Trabalhadora com carteira de trabalho assinada",
	},
	{
		value: "employedPj",
		name: "Trabalhadora sem carteira de trabalho assinada",
	},
	{ value: "student", name: "Estudante e dependente da minha família" },
	{ value: "studentWithIncome", name: "Estudante e com renda independente" },
	{ value: "retired", name: "Aposentada" },
	{ value: "unemployed", name: "Desempregada" },
];

export const dependantsOptions = [
	{ value: "yes", name: "Sim" },
	{
		value: "no",
		name: "Não",
	},
];

export const familyProviderOptions = [
	{ value: "yes", name: "Sim" },
	{
		value: "no",
		name: "Não",
	},
];

export const propertyOwnershipOptions = [
	{ value: "yes", name: "Sim" },
	{
		value: "no",
		name: "Não",
	},
];

export const violenceTypeOptions = [
	{
		value: "physicalViolence",
		name: "Violência física",
		description: "Ex: tapas, empurrões, socos",
		fullDescription:
			"Soco, chute, tapa, empurrão, puxão de cabelo, queimadura, enforcamento, sufocamento, tiro, afogamento, facada, paulada, estrangulamento ou sufocamento, espancamento, atirar objetos, sacudir e apertar os braços, lesões com objetos cortantes ou perfurantes, ferimentos causados por queimaduras ou armas de fogo, tortura.",
	},
	{
		value: "psychologicalViolence",
		name: "Violência psicológica",
		description: "Ex: manipulação, controle emocional",
		fullDescription:
			"Ameaças, constrangimento, humilhação, manipulação, isolamento (proibir de estudar, trabalhar, viajar, ir ao médico, falar com amigos e parentes, etc.), chantagem, limitação do direito de ir e vir, tirar a liberdade de crença, distorcer e omitir fatos para deixar você em dúvida sobre a sua memória e sanidade (gaslighting), controle, críticas, insultos, desrespeito com a sua identidade, proibir de usar certos tipos de roupa.",
	},
	{
		value: "sexualViolence",
		name: "Violência sexual",
		description: "Ex: abuso sexual, coerção, assédio",
		fullDescription:
			"Impedir o uso de métodos contraceptivos ou forçar a abortar; impedir você de usar preservativo, se negar a usar preservativo durante a relação sexual com você; forçar ao matrimônio, gravidez ou prostituição por meio de coação, chantagem, suborno ou manipulação; limitar ou anular o exercício dos seus direitos sexuais e/ou reprodutivos; forçar à alguma prática sexual na intenção de corrigir sua orientação sexual; exigir práticas sexuais que você não gosta ou se sente desconfortável; em seu ambiente de trabalho, ser forçada à alguma conduta que gerou constrangimento e/ou violou sua liberdade sexual (essa opção vale para condutas de natureza sexual manifestadas fisicamente, ou por palavras, ou gestos ou outros meios no ambiente de trabalho).",
	},
	{
		value: "digitalViolence",
		name: "Violência digital",
		description: "Ex: cyberbullying, invasão de privacidade",
		fullDescription:
			"Vazar/compartilhar na internet suas informações pessoais,dados ou imagens íntimas sem seu consentimento; Stalking online (perseguição ou observação obsessiva).",
	},
	{
		value: "patrimonialViolence",
		name: "Violência patrimonial",
		description: "Ex: destruição de bens, controle financeiro",
		fullDescription:
			"Controlar seu dinheiro, destruir seus objetos, destruir seus documentos pessoais, ocultar bens e propriedades, impedir de ter acesso ao dinheiro, à conta bancária ou outros bens, extorsão,danos propositais a objetos que você gosta.",
	},
	{
		value: "obstetricViolence",
		name: "Violência obstétrica",
		description: "Ex: tratamento desrespeitoso no parto",
		fullDescription:
			"Alterar o processo natural do parto sem seu consentimento voluntário, abusos e maus-tratos durante a gestação e/ou no momento do parto.",
	},
	{
		value: "threat",
		name: "Ameaça",
		description: "Ex: intimidações, promessas de agressão",
		fullDescription:
			"Ameaçar, agredir, violentar sexualmente, matar, ou qualquer outro mal grave; perseguir pessoalmente pelos lugares por onde você vai.",
	},
	{
		value: "politicalViolence",
		name: "Violência política contra a mulher",
		description: "Ex: restrição de direitos políticos",
		fullDescription:
			"Ação ou omissão com a finalidade de impedir, criar obstáculos ou restringir seus direitos políticos por ser mulher; sofrer distinção, exclusão ou restrição no reconhecimento, gozo ou exercício dos seus direitos e liberdades políticas fundamentais, em virtude do gênero.",
	},
];
