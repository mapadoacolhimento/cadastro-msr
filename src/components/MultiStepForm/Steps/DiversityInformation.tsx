import * as Yup from "yup";
import { Box } from "@radix-ui/themes";

import Step from "../Step";
import { SelectInput } from "../..";
import { colorOptions, DISABILITY_OPTIONS, sleep } from "../../../lib";

const diversityInformationSchema = Yup.object({
	color: Yup.string().required("Selecione sua cor."),
	hasDisability: Yup.string()
		.oneOf(DISABILITY_OPTIONS.map((a) => a.value))
		.required("Esse campo é obrigatório."),
});

export default function DiversityInformation() {
	return (
		<Step
			onSubmit={() => sleep(300).then(() => console.log("Step2 onSubmit"))}
			validationSchema={diversityInformationSchema}
			title={"Seus dados"}
			img={{
				src: "/illustrations/woman-floating.svg",
				alt: "Ilustração com uma mulher flutuando.",
			}}
		>
			<Box pt={{ initial: "7", sm: "8" }} width={"100%"} maxWidth={"22rem"}>
				<SelectInput
					name="color"
					label="Cor"
					options={colorOptions}
					placeholder="Cor"
				/>
			</Box>
			<SelectInput
				name="hasDisability"
				options={DISABILITY_OPTIONS}
				label={"Você é PcD (Pessoa com deficiência)?"}
				placeholder="Você é PcD (Pessoa com deficiência)?"
			/>
		</Step>
	);
}
