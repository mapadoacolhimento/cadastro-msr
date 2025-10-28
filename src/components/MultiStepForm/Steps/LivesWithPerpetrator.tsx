import * as Yup from "yup";
import { Strong } from "@radix-ui/themes";
import Step from "../Step";
import { RadioInput } from "@/components";
import { livesWithPerpetratorOptions } from "@/constants";

const livesWithPerpetratorSchema = Yup.object({
	gender: Yup.string()
		.oneOf(livesWithPerpetratorOptions.map((o) => o.value))
		.required("Esse campo é obrigatório."),
});

export default function LivesWithPerpetrator() {
	return (
		<Step
			validationSchema={livesWithPerpetratorSchema}
			title={"Dados da Violência"}
			img={{
				src: "/illustrations/woman-covering-ears.webp",
				alt: "Ilustração de uma mulher de cabeça baixa tampando os ouvidos",
			}}
		>
			<RadioInput
				name="livesWithPerpetrator"
				options={livesWithPerpetratorOptions}
				question={
					<>
						Você <Strong>reside com o (a) autor(a)</Strong> da violência?
					</>
				}
			/>
		</Step>
	);
}
