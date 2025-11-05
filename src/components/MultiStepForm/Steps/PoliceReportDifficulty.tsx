import * as Yup from "yup";
import { Strong } from "@radix-ui/themes";
import Step from "../Step";
import CheckboxGroupInput from "../../CheckboxGroupInput";
import { policeReportDifficultyOptions } from "@/constants";

const policeReportDifficultySchema = Yup.object({
	policeReportDifficulty: Yup.array()
		.of(Yup.string().oneOf(policeReportDifficultyOptions.map((a) => a.value)))
		.min(1, "Selecione pelo menos uma opção.")
		.required("Esse campo é obrigatório."),
});

export default function PoliceReportDifficulty() {
	return (
		<Step
			validationSchema={policeReportDifficultySchema}
			title={"Dados da Violência"}
			img={{
				src: "/illustrations/woman-covering-ears.webp",
				alt: "Ilustração de uma mulher de cabeça baixa tampando os ouvidos",
			}}
		>
			<CheckboxGroupInput
				name="policeReportDifficulty"
				options={policeReportDifficultyOptions}
				question={
					<>
						Houve dificuldade para solicitar medida protetiva e/ou denunciar
						e/ou registrar um boletim de ocorrência?{" "}
						<Strong>O que a pessoa que te atendeu fez?</Strong>{" "}
						<em>(Selecione todas as opções que se aplicam)</em>
					</>
				}
			/>
		</Step>
	);
}
