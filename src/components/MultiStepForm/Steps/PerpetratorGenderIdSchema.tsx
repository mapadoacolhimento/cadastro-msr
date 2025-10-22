import * as Yup from "yup";
import { Strong } from "@radix-ui/themes";
import Step from "../Step";
import RadioInput from "../../RadioInput";
import { perpetratorGenderIdOptions } from "@/constants";

const perpetratorGenderIdSchema = Yup.object({
	perpetratorGenderId: Yup.string()
		.oneOf(perpetratorGenderIdOptions.map((a) => a.value))
		.required("Esse campo é obrigatório."),
});

export default function ViolenceGenderId() {
	return (
		<Step
			validationSchema={perpetratorGenderIdSchema}
			title={"Dados da violência"}
			img={{
				src: "/illustrations/woman-covering-ears.webp",
				alt: "Ilustração de uma mulher de cabeça baixa tampando os ouvidos",
			}}
		>
			<RadioInput
				name="violenceGenderId"
				options={perpetratorGenderIdOptions}
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
