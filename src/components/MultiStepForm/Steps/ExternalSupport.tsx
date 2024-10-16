import * as Yup from "yup";
import { Strong } from "@radix-ui/themes";

import Step from "../Step";
import CheckboxGroupInput from "../../CheckboxGroupInput";
import { externalSupportOptions } from "@/constants";

const externalSupportSchema = Yup.object({
	externalSupport: Yup.array()
		.of(Yup.string().oneOf(externalSupportOptions.map((a) => a.value)))
		.min(1, "Esse campo é obrigatório.")
		.required("Esse campo é obrigatório."),
});

export default function ExternalSupport() {
	async function handleSubmit(
		values: Yup.InferType<typeof externalSupportSchema>
	) {
		const hasExternalLegalSupport =
			values.externalSupport.includes("privateLawyer") ||
			values.externalSupport.includes("publicDefender");
		const hasExternalPsychologicalSupport =
			values.externalSupport.includes("privateTherapist");

		if (hasExternalLegalSupport && hasExternalPsychologicalSupport) {
			return {
				redirectTo: "/fora-criterios",
			};
		}
	}

	return (
		<Step
			validationSchema={externalSupportSchema}
			title={"Sobre a violência"}
			img={{
				src: "/illustrations/woman-covering-ears.webp",
				alt: "Ilustração de uma mulher de cabeça baixa tampando os ouvidos",
			}}
			onSubmit={handleSubmit}
		>
			<CheckboxGroupInput
				name={"externalSupport"}
				options={externalSupportOptions}
				question={
					<>
						Você está em atendimento psicológico e/ou jurídico{" "}
						<Strong>fora do Mapa do Acolhimento</Strong>?
					</>
				}
			/>
		</Step>
	);
}
