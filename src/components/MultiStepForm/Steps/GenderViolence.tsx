import * as Yup from "yup";
import { Strong } from "@radix-ui/themes";
import Step from "../Step";
import RadioInput from "../../RadioInput";
import { genderViolenceOptions } from "@/constants";
import type { Values } from "@/types";

const genderViolenceSchema = Yup.object({
	genderViolence: Yup.string()
		.oneOf(genderViolenceOptions.map((a) => a.value))
		.required("Esse campo é obrigatório."),
});

export default function GenderViolence() {
	async function handleSubmit(values: Values) {
		const notGenderViolence = values.genderViolence === "no";
		if (notGenderViolence) {
			return {
				redirectTo: "/fora-criterios",
			};
		}
	}
	return (
		<Step
			onSubmit={handleSubmit}
			validationSchema={genderViolenceSchema}
			title={"Sobre a violência"}
			img={{
				src: "/illustrations/woman-covering-ears.webp",
				alt: "Ilustração de uma mulher de cabeça baixa tampando os ouvidos",
			}}
		>
			<RadioInput
				name="genderViolence"
				options={genderViolenceOptions}
				question={
					<>
						Você sofreu ou está sofrendo <Strong>violência de gênero</Strong>?
					</>
				}
			/>
		</Step>
	);
}
