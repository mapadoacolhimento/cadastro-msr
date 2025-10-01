import * as Yup from "yup";
import { Strong } from "@radix-ui/themes";
import Step from "../Step";
import { violenceTimeOptions } from "@/constants";
import RadioGroupInput from "@/components/RadioInput";

const violenceTimeSchema = Yup.object({
	violenceTime: Yup.string()
		.oneOf(violenceTimeOptions.map((opt) => opt.value))
		.required("Esse campo é obrigatório."),
});

export default function ViolenceTime() {
	return (
		<Step
			validationSchema={violenceTimeSchema}
			title={"Dados da Violência"}
			img={{
				src: "/illustrations/woman-covering-ears.webp",
				alt: "Ilustração de uma mulher de cabeça baixa tampando os ouvidos",
			}}
		>
			<RadioGroupInput
				name="violenceTime"
				options={violenceTimeOptions}
				question={
					<>
						Por <Strong>quanto tempo</Strong> você sofreu ou tem sofrido
						violência?
					</>
				}
			/>
		</Step>
	);
}
