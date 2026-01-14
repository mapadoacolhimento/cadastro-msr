import * as Yup from "yup";
import { Box } from "@radix-ui/themes";
import Step from "../Step";
import { SelectInput } from "../..";
import { colorOptions } from "@/constants";

const diversityInformationSchema = Yup.object({
	color: Yup.string().required("Selecione sua cor."),
});

export default function DiversityInformation() {
	return (
		<Step
			validationSchema={diversityInformationSchema}
			title={"Seus dados"}
			img={{
				src: "/illustrations/woman-floating.webp",
				alt: "Ilustração com uma mulher flutuando.",
			}}
		>
			<Box pt={"3"}>
				<SelectInput
					name="color"
					label="Selecione sua cor"
					options={colorOptions}
					placeholder="Cor"
				/>
			</Box>
		</Step>
	);
}
