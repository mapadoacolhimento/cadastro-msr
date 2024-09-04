import { useEffect } from "react";
import * as Yup from "yup";
import { Strong } from "@radix-ui/themes";
import { useFormikContext } from "formik";

import Step from "../Step";
import { CheckboxGroupInput } from "@/components";
import { supportTypeOptions } from "@/constants";
import { Values } from "@/types";

const supportTypeSchema = Yup.object({
	supportType: Yup.array()
		.of(Yup.string().oneOf(["psychological", "legal"]))
		.min(1, "Esse campo é obrigatório."),
});

function SupportTypeChild() {
	const { values, setFieldValue } = useFormikContext<Values>();

	useEffect(() => {
		if (values.externalSupport === "yes") {
			const stepBtns = document.getElementsByTagName("button");
			const legalSupportBtn = Array.from(stepBtns).find(
				(btn) => btn.textContent === "Acolhimento jurídico"
			);
			legalSupportBtn?.setAttribute("disabled", "true");

			if (values.supportType.includes("legal")) {
				const supportTypeWithoutLegal = values.supportType.filter(
					(type) => type !== "legal"
				);
				setFieldValue("supportType", supportTypeWithoutLegal, false);
			}
		}
	}, [values.externalSupport]);

	return (
		<CheckboxGroupInput
			name={"supportType"}
			options={supportTypeOptions}
			question={
				<>
					Que <Strong>tipo de acolhimento</Strong> você precisa?
				</>
			}
		/>
	);
}

export default function SupportType() {
	return (
		<Step
			validationSchema={supportTypeSchema}
			title={"Sobre o acolhimento"}
			img={{
				src: "/illustrations/woman-getting-support.svg",
				alt: "Ilustração com duas mulheres sentadas conversando",
			}}
		>
			<SupportTypeChild />
		</Step>
	);
}
