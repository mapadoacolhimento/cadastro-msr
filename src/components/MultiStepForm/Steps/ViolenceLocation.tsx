import * as Yup from "yup";
import { Strong } from "@radix-ui/themes";

import Step from "../Step";
import RadioInput from "../../RadioInput";
import { violenceLocationOptions } from "@/constants";
import type { Values } from "@/types";

const violenceLocationSchema = Yup.object({
	violenceLocation: Yup.string()
		.oneOf(violenceLocationOptions.map((a) => a.value))
		.required("Esse campo é obrigatório."),
});

export default function ViolenceLocation() {
	async function handleSubmit(values: Values) {
		const violenceOutsideBrazil = values.violenceLocation === "no";
		if (violenceOutsideBrazil) {
			return {
				redirectTo: "/fora-criterios",
			};
		}
	}
	return (
		<Step
			onSubmit={handleSubmit}
			validationSchema={violenceLocationSchema}
			title={"Sobre a violência"}
			img={{
				src: "/illustrations/woman-covering-ears.webp",
				alt: "Ilustração de uma mulher de cabeça baixa tampando os ouvidos",
			}}
		>
			<RadioInput
				name="violenceLocation"
				options={violenceLocationOptions}
				question={
					<>
						A violência ocorreu <Strong>no Brasil</Strong>?
					</>
				}
			/>
		</Step>
	);
}
