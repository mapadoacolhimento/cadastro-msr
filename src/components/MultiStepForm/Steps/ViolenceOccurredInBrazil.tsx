import * as Yup from "yup";
import { Strong } from "@radix-ui/themes";

import Step from "../Step";
import RadioInput from "../../RadioInput";
import { violenceOccurredInBrazilOptions } from "@/constants";
import type { Values } from "@/types";

const violenceOccurredInBrazilSchema = Yup.object({
	violenceOccurredInBrazil: Yup.string()
		.oneOf(violenceOccurredInBrazilOptions.map((a) => a.value))
		.required("Esse campo é obrigatório."),
});

export default function ViolenceOccurredInBrazil() {
	async function handleSubmit(values: Values) {
		const violenceOutsideBrazil = values.violenceOccurredInBrazil === "no";
		if (violenceOutsideBrazil) {
			return {
				redirectTo: "/fora-criterios",
			};
		}
	}
	return (
		<Step
			onSubmit={handleSubmit}
			validationSchema={violenceOccurredInBrazilSchema}
			title={"Sobre a violência"}
			img={{
				src: "/illustrations/woman-covering-ears.webp",
				alt: "Ilustração de uma mulher de cabeça baixa tampando os ouvidos",
			}}
		>
			<RadioInput
				name="violenceOccurredInBrazil"
				options={violenceOccurredInBrazilOptions}
				question={
					<>
						A violência ocorreu <Strong>no Brasil</Strong>?
					</>
				}
			/>
		</Step>
	);
}
