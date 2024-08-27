import * as Yup from "yup";
import { Strong } from "@radix-ui/themes";

import Step from "../Step";
import RadioInput from "../../RadioInput";
import { externalSupportOptions } from "@/constants";

const externalSupportSchema = Yup.object({
	externalSupport: Yup.string()
		.oneOf(externalSupportOptions.map((a) => a.value))
		.required("Esse campo é obrigatório."),
});

export default function ExternalSupport() {
	return (
		<Step
			validationSchema={externalSupportSchema}
			title={"Sobre a violência"}
			img={{
				src: "/illustrations/woman-covering-ears.svg",
				alt: "Ilustração de uma mulher de cabeça baixa tampando os ouvidos",
			}}
		>
			<RadioInput
				name={"externalSupport"}
				options={externalSupportOptions}
				question={
					<>
						Você está recebendo acompanhamento jurídico pela{" "}
						<Strong>defensoria pública</Strong>?
					</>
				}
			/>
		</Step>
	);
}
