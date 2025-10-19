import * as Yup from "yup";
import { Strong } from "@radix-ui/themes";
import Step from "../Step";
import { genderIdViolenceOptions } from "@/constants";
import RadioGroupInput from "@/components/RadioInput";

const genderIdViolenceSchema = Yup.object({
	violenceTime: Yup.string()
		.oneOf(genderIdViolenceOptions.map((opt) => opt.value))
		.required("Esse campo é obrigatório."),
});

export default function GenderIdentityViolence() {
	return (
		<Step
			validationSchema={genderIdViolenceSchema}
			title={"Dados da Violência"}
			img={{
				src: "/illustrations/woman-covering-ears.webp",
				alt: "Ilustração de uma mulher de cabeça baixa tampando os ouvidos",
			}}
		>
			<RadioGroupInput
				name={"genderIdViolence"}
				options={genderIdViolenceOptions}
				question={
					<>
						Qual a <Strong>identidade de gênero do(a) autor(a)</Strong> da
						violência?
					</>
				}
			/>
		</Step>
	);
}
