import * as Yup from "yup";
import { Strong } from "@radix-ui/themes";

import Step from "../Step";
import CheckboxGroupInput from "../../CheckboxGroupInput";
import { violenceTypeOptions } from "@/constants";

const violenceTypeSchema = Yup.object({
	violenceType: Yup.array()
		.of(Yup.string().oneOf(violenceTypeOptions.map((a) => a.value)))
		.min(1, "Selecione um ou mais tipos de violência")
		.required("Selecione um ou mais tipos de violência"),
});

export default function ViolenceType() {
	return (
		<Step
			validationSchema={violenceTypeSchema}
			title={"Sobre a violência"}
			img={{
				src: "/illustrations/woman-covering-ears.webp",
				alt: "Ilustração de uma mulher de cabeça baixa tampando os ouvidos",
			}}
		>
			<CheckboxGroupInput
				name={"violenceType"}
				options={violenceTypeOptions}
				question={
					<>
						<Strong>
							Quais tipos de violência você sofreu ou está sofrendo?
						</Strong>{" "}
						Você pode selecionar <Strong>um ou mais tipos de violência</Strong>{" "}
						que deseja relatar. Escolha abaixo as opções que se aplicam ao seu
						caso.
					</>
				}
			/>
		</Step>
	);
}
