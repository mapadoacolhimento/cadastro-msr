import * as Yup from "yup";
import Step from "../Step";
import CheckboxGroupInput from "../../CheckboxGroupInput";
import { legalActionDifficultyOptions } from "@/constants";

const legalActionDifficultySchema = Yup.object({
	legalActionDifficulty: Yup.array()
		.of(Yup.string().oneOf(legalActionDifficultyOptions.map((a) => a.value)))
		.min(1, "Selecione pelo menos uma opção.")
		.required("Esse campo é obrigatório."),
});

export default function LegalActionDifficulty() {
	return (
		<Step
			validationSchema={legalActionDifficultySchema}
			title={"Dados da Violência"}
			img={{
				src: "/illustrations/woman-covering-ears.webp",
				alt: "Ilustração de uma mulher de cabeça baixa tampando os ouvidos",
			}}
		>
			<CheckboxGroupInput
				name="legalActionDifficulty"
				options={legalActionDifficultyOptions}
				question={
					<>
						Houve dificuldade ou impedimento para realizar alguma das
						providências jurídicas? Se sim, o que a pessoa que te atendeu fez?{" "}
						<em>(Selecione todas as opções que se aplicam)</em>
					</>
				}
			/>
		</Step>
	);
}
