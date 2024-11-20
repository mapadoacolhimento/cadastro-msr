import * as Yup from "yup";
import { Strong } from "@radix-ui/themes";

import Step from "../../Step";
import RadioInput from "../../../RadioInput";
import { propertyOwnershipOptions } from "@/constants";
import { Values } from "@/types";

const propertyOwnershipSchema = Yup.object({
	propertyOwnership: Yup.string()
		.oneOf(propertyOwnershipOptions.map((a) => a.value))
		.required("Esse campo é obrigatório."),
});

export default function PropertyOwnership() {
	async function handleSubmit(values: Values) {
		const isPaidMoreThanThreeMinWages = values.monthlyIncomeRange > 3;
		const hasProperty = values.propertyOwnership === "yes";
		const hasAccessToIncome = values.monthlyIncome === "yes";

		if (isPaidMoreThanThreeMinWages && hasAccessToIncome && hasProperty) {
			return {
				redirectTo: "/fora-criterios",
			};
		}
	}

	return (
		<Step
			validationSchema={propertyOwnershipSchema}
			title={"Sobre sua renda"}
			img={{
				src: "/illustrations/notebook.webp",
				alt: "Ilustração de um caderno, um lápis amarelo e alguns clips",
			}}
			onSubmit={handleSubmit}
		>
			<RadioInput
				name="propertyOwnership"
				options={propertyOwnershipOptions}
				question={
					<>
						Você possui <Strong>bens imóveis (casa, apartamento)</Strong> em seu
						nome?
					</>
				}
			/>
		</Step>
	);
}
