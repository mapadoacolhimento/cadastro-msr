import * as Yup from "yup";
import Step from "../Step";
import CheckboxGroupInput from "../../CheckboxGroupInput";
import TextPopupInput from "../../TextPopupInput";
import { policeReportDifficultyOptions } from "@/constants";

const policeReportDifficultySchema = Yup.object({
	policeReportDifficulty: Yup.array()
		.of(Yup.string().oneOf(policeReportDifficultyOptions.map((a) => a.value)))
		.min(1, "Selecione pelo menos uma opção.")
		.required("Esse campo é obrigatório."),
	policeReportDifficultyOther: Yup.string().when("policeReportDifficulty", {
		is: (val: string[]) => val?.includes("others"),
		then: (schema) => schema.required("Por favor, descreva o motivo."),
		otherwise: (schema) => schema.notRequired(),
	}),
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
						Se sim, o que a pessoa que te atendeu fez?{" "}
						<em>(Selecione todas as opções que se aplicam)</em>
					</>
				}
			/>

			<TextPopupInput
				name="policeReportDifficultyOther"
				triggerFieldName="policeReportDifficulty"
				triggerValue="others"
				title="Descreva a situação"
				placeholder="Escreva aqui"
			/>
		</Step>
	);
}
