import * as Yup from "yup";
import Step from "../Step";
import RadioInput from "../../RadioInput";
import { genderViolenceOptions } from "../../../lib";
import type { Values } from "..";

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
				src: "/illustrations/woman-covering-ears.svg",
				alt: "Ilustração de uma mulher de cabeça baixa tampando os ouvidos",
			}}
		>
			<RadioInput
				name="genderViolence"
				options={genderViolenceOptions}
				question={"Você sofreu ou está sofrendo violência de gênero?"}
			/>
		</Step>
	);
}
