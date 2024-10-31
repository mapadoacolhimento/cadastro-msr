import * as Yup from "yup";
import { Em, Strong } from "@radix-ui/themes";

import Step from "../../Step";
import RadioInput from "../../../RadioInput";
import { monthlyIncomeRangeOptions } from "@/constants";

const monthlyIncomeSchema = Yup.object({
	monthlyIncomeRange: Yup.number().required("Esse campo é obrigatório."),
});

export default function MonthlyIncomeRange() {
	return (
		<Step
			validationSchema={monthlyIncomeSchema}
			title={"Sobre sua renda"}
			img={{
				src: "/illustrations/notebook.webp",
				alt: "Ilustração de um caderno, um lápis amarelo e alguns clips",
			}}
		>
			<RadioInput
				name="monthlyIncome"
				options={monthlyIncomeRangeOptions}
				question={
					<>
						Assinale a opção que corresponde a sua{" "}
						<Strong>renda individual</Strong> (<Em>per capita</Em>):
					</>
				}
			/>
		</Step>
	);
}
