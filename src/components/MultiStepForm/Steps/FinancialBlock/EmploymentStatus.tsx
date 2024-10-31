import * as Yup from "yup";
import { Strong } from "@radix-ui/themes";

import Step from "../../Step";
import RadioInput from "../../../RadioInput";
import { employmentStatusOptions } from "@/constants";

const employmentStatusSchema = Yup.object({
	employmentStatus: Yup.string()
		.oneOf(employmentStatusOptions.map((a) => a.value))
		.required("Esse campo é obrigatório."),
});

export default function EmploymentStatus() {
	return (
		<Step
			validationSchema={employmentStatusSchema}
			title={"Sobre sua renda"}
			img={{
				src: "/illustrations/notebook.webp",
				alt: "Ilustração de um caderno, um lápis amarelo e alguns clips",
			}}
		>
			<RadioInput
				name="employmentStatus"
				options={employmentStatusOptions}
				question={
					<>
						Qual a sua <Strong>situação de trabalho</Strong>?
					</>
				}
			/>
		</Step>
	);
}
