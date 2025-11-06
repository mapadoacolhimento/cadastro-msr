import * as Yup from "yup";
import Step from "../Step";
import CheckboxGroupInput from "../../CheckboxGroupInput";
import { protectiveFactorsOptions } from "@/constants";
import { Strong } from "@radix-ui/themes";

const protectiveFactorsSchema = Yup.object({
	protectiveFactors: Yup.array()
		.of(Yup.string().oneOf(protectiveFactorsOptions.map((o) => o.value)))
		.min(1, "Selecione um ou mais tipos de violência")
		.required("Selecione um ou mais tipos de violência"),
});

export default function ViolenceType() {
	return (
		<Step
			validationSchema={protectiveFactorsSchema}
			title={"Fatores de Proteção"}
			img={{
				src: "/illustrations/woman-covering-ears.webp",
				alt: "Ilustração de uma mulher de cabeça baixa tampando os ouvidos",
			}}
		>
			<CheckboxGroupInput
				name={"protectiveFactors"}
				options={protectiveFactorsOptions}
				question={
					<>
						Selecione as opções que <Strong>aplicam ao seu caso</Strong>{" "}
					</>
				}
			/>
		</Step>
	);
}
