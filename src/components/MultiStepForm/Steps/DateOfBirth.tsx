import * as Yup from "yup";
import { Box, Strong, Text } from "@radix-ui/themes";

import Step from "../Step";
import { TextInput } from "../..";
import { sleep, isDateValid } from "../../../lib";

const today = new Date();
const minDate = new Date(1900, 0, 1);

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
				const [day, month, year] = value.split("/").map(Number);
				const date = new Date(year, month - 1, day);
				return date >= minDate;
			}
		)
		.test(
			"date-range",
			"A data de nascimento não pode ser superior ao dia de hoje",
			(value) => {
				const [day, month, year] = value.split("/").map(Number);
				const date = new Date(year, month - 1, day);
				return date <= today;
			}
		),
});

export default function DateOfBirth() {
	return (
		<Step
			onSubmit={() => sleep(300).then(() => console.log("Step2 onSubmit"))}
			validationSchema={dateOfBirthSchema}
			title={"Sobre você"}
			img={{
				src: "/illustrations/woman-self-hug.svg",
				alt: "Ilustração de uma mulher com cabelo roxo se abraçando",
			}}
		>
			<Box width={"100%"} maxWidth={"22rem"}>
				<Box asChild pb={{ initial: "7", sm: "8" }} pt={"3"}>
					<Text asChild align={"center"} as={"p"}>
						<legend>
							Qual a sua <Strong>data de nascimento?</Strong>
						</legend>
					</Text>
				</Box>
				<TextInput
					name="dateOfBirth"
					type="text"
					label="Data de Nascimento"
					placeholder="DD/MM/AAAA"
					mask="99/99/9999"
				/>
			</Box>
		</Step>
	);
}
