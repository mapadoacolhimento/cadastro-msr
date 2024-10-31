import * as Yup from "yup";
import { Em, Strong } from "@radix-ui/themes";

import Step from "../../Step";
import RadioInput from "../../../RadioInput";
import { familyProviderOptions } from "@/constants";

const familyProviderSchema = Yup.object({
	familyProvider: Yup.string()
		.oneOf(familyProviderOptions.map((a) => a.value))
		.required("Esse campo é obrigatório."),
});

export default function FamilyProvider() {
	return (
		<Step
			validationSchema={familyProviderSchema}
			title={"Sobre sua renda"}
			img={{
				src: "/illustrations/mother-daughter-embrace.webp",
				alt: "Ilustração colorida de uma mãe abraçando a filha",
				align: "end",
				bottom: "50px",
			}}
		>
			<RadioInput
				name="familyProvider"
				options={familyProviderOptions}
				question={
					<>
						Você é <Strong>responsável financeiramente</Strong> pela renda
						familitar (é considerada a &quot;<Em>chefe de família</Em>&quot;)?
					</>
				}
			/>
		</Step>
	);
}
