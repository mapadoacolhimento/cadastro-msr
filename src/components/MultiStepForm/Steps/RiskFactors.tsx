import * as Yup from "yup";
import Step from "../Step";
import CheckboxGroupInput from "../../CheckboxGroupInput";
import { riskFactorsOptions } from "@/constants";
import { Strong } from "@radix-ui/themes";

const riskFactorsSchema = Yup.object({
	riskFactors: Yup.array()
		.of(Yup.string().oneOf(riskFactorsOptions.map((o) => o.value)))
		.min(1, "Selecione uma ou mais opções")
		.required("Selecione uma ou mais opções"),
});

export default function RiskFactors() {
	return (
		<Step
			validationSchema={riskFactorsSchema}
			title={"Fatores de Risco"}
			img={{
				src: "/illustrations/woman-covering-ears.webp",
				alt: "Ilustração de uma mulher de cabeça baixa tampando os ouvidos",
			}}
		>
			<CheckboxGroupInput
				name={"riskFactors"}
				options={riskFactorsOptions}
				question={
					<>
						Selecione as opções que <Strong>se aplicam ao seu caso</Strong>{" "}
					</>
				}
			/>
		</Step>
	);
}
