import {
	Gender,
	MatchStatus,
	Race,
	SupportRequestsStatus,
	EmploymentStatus,
	FamilyProvider,
	ViolenceType,
	ViolenceTime,
	ViolencePerpetrator,
	ViolenceLocation,
	LegalActionDifficulty,
	LegalActionsTaken,
	ProtectiveFactor,
	RiskFactor,
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

export const acceptsOnlineSupportOptions = [
	{
		value: "yes",
		name: "Sim, aceito ser atendida online",
	},
	{
		value: "no",
		name: "Não, só posso receber atendimento presencial",
	},
];

export const supportTypeOptions = [
	{
		name: "Acolhimento psicológico",
		value: "psychological",
		description: "Suporte emocional e fortalecimento ",
	},
	{
		name: "Acolhimento jurídico",
		value: "legal",
		description: "Orientação legal e encaminhamento ",
	},
];

export const genderIdentityOptions = [
	{
		value: Gender.cis_woman,
		name: "Eu sou uma mulher cis",
	},
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
	{
		value: "yes",
		name: "Sim, sofro ou sofri violência",
	},
	{
		value: "no",
		name: "Não, não sofro ou sofri violência",
	},
];

export const violenceOccurredInBrazilOptions = [
	{
		value: "yes",
		name: "Sim, dentro do território brasileiro",
	},
	{
		value: "no",
		name: "Não, aconteceu em outro país",
	},
];

export const externalSupportOptions = [
	{
		value: "private_therapist",
		name: "Estou sendo acompanhada por um(a) psicólogo(a) particular",
	},
	{
		value: "private_lawyer",
		name: "Estou sendo acompanhada por um(a) advogado(a) particular",
	},
	{
		value: "public_defender",
		name: "Estou sendo acompanhada na defensoria pública/NUDEM",
	},
	{
		value: "no",
		name: "Não estou sendo acompanhada",
	},
];

export const financialNeedOptions = [
	{
		value: "yes",
		name: "Sim",
	},
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
export const statusSupportRequestDuplicated = [
	SupportRequestsStatus.duplicated,
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
	{
		value: "yes",
		name: "Sim",
	},
	{
		value: "no",
		name: "Não",
	},
	{
		value: "no_access",
		name: "Estou sem acesso a minha renda",
	},
];

export const monthlyIncomeRangeOptions = [
	{ value: 0, name: "Não possuo renda" },
	{ value: 0.5, name: "Até meio salário mínimo (R$810,00)" },
	{ value: 1, name: "Até um salário mínimo (R$1.621,00)" },
	{ value: 2, name: "Até dois salários mínimos (R$3.242,00)" },
	{ value: 3, name: "Até três salários mínimos (R$4.863,00)" },
	{ value: 4, name: "Até quatro salários mínimos (R$6.484,00)" },
	{ value: 5, name: "Cinco salários mínimos ou mais (R$8.105,00 ou mais)" },
];

export const employmentStatusOptions = [
	{
		value: EmploymentStatus.employed_clt,
		name: "Trabalhadora com carteira de trabalho assinada",
	},
	{
		value: EmploymentStatus.employed_pj,
		name: "Trabalhadora sem carteira de trabalho assinada",
	},
	{
		value: EmploymentStatus.student,
		name: "Estudante e dependente da minha família",
	},
	{
		value: EmploymentStatus.student_with_income,
		name: "Estudante e com renda independente",
	},
	{
		value: EmploymentStatus.retired,
		name: "Aposentada",
	},
	{
		value: EmploymentStatus.unemployed,
		name: "Desempregada",
	},
];

export const dependantsOptions = [
	{
		value: "yes",
		name: "Sim",
	},
	{
		value: "no",
		name: "Não",
	},
];

export const familyProviderOptions = [
	{
		value: FamilyProvider.yes,
		name: "Sim",
	},
	{
		value: FamilyProvider.no,
		name: "Não",
	},
	{
		value: FamilyProvider.shared_responsibility,
		name: "Divido a responsabilidade financeira da casa com alguém",
	},
];

export const propertyOwnershipOptions = [
	{
		value: "yes",
		name: "Sim",
	},
	{
		value: "no",
		name: "Não",
	},
];

export const violenceTypeOptions = [
	{
		value: ViolenceType.physical_violence,
		name: "Violência física",
		description: "Ex: tapas, empurrões, socos",
		fullDescription:
			"Soco, chute, tapa, empurrão, puxão de cabelo, queimadura, enforcamento, sufocamento, tiro, afogamento, facada, paulada, estrangulamento ou sufocamento, espancamento, atirar objetos, sacudir e apertar os braços, lesões com objetos cortantes ou perfurantes, ferimentos causados por queimaduras ou armas de fogo, tortura.",
	},
	{
		value: ViolenceType.psychological_violence,
		name: "Violência psicológica",
		description: "Ex: manipulação, controle emocional",
		fullDescription:
			"Ameaças, constrangimento, humilhação, manipulação, isolamento (proibir de estudar, trabalhar, viajar, ir ao médico, falar com amigos e parentes, etc.), chantagem, limitação do direito de ir e vir, tirar a liberdade de crença, distorcer e omitir fatos para deixar você em dúvida sobre a sua memória e sanidade (gaslighting), controle, críticas, insultos, desrespeito com a sua identidade, proibir de usar certos tipos de roupa.",
	},
	{
		value: ViolenceType.sexual_violence,
		name: "Violência sexual",
		description: "Ex: abuso sexual, assédio, importunação",
		fullDescription:
			"Impedir o uso de métodos contraceptivos ou forçar a abortar; impedir você de usar preservativo, se negar a usar preservativo durante a relação sexual com você; forçar ao matrimônio, gravidez ou prostituição por meio de coação, chantagem, suborno ou manipulação; limitar ou anular o exercício dos seus direitos sexuais e/ou reprodutivos; forçar à alguma prática sexual na intenção de corrigir sua orientação sexual; exigir práticas sexuais que você não gosta ou se sente desconfortável; em seu ambiente de trabalho, ser forçada à alguma conduta que gerou constrangimento e/ou violou sua liberdade sexual (essa opção vale para condutas de natureza sexual manifestadas fisicamente, ou por palavras, ou gestos ou outros meios no ambiente de trabalho).",
	},
	{
		value: ViolenceType.moral_violence,
		name: "Violência Moral",
		description: "Ex: calúnia, injúria e difamação",
		fullDescription:
			"Se você está sendo (ou foi) acusada falsamente de ter cometido um crime; se alguém está atribuindo (ou atribuiu) a você algum fato ofensivo à sua reputação; ou se você está tendo (ou teve) sua dignidade afrontada com xingamentos ou palavras desonrosas.",
	},
	{
		value: ViolenceType.digital_violence,
		name: "Violência digital",
		description: "Ex: cyberbullying, invasão de privacidade",
		fullDescription:
			"Vazar/compartilhar na internet suas informações pessoais,dados ou imagens íntimas sem seu consentimento; Stalking online (perseguição ou observação obsessiva).",
	},
	{
		value: ViolenceType.patrimonial_violence,
		name: "Violência patrimonial",
		description: "Ex: destruição de bens, controle financeiro",
		fullDescription:
			"Controlar seu dinheiro, destruir seus objetos, destruir seus documentos pessoais, ocultar bens e propriedades, impedir de ter acesso ao dinheiro, à conta bancária ou outros bens, extorsão,danos propositais a objetos que você gosta.",
	},
	{
		value: ViolenceType.obstetric_violence,
		name: "Violência obstétrica",
		description: "Ex: tratamento desrespeitoso no parto",
		fullDescription:
			"Alterar o processo natural do parto sem seu consentimento voluntário, abusos e maus-tratos durante a gestação e/ou no momento do parto.",
	},
	{
		value: ViolenceType.threat,
		name: "Ameaça",
		description: "Ex: intimidações, promessas de agressão",
		fullDescription:
			"Ameaçar, agredir, violentar sexualmente, matar, ou qualquer outro mal grave; perseguir pessoalmente pelos lugares por onde você vai.",
	},
	{
		value: ViolenceType.political_violence,
		name: "Violência política contra a mulher",
		description: "Ex: restrição de direitos políticos",
		fullDescription:
			"Ação ou omissão com a finalidade de impedir, criar obstáculos ou restringir seus direitos políticos por ser mulher; sofrer distinção, exclusão ou restrição no reconhecimento, gozo ou exercício dos seus direitos e liberdades políticas fundamentais, em virtude do gênero.",
	},
	{
		value: ViolenceType.no_violence,
		name: "Não estou sofrendo violência/Não sofri violência",
		description: "    ",
	},
];

export const violenceTimeOptions = [
	{
		value: ViolenceTime.last_week,
		name: "Na última semana",
	},
	{
		value: ViolenceTime.less_than_3_months,
		name: "Há menos de 3 meses",
	},
	{
		value: ViolenceTime.between_3_months_and_1_year,
		name: "Entre 3 meses e 1 ano",
	},
	{
		value: ViolenceTime.between_1_and_3_years,
		name: "Entre 1 e 3 anos",
	},
	{
		value: ViolenceTime.between_3_and_6_years,
		name: "Entre 3 e 6 anos",
	},
	{
		value: ViolenceTime.between_6_and_10_years,
		name: "Entre 6 e 10 anos",
	},
	{
		value: ViolenceTime.more_than_10_years,
		name: "Há mais de 10 anos",
	},
];

export const perpetratorGenderOptions = [
	{
		value: "woman",
		name: "Mulher",
	},
	{
		value: "man",
		name: "Homem",
	},
	{
		value: "non_binary",
		name: "Pessoa não-binária",
	},
];

export const violencePerpetratorOptions = [
	{
		value: ViolencePerpetrator.nuclear_family,
		name: "Família Nuclear",
		description: "Pai, mãe, irmã(o), filho(a)",
	},
	{
		value: ViolencePerpetrator.close_family,
		name: "Familiar",
		description: "Tio(a), primo(a), cunhado(a)",
	},
	{
		value: ViolencePerpetrator.current_partner,
		name: "Parceiro(a) atual",
		description: "Namorado(a), marido/esposa",
	},
	{
		value: ViolencePerpetrator.ex_partner,
		name: "Ex-parceiro(a)",
		description: "Ex-namorado(a), ex-marido/esposa",
	},
	{
		value: ViolencePerpetrator.work_colleague,
		name: "Colega de trabalho",
		description: "Gestor(a), chefe",
	},
	{
		value: ViolencePerpetrator.other_people,
		name: "Outras pessoas",
		description: "Vizinho(a), amigo(a), outros(as)",
	},
];

export const livesWithPerpetratorOptions = [
	{
		value: "yes",
		name: "Sim",
	},
	{
		value: "no",
		name: "Não",
	},
	{
		value: "never",
		name: "Nunca morei com o(a) autor(a) da violência",
	},
];

export const violenceLocationOptions = [
	{
		value: ViolenceLocation.home_space,
		name: "Ambiente Doméstico",
	},
	{
		value: ViolenceLocation.public_space,
		name: "Ambiente Público",
	},
	{
		value: ViolenceLocation.work_space,
		name: "Ambiente de trabalho",
	},
	{
		value: ViolenceLocation.internet_space,
		name: "Internet/redes sociais",
	},
];

export const legalActionDifficultyOptions = [
	{
		value: LegalActionDifficulty.discouraged,
		name: "Desencorajou sob o argumento de inexistência criminosa",
	},
	{
		value: LegalActionDifficulty.not_competent,
		name: "Informou não ser de sua competência",
	},
	{
		value: LegalActionDifficulty.refused_to_register,
		name: "Negou-se a registrar a ocorrência",
	},
	{
		value: LegalActionDifficulty.no_access_to_justice,
		name: "Não viabilizou o acesso à justiça",
	},
	{
		value: LegalActionDifficulty.denied_restraining_order,
		name: "Negou o requerimento à medida protetiva",
	},
	{
		value: LegalActionDifficulty.not_applicable,
		name: "Não se aplica",
	},
];

export const legalActionsTakenOptions = [
	{
		value: LegalActionsTaken.physical_examination,
		name: "Exame de corpo delito (IML)",
	},
	{
		value: LegalActionsTaken.police_inquiry,
		name: "Inquérito Policial",
	},
	{
		value: LegalActionsTaken.criminal_case,
		name: "Processo penal/criminal",
	},
	{
		value: LegalActionsTaken.civil_case,
		name: "Processo cível/Direito de família",
	},
	{
		value: LegalActionsTaken.labour_case,
		name: "Processo trabalhista",
	},
	{
		value: LegalActionsTaken.police_report,
		name: "Registro de Ocorrência (B.O)",
	},
	{
		value: LegalActionsTaken.protective_measure,
		name: "Requerimento de Medida Protetiva (Delegacia de Polícia)",
	},
	{
		value: LegalActionsTaken.none_taken,
		name: "Não foi realizada nenhuma providência jurídica",
	},
];

export const protectiveFactorsOptions = [
	{
		value: ProtectiveFactor.support_network,
		name: "Possuo rede de apoio (familiares, amigos, vizinhos)",
	},
	{
		value: ProtectiveFactor.dont_live_with_perpetrator,
		name: "Não moro com o(a) autor(a) da violência",
	},
	{
		value: ProtectiveFactor.feels_safe,
		name: "Me sinto segura em casa",
	},
	{
		value: ProtectiveFactor.is_not_dependant,
		name: "Não dependo financeiramente do(a) autor(a) da violência",
	},
	{
		value: ProtectiveFactor.has_qualified_public_services,
		name: "O local onde moro possui serviços públicos de atendimento à mulher com atendimento qualificado",
	},
	{
		value: ProtectiveFactor.not_applicable,
		name: "Não se aplica",
	},
];

export const riskFactorsOptions = [
	{
		value: RiskFactor.gun_access,
		name: "O(A) autor(a) da violência possui acesso à arma de fogo",
	},
	{
		value: RiskFactor.private_captivity,
		name: "Estou em cárcere privado",
	},
	{
		value: RiskFactor.violence_during_pregnancy,
		name: "A violência ocorreu durante a gestação",
	},
	{
		value: RiskFactor.denied_public_services,
		name: "Tive acesso negado aos serviços públicos de atendimento à mulher",
	},
	{
		value: RiskFactor.no_support_network,
		name: "Não possuo rede de apoio (familiares, amigos, vizinhos etc)",
	},
	{
		value: RiskFactor.perpetrator_is_a_criminal,
		name: "O(A) autor(a) da violência tem envolvimento com o crime organizado",
	},
	{
		value: RiskFactor.perpetrator_is_imprisoned,
		name: "O(A) autor(a) da violência esteve ou está recluso no sistema prisional",
	},
	{
		value: RiskFactor.feels_isolated,
		name: "Me sinto isolada de amigos, familiares, pessoas da comunidade ou trabalho e/ou não consigo acessar pessoas de confiança que me ajudem em caso de uma violência sofrida",
	},
	{
		value: RiskFactor.other_risks,
		name: "O local onde moro apresenta outras situações de risco de violência (tráfico de mulheres, tráfico de drogas na região, disputa de território, exposição a ambiente de exploração sexual)",
	},
	{
		value: RiskFactor.needed_medical_attention,
		name: "Após algum episódio de agressão já necessitei de atendimento de saúde (atendimento médico; internação)",
	},
	{
		value: RiskFactor.not_applicable,
		name: "Não se aplica",
	},
];
