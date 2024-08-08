import * as Yup from "yup";
import { Strong } from "@radix-ui/themes";

import Step from "../Step";
import RadioInput from "../../RadioInput";
import CheckboxInfo from "../../CheckboxInfo";
import { financialNeedOptions } from "../../../lib";
import type { Values } from "..";

const financialNeedSchema = Yup.object({
	financialNeed: Yup.string()
		.oneOf(financialNeedOptions.map((a) => a.value))
		.required("Esse campo é obrigatório."),
	terms: Yup.boolean().oneOf([true], "Você deve marcar este campo."),
});

export default function FinancialNeed() {
	async function handleSubmit(values: Values) {
		const hasNoFinancialVulnerability = values.financialNeed === "no";
		if (hasNoFinancialVulnerability) {
			return {
				redirectTo: "/fora-criterios",
			};
		}
	}
	return (
		<Step
			onSubmit={handleSubmit}
			validationSchema={financialNeedSchema}
			title={"Sobre sua renda"}
			img={{
				src: "/illustrations/notebook.svg",
				alt: "Ilustração de um caderno, um lápis amarelo e alguns clips",
			}}
		>
			<RadioInput
				name="financialNeed"
				options={financialNeedOptions}
				question={
					<>
						Você declara que <Strong>não pode pagar</Strong> por atendimento
						jurídico/psicológico?
					</>
				}
			/>
			<CheckboxInfo name="terms">
				Ao inserir seus dados, você concorda em ter seus dados compartilhados
				com os organizadores dessa página e aceita receber emails de
				atualização, conforme descrito na{" "}
				<a
					href="https://queroseracolhida.mapadoacolhimento.org/static/politica-de-privacidade.pdf"
					target="_blank"
				>
					política de privacidade
				</a>
				. Você pode cancelar o recebimento desses e-mails a qualquer momento.
			</CheckboxInfo>
		</Step>
	);
}
