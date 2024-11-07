import * as Yup from "yup";
import { Strong } from "@radix-ui/themes";

import Step from "../../Step";
import RadioInput from "../../../RadioInput";
import { monthlyIncomeOptions } from "@/constants";

const monthlyIncomeSchema = Yup.object({
	monthlyIncome: Yup.string()
		.oneOf(monthlyIncomeOptions.map((a) => a.value))
		.required("Esse campo é obrigatório."),
});

export default function MonthlyIncome() {
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
				options={monthlyIncomeOptions}
				question={
					<>
						Você tem <Strong>renda mensal</Strong>?
					</>
				}
			/>
		</Step>
	);
}
