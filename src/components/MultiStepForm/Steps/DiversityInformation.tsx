import * as Yup from "yup";
import { Box, Link, Strong } from "@radix-ui/themes";

import Step from "../Step";
import CheckboxInput from "../../CheckboxInput";
import { SelectInput } from "../..";
import {
	colorOptions,
	HAS_DISABILITY_OPTIONS,
	DISABILITY_OPTIONS,
} from "@/constants";
import { useState } from "react";

const diversityInformationSchema = Yup.object({
	color: Yup.string().required("Selecione sua cor."),
	hasDisability: Yup.string()
		.oneOf(HAS_DISABILITY_OPTIONS.map((a) => a.value))
		.required("Esse campo é obrigatório."),
	disability: Yup.string()
		.nullable()
		.when("hasDisability", {
			is: "yes",
			then: (schema) => schema.required("Selecione qual deficiência você tem."),
			otherwise: (schema) => schema.notRequired(),
		}),
	terms: Yup.boolean().oneOf(
		[true],
		"Você precisar aceitar os termos para receber atendimento."
	),
});

function DiversityInformationFields() {
	const [selectedhasDisabilityOption, setSelectedhasDisabilityOption] =
		useState<string>("");
	function handlehasDisabilityChange(option: string) {
		setSelectedhasDisabilityOption(option);
	}

	return (
		<>
			<Box pt={"3"}>
				<SelectInput
					name="color"
					label="Cor"
					options={colorOptions}
					placeholder="Cor"
				/>
			</Box>
			<SelectInput
				name="hasDisability"
				options={HAS_DISABILITY_OPTIONS}
				label={"Você é PcD (Pessoa com deficiência)?"}
				placeholder="Você é PcD (Pessoa com deficiência)?"
				onChange={handlehasDisabilityChange}
			/>
			{selectedhasDisabilityOption === "yes" && (
				<SelectInput
					name="disability"
					options={DISABILITY_OPTIONS}
					label={"Qual deficiência você tem?"}
					placeholder="Qual deficiência você tem?"
				/>
			)}
			<Box pt={"6"}>
				<CheckboxInput name="terms">
					Ao inserir seus dados, você concorda em ter seus dados compartilhados
					com os organizadores dessa página e aceita receber emails de
					atualização, conforme descrito na{" "}
					<Strong>
						<Link
							href="https://docs.google.com/document/d/e/2PACX-1vTI5h8RBjeC7MkZ4bAponamp02YdYhjhPCJC0dQ2kp7inzA1LPoiE_JFgOwmbwv1PPJvU4pMqfEEQn9/pub"
							target="_blank"
							rel="noopener noreferrer"
						>
							política de privacidade
						</Link>
					</Strong>
					. Você pode cancelar o recebimento desses e-mails a qualquer momento.
				</CheckboxInput>
			</Box>
		</>
	);
}

export default function DiversityInformation() {
	return (
		<Step
			validationSchema={diversityInformationSchema}
			title={"Seus dados"}
			img={{
				src: "/illustrations/woman-floating.webp",
				alt: "Ilustração com uma mulher flutuando.",
			}}
		>
			<DiversityInformationFields />
		</Step>
	);
}
