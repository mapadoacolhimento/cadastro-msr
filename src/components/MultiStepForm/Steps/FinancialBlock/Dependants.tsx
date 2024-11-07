import * as Yup from "yup";
import { Strong } from "@radix-ui/themes";

import Step from "../../Step";
import RadioInput from "../../../RadioInput";
import { dependantsOptions } from "@/constants";

const dependantsSchema = Yup.object({
	dependants: Yup.string()
		.oneOf(dependantsOptions.map((a) => a.value))
		.required("Esse campo é obrigatório."),
});

export default function Dependants() {
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
