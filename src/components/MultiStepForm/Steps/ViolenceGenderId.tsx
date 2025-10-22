import * as Yup from "yup";
import { Strong } from "@radix-ui/themes";
import Step from "../Step";
import RadioInput from "../../RadioInput";
import { violenceGenderIdOptions } from "@/constants";

const violenceGenderIdSchema = Yup.object({
	violenceGenderId: Yup.string()
		.oneOf(violenceGenderIdOptions.map((a) => a.value))
		.required("Esse campo é obrigatório."),
});

export default function ViolenceGenderId() {
	return (
		<Step
			validationSchema={violenceGenderIdSchema}
			title={"Dados da violência"}
			img={{
				src: "/illustrations/woman-covering-ears.webp",
				alt: "Ilustração de uma mulher de cabeça baixa tampando os ouvidos",
			}}
		>
			<RadioInput
				name="violenceGenderId"
				options={violenceGenderIdOptions}
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
