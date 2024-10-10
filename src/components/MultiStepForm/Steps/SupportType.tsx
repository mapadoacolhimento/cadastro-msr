import { useCallback, useEffect } from "react";
import * as Yup from "yup";
import { Strong } from "@radix-ui/themes";
import { useFormikContext } from "formik";

import Step from "../Step";
import { CheckboxGroupInput } from "@/components";
import { supportTypeOptions } from "@/constants";
import { Values } from "@/types";
import type { SupportType } from "@prisma/client";

const supportTypeSchema = Yup.object({
	supportType: Yup.array()
		.of(Yup.string().oneOf(["psychological", "legal"]))
		.min(1, "Esse campo é obrigatório."),
});

function SupportTypeChild() {
	const { values, setFieldValue } = useFormikContext<Values>();

	const disbableUnavailableSupportType = useCallback(
		(supportType: SupportType, btnText: string) => {
			const stepBtns = document.getElementsByTagName("button");
			const supportBtn = Array.from(stepBtns).find(
				(btn) => btn.textContent === btnText
			);
			supportBtn?.setAttribute("disabled", "true");

			if (values.supportType.includes(supportType)) {
				const listWithoutUnavailableSupportType = values.supportType.filter(
					(type) => type !== supportType
				);
				setFieldValue("supportType", listWithoutUnavailableSupportType, false);
			}
		},
		[values.supportType, setFieldValue]
	);

	useEffect(() => {
		const hasExternalLegalSupport =
			values.externalSupport.includes("privateLawyer") ||
			values.externalSupport.includes("publicDefender");

		const hasExternalPsychologicalSupport =
			values.externalSupport.includes("privateTherapist");

		if (hasExternalLegalSupport) {
			disbableUnavailableSupportType("legal", "Acolhimento jurídico");
		}

		if (hasExternalPsychologicalSupport) {
			disbableUnavailableSupportType(
				"psychological",
				"Acolhimento psicológico"
			);
		}
	}, [
		values.externalSupport,
		setFieldValue,
		values.supportType,
		disbableUnavailableSupportType,
	]);

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

export default function SupportTypeStep() {
	return (
		<Step
			validationSchema={supportTypeSchema}
			title={"Sobre o acolhimento"}
			img={{
				src: "/illustrations/woman-getting-support.webp",
				alt: "Ilustração com duas mulheres sentadas conversando",
			}}
		>
			<SupportTypeChild />
		</Step>
	);
}
