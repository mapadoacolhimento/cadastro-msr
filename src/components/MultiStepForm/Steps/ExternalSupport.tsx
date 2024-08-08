import * as Yup from "yup";
import Step from "../Step";
import { externalSupportOptions } from "../../../lib";
import RadioInput from "../../RadioInput";
import { Strong } from "@radix-ui/themes";
import type { Values } from "..";

const externalSupportSchema = Yup.object({
	externalSupport: Yup.string()
		.oneOf(externalSupportOptions.map((a) => a.value))
		.required("Esse campo é obrigatório."),
});

export default function ExternalSupport() {
	async function handleSubmit(values: Values) {
		const hasGovernmentLegalSupport =
			values.supportType.includes("legal") && values.externalSupport === "yes";
		if (hasGovernmentLegalSupport) {
			return {
				redirectTo: "/fora-criterios",
			};
		}
	}
	return (
		<Step
			onSubmit={handleSubmit}
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
