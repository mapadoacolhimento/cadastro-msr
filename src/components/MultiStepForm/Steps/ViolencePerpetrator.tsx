import * as Yup from "yup";
import { Strong } from "@radix-ui/themes";
import Step from "../Step";
import CheckboxGroupInput from "../../CheckboxGroupInput";
import { violencePerpetratorOptions } from "@/constants";

const violencePerpetratorSchema = Yup.object({
	violencePerpetrator: Yup.array()
		.of(Yup.string().oneOf(violencePerpetratorOptions.map((a) => a.value)))
		.min(1, "Selecione uma ou mais opções.")
		.required("Selecione uma ou mais opções."),
});

export default function ViolencePerpetrator() {
	return (
		<Step
			validationSchema={violencePerpetratorSchema}
			title={"Dados da Violência"}
			img={{
				src: "/illustrations/woman-covering-ears.webp",
				alt: "Ilustração de uma mulher de cabeça baixa tampando os ouvidos",
			}}
		>
			<CheckboxGroupInput
				name={"violencePerpetrator"}
				options={violencePerpetratorOptions}
				question={
					<>
						Quem <Strong>é ou foi o(a) autor(a)</Strong> da violência?{" "}
						<em>(Selecione todas as opções que se aplicam)</em>
					</>
				}
			/>
		</Step>
	);
}
