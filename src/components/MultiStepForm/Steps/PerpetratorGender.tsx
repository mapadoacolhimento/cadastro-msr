import * as Yup from "yup";
import { Strong } from "@radix-ui/themes";
import Step from "../Step";
import RadioInput from "../../RadioInput";
import { perpetratorGenderOptions } from "@/constants";

const perpetratorGenderSchema = Yup.object({
	perpetratorGender: Yup.string()
		.oneOf(perpetratorGenderOptions.map((a) => a.value))
		.required("Esse campo é obrigatório."),
});

export default function PerpetratorGender() {
	return (
		<Step
			validationSchema={perpetratorGenderSchema}
			title={"Dados da violência"}
			img={{
				src: "/illustrations/woman-covering-ears.webp",
				alt: "Ilustração de uma mulher de cabeça baixa tampando os ouvidos",
			}}
		>
			<RadioInput
				name="perpetratorGender"
				options={perpetratorGenderOptions}
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
