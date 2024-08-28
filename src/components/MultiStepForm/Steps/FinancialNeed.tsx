import * as Yup from "yup";
import { Strong } from "@radix-ui/themes";

import Step from "../Step";
import RadioInput from "../../RadioInput";
import { financialNeedOptions } from "@/constants";
import type { Values } from "@/types";

const financialNeedSchema = Yup.object({
	financialNeed: Yup.string()
		.oneOf(financialNeedOptions.map((a) => a.value))
		.required("Esse campo é obrigatório."),
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
		</Step>
	);
}
