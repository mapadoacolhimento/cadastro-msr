import * as Yup from "yup";
import { Strong } from "@radix-ui/themes";
import Step from "../Step";
import CheckboxGroupInput from "../../CheckboxGroupInput";
import { legalActionsTakenOptions } from "@/constants";

const legalActionsTakenSchema = Yup.object({
	legalActionsTaken: Yup.array()
		.of(Yup.string().oneOf(legalActionsTakenOptions.map((o) => o.value)))
		.min(1, "Selecione uma ou mais opções.")
		.required("Selecione uma ou mais opções."),
});

export default function ViolenceLocation() {
	return (
		<Step
			validationSchema={legalActionsTakenSchema}
			title={"Dados da Violência"}
			img={{
				src: "/illustrations/woman-covering-ears.webp",
				alt: "Ilustração de uma mulher de cabeça baixa tampando os ouvidos",
			}}
		>
			<CheckboxGroupInput
				name="legalActionsTaken"
				options={legalActionsTakenOptions}
				question={
					<>
						Foram tomadas <Strong>provedências jurídicas</Strong>?{" "}
						<em>(Selecione todas as opções que se aplicam)</em>
					</>
				}
			/>
		</Step>
	);
}
