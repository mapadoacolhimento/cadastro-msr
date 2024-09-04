import * as Yup from "yup";
import { Box, Strong, Text } from "@radix-ui/themes";

import Step from "../Step";
import { Question, TextInput } from "../..";
import { isDateValid, isAdult } from "@/utils";

const dateOfBirthSchema = Yup.object({
	dateOfBirth: Yup.string()
		.required("Esse campo é obrigatório.")
		.test("valid date", "Data de nascimento inválida", (value) => {
			return isDateValid(value);
		})
		.test(
			"date-range",
			"A data de nascimento não pode ser anterior ao ano de 1900",
			(value) => {
				const minDate = new Date(1900, 0, 1);
				const [day, month, year] = value.split("/").map(Number);
				const date = new Date(year, month - 1, day);
				return date >= minDate;
			}
		)
		.test(
			"date-range",
			"A data de nascimento não pode ser superior ao dia de hoje",
			(value) => {
				const today = new Date();
				const [day, month, year] = value.split("/").map(Number);
				const date = new Date(year, month - 1, day);
				return date <= today;
			}
		),
});

export default function DateOfBirth() {
	async function handleStepSubmit(
		values: Yup.InferType<typeof dateOfBirthSchema>
	) {
		const isSurvivorAdult = isAdult(values.dateOfBirth);
		if (!isSurvivorAdult) {
			return {
				redirectTo: "/fora-criterios",
			};
		}
	}

	return (
		<Step
			onSubmit={handleStepSubmit}
			validationSchema={dateOfBirthSchema}
			title={"Sobre você"}
			img={{
				src: "/illustrations/woman-self-hug.svg",
				alt: "Ilustração de uma mulher com cabelo roxo se abraçando",
			}}
		>
			<Question>
				Qual a sua <Strong>data de nascimento?</Strong>
			</Question>
			<TextInput
				name="dateOfBirth"
				type="text"
				label="Data de nascimento"
				placeholder="DD/MM/AAAA"
				mask="99/99/9999"
			/>
		</Step>
	);
}
