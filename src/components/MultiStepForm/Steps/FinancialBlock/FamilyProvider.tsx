import * as Yup from "yup";
import { Em, Strong } from "@radix-ui/themes";

import Step from "../../Step";
import RadioInput from "../../../RadioInput";
import { familyProviderOptions } from "@/constants";
import { Values } from "@/types";

const familyProviderSchema = Yup.object({
	familyProvider: Yup.string()
		.oneOf(familyProviderOptions.map((a) => a.value))
		.required("Esse campo é obrigatório."),
});

export default function FamilyProvider() {
	async function handleSubmit(values: Values) {
		const isPaidMoreThanThreeMinWages = values.monthlyIncomeRange > 3;
		const isNotHeadOfTheFamily = values.familyProvider === "no";
		const hasAccessToIncome = values.monthlyIncome === "yes";

		if (
			isPaidMoreThanThreeMinWages &&
			hasAccessToIncome &&
			isNotHeadOfTheFamily
		) {
			return {
				redirectTo: "/fora-criterios",
			};
		}
	}

	return (
		<Step
			validationSchema={familyProviderSchema}
			title={"Sobre sua renda"}
			img={{
				src: "/illustrations/mother-daughter-embrace.webp",
				alt: "Ilustração colorida de uma mãe abraçando a filha",
				align: "end",
				bottom: "50px",
			}}
			onSubmit={handleSubmit}
		>
			<RadioInput
				name="familyProvider"
				options={familyProviderOptions}
				question={
					<>
						Você é <Strong>responsável financeiramente</Strong> pela renda
						familiar (é considerada a &quot;<Em>chefe de família</Em>&quot;)?
					</>
				}
			/>
		</Step>
	);
}
