import * as Yup from "yup";
import { Strong } from "@radix-ui/themes";

import Step from "../Step";
import RadioInput from "../../RadioInput";
import { acceptsOnlineSupportOptions } from "@/constants";
import { sleep } from "@/utils";

const acceptsOnlineSupportSchema = Yup.object({
	acceptsOnlineSupport: Yup.string()
		.oneOf(acceptsOnlineSupportOptions.map((a) => a.value))
		.required("Esse campo é obrigatório."),
});

export default function AcceptsOnlineSupport() {
	return (
		<Step
			onSubmit={() => sleep(300).then(() => console.log("Step2 onSubmit"))}
			validationSchema={acceptsOnlineSupportSchema}
			title={"Sobre o acolhimento"}
			img={{
				src: "/illustrations/woman-getting-support.svg",
				alt: "Ilustração com duas mulheres sentadas conversando",
			}}
		>
			<RadioInput
				name="acceptsOnlineSupport"
				options={acceptsOnlineSupportOptions}
				question={
					<>
						Você aceitaria ser atendida <Strong>online</Strong>?
					</>
				}
			/>
		</Step>
	);
}
