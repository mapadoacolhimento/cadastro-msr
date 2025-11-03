import * as Yup from "yup";
import { Strong } from "@radix-ui/themes";
import Step from "../Step";
import CheckboxGroupInput from "../../CheckboxGroupInput";
import { violenceLocationOptions } from "@/constants";

const violenceLocationSchema = Yup.object({
	violenceLocation: Yup.array()
		.of(Yup.string().oneOf(violenceLocationOptions.map((o) => o.value)))
		.min(1, "Selecione uma ou mais opções.")
		.required("Selecione uma ou mais opções."),
});

export default function ViolenceLocation() {
	return (
		<Step
			validationSchema={violenceLocationSchema}
			title={"Dados da Violência"}
			img={{
				src: "/illustrations/woman-covering-ears.webp",
				alt: "Ilustração de uma mulher de cabeça baixa tampando os ouvidos",
			}}
		>
			<CheckboxGroupInput
				name={"violenceLocation"}
				options={violenceLocationOptions}
				question={
					<>
						Onde <Strong>ocorreu</Strong> a violência?{" "}
						<em>(Selecione todas as opções que se aplicam)</em>
					</>
				}
			/>
		</Step>
	);
}
