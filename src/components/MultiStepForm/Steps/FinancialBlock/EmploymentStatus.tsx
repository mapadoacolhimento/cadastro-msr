import * as Yup from "yup";
import { Strong } from "@radix-ui/themes";

import Step from "../../Step";
import RadioInput from "../../../RadioInput";
import { employmentStatusOptions } from "@/constants";
import { Values } from "@/types";

const employmentStatusSchema = Yup.object({
	employmentStatus: Yup.string()
		.oneOf(employmentStatusOptions.map((a) => a.value))
		.required("Esse campo é obrigatório."),
});

export default function EmploymentStatus() {
	async function handleSubmit(values: Values) {
		const hasAccessToIncome = values.monthlyIncome === "yes";
		const isPaidMoreThanThreeMinWages =
			values.monthlyIncomeRange !== null && values.monthlyIncomeRange > 3;
		const isStudent =
			values.employmentStatus === "student" ||
			values.employmentStatus === "student_with_income";

		if (isPaidMoreThanThreeMinWages && isStudent && hasAccessToIncome) {
			return {
				redirectTo: "/fora-criterios",
			};
		}
	}

	return (
		<Step
			validationSchema={employmentStatusSchema}
			title={"Sobre sua renda"}
			img={{
				src: "/illustrations/notebook.webp",
				alt: "Ilustração de um caderno, um lápis amarelo e alguns clips",
			}}
			onSubmit={handleSubmit}
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
