import * as Yup from "yup";
import { Strong } from "@radix-ui/themes";

import Step from "../../Step";
import RadioInput from "../../../RadioInput";
import { dependantsOptions } from "@/constants";
import { Values } from "@/types";

const dependantsSchema = Yup.object({
	dependants: Yup.string()
		.oneOf(dependantsOptions.map((a) => a.value))
		.required("Esse campo é obrigatório."),
});

export default function Dependants() {
	async function handleSubmit(values: Values) {
		const isPaidMoreThanThreeMinWages = values.monthlyIncomeRange > 3;
		const hasAccessToIncome = values.monthlyIncome === "yes";
		const hasNoDependants = values.dependants === "no";

		if (isPaidMoreThanThreeMinWages && hasNoDependants && hasAccessToIncome) {
			return {
				redirectTo: "/fora-criterios",
			};
		}
	}

	return (
		<Step
			validationSchema={dependantsSchema}
			title={"Sobre sua renda"}
			img={{
				src: "/illustrations/mother-daughter-embrace.webp",
				alt: "Ilustração colorida de uma mãe abraçando a filha",
				align: "end",
				bottom: "50px",
			}}
			onSubmit={handleSubmit}
		>
			<RadioInput
				name="dependants"
				options={dependantsOptions}
				question={
					<>
						Você tem pessoas que são dependentes{" "}
						<Strong>financeiramente da sua renda</Strong>?
					</>
				}
			/>
		</Step>
	);
}
