import * as Yup from "yup";
import Step from "../Step";
import RadioInput from "../../RadioInput";
import { policeReportDifficultyOptions } from "@/constants";

const policeReportDifficultySchema = Yup.object({
	policeReportDifficulty: Yup.string()
		.oneOf(policeReportDifficultyOptions.map((a) => a.value))
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
			<RadioInput
				name="policeReportDifficulty"
				options={policeReportDifficultyOptions}
				question={
					<>
						Houve dificuldade para solicitar medida protetiva e/ou denunciar
						e/ou registrar um boletim de ocorrência?
					</>
				}
			/>
		</Step>
	);
}
