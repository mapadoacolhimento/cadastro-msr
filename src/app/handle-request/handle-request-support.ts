import { type CreateMatch } from "./route";
import {
	colorOptions,
	employmentStatusOptions,
	familyProviderOptions,
	genderIdentityOptions,
	legalActionDifficultyOptions,
	legalActionsTakenOptions,
	livesWithPerpetratorOptions,
	monthlyIncomeOptions,
	monthlyIncomeRangeOptions,
	perpetratorGenderOptions,
	protectiveFactorsOptions,
	riskFactorsOptions,
	violenceLocationOptions,
	violencePerpetratorOptions,
	violenceTimeOptions,
	violenceTypeOptions,
} from "@/lib/constants";

type Option = {
	value: string | number;
	name?: string;
	label?: string;
};

const escapeHtml = (value: string) =>
	value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");

const formatBoolean = (value: boolean | null | undefined) => {
	if (value === null || value === undefined) return "Não informado";
	return value ? "Sim" : "Não";
};

const getOptionLabel = (
	options: Option[],
	value: string | number | null | undefined
) => {
	if (value === null || value === undefined || value === "") {
		return "Não informado";
	}

	return (
		options.find((option) => option.value === value)?.name ??
		options.find((option) => option.value === value)?.label ??
		String(value)
	);
};

const getOptionLabels = (
	options: Option[],
	values: (string | number)[] | null | undefined
) => {
	if (!values?.length) return "Não informado";

	return values
		.map(
			(value) =>
				options.find((option) => option.value === value)?.name ??
				options.find((option) => option.value === value)?.label ??
				String(value)
		)
		.join(", ");
};

const row = (label: string, value: string | null) =>
	`<li><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value ?? "Não informado")}</li>`;

export const buildZendeskInternalComment = (
	msr: CreateMatch["msr"] & {
		gender?: string;
		color?: string;
		monthlyIncome?: string | null;
		monthlyIncomeRange?: number | null;
		familyProvider?: string | null;
		perpetratorGender?: string | null;
		livesWithPerpetrator?: string | null;
		violenceTime?: string | null;
		violenceType?: string[];
		violencePerpetrator?: string[];
		violenceLocation?: string[];
		legalActionsTaken?: string[];
		legalActionDifficulty?: string[];
		protectiveFactors?: string[];
		riskFactors?: string[];
	},
	subjectSupportType: string
) => `
<p><strong>Nova solicitação de acolhimento ${escapeHtml(
	subjectSupportType.toLowerCase()
)}</strong></p>

<p><strong>Dados gerais</strong></p>
<ul>
    ${row("Gênero", getOptionLabel(genderIdentityOptions, msr.gender))}
    ${row("Raça/cor", getOptionLabel(colorOptions, msr.color))}
    ${row("Possui deficiência", formatBoolean(msr.hasDisability))}
    ${row("Aceita atendimento online", formatBoolean(msr.acceptsOnlineSupport))}
</ul>
<br>
<p><strong>Dados socioeconômicos</strong></p>
<ul>
    ${row("Situação de trabalho", getOptionLabel(employmentStatusOptions, msr.employmentStatus))}
    ${row("Possui renda?", getOptionLabel(monthlyIncomeOptions, msr.monthlyIncome))}
    ${row("Faixa de renda mensal", getOptionLabel(monthlyIncomeRangeOptions, msr.monthlyIncomeRange))}
    ${row("Possui dependentes financeiros", formatBoolean(msr.hasFinancialDependents))}
    ${row("Responsável financeira da casa", getOptionLabel(familyProviderOptions, msr.familyProvider))}
    ${row("Possui imóvel", formatBoolean(msr.propertyOwnership))}
</ul>
<br>
<p><strong>Histórico de violência</strong></p>
<ul>
    ${row("Tipos de violência", getOptionLabels(violenceTypeOptions, msr.violenceType))}
    ${row("Tempo da violência", getOptionLabel(violenceTimeOptions, msr.violenceTime))}
    ${row("Gênero da pessoa agressora", getOptionLabel(perpetratorGenderOptions, msr.perpetratorGender))}
    ${row("Pessoa agressora", getOptionLabels(violencePerpetratorOptions, msr.violencePerpetrator))}
    ${row("Convive com a pessoa agressora", getOptionLabel(livesWithPerpetratorOptions, msr.livesWithPerpetrator))}
    ${row("Local da violência", getOptionLabels(violenceLocationOptions, msr.violenceLocation))}
    ${row("Medidas legais adotadas", getOptionLabels(legalActionsTakenOptions, msr.legalActionsTaken))}
    ${row("Dificuldades encontradas", getOptionLabels(legalActionDifficultyOptions, msr.legalActionDifficulty))}
    ${row("Fatores de proteção", getOptionLabels(protectiveFactorsOptions, msr.protectiveFactors))}
    ${row("Fatores de risco", getOptionLabels(riskFactorsOptions, msr.riskFactors))}
</ul>`;
