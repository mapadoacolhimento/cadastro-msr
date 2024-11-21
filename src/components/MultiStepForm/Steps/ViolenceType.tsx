import * as Yup from "yup";
import { IconButton, Strong } from "@radix-ui/themes";
import { InfoCircledIcon } from "@radix-ui/react-icons";

import Step from "../Step";
import CheckboxGroupWithAction from "../../CheckboxGroupWithAction";
import { violenceTypeOptions } from "@/constants";

const violenceTypeSchema = Yup.object({
	violenceType: Yup.array()
		.of(Yup.string().oneOf(violenceTypeOptions.map((a) => a.value)))
		.min(1, "Selecione um ou mais tipos de violência")
		.required("Selecione um ou mais tipos de violência"),
});

export default function ViolenceType() {
	return (
		<Step
			validationSchema={violenceTypeSchema}
			title={"Sobre a violência"}
			img={{
				src: "/illustrations/woman-covering-ears.webp",
				alt: "Ilustração de uma mulher de cabeça baixa tampando os ouvidos",
				hideMobile: true,
			}}
		>
			<CheckboxGroupWithAction
				name={"violenceType"}
				options={violenceTypeOptions}
				question={
					<>
						<Strong>
							Quais tipos de violência você sofreu ou está sofrendo?
						</Strong>{" "}
						Você pode selecionar <Strong>um ou mais tipos de violência</Strong>{" "}
						que deseja relatar. Escolha abaixo as opções que se aplicam ao seu
						caso.
					</>
				}
				actionButton={
					<IconButton variant={"ghost"}>
						<InfoCircledIcon width={"18"} height={"18"} />
					</IconButton>
				}
			/>
		</Step>
	);
}
