import * as Yup from "yup";
import { Strong } from "@radix-ui/themes";
import Step from "../Step";
import RadioInput from "../../RadioInput";
import HoverInfo from "../../HoverInfo";
import { genderIdentityOptions } from "../../../lib";
import type { Values } from "..";

const genderIdentitySchema = Yup.object({
	genderIdentity: Yup.string()
		.oneOf(genderIdentityOptions.map((a) => a.value))
		.required("Esse campo é obrigatório."),
});

export default function GenderIdentity() {
	async function handleSubmit(values: Values) {
		const isNotWoman = values.genderIdentity === "no-woman";
		if (isNotWoman) {
			return {
				redirectTo: "/fora-criterios",
			};
		}
	}
	return (
		<Step
			onSubmit={handleSubmit}
			validationSchema={genderIdentitySchema}
			title={"Sobre você"}
			img={{
				src: "/illustrations/woman-self-hug.svg",
				alt: "Ilustração com uma mulher de cabelo roxo se abraçando",
			}}
		>
			<RadioInput
				name="genderIdentity"
				options={genderIdentityOptions}
				question={
					<>
						Qual sua <Strong>identidade de gênero</Strong>?
					</>
				}
			/>
			<HoverInfo
				title="O que isso significa?"
				description="Identidade de gênero refere-se à forma como uma pessoa se identifica internamente e como ela se define em termos de gênero. Isso pode ou não corresponder ao sexo atribuído no nascimento."
			/>
		</Step>
	);
}
