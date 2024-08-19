import * as Yup from "yup";

import Step from "../Step";
import CheckboxGroupInput from "../../CheckboxGroupInput";
import { sleep, supportTypeOptions } from "../../../lib";
import { Strong } from "@radix-ui/themes";

const supportTypeSchema = Yup.object({
	supportType: Yup.array()
		.of(Yup.string().oneOf(["psychological", "legal"]))
		.min(1, "Esse campo é obrigatório."),
});

export default function SupportType() {
	return (
		<Step
			onSubmit={() => sleep(300).then(() => console.log("Step3 onSubmit"))}
			validationSchema={supportTypeSchema}
			title={"Sobre o acolhimento"}
			img={{
				src: "/illustrations/woman-getting-support.svg",
				alt: "Ilustração com duas mulheres sentadas conversando",
			}}
		>
			<CheckboxGroupInput
				name={"supportType"}
				options={supportTypeOptions}
				question={
					<>
						Que <Strong>tipo de acolhimento</Strong> você precisa?
					</>
				}
			/>
		</Step>
	);
}
