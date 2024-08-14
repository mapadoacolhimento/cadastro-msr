import * as Yup from "yup";
import { Box } from "@radix-ui/themes";
import Step from "../Step";
import TextInput from "../../TextInput";
import { colorOptions, isAdult, isDateValid } from "../../../lib";
import SelectInput from "../../SelectInput";

const today = new Date();
const minDate = new Date(1900, 0, 1);

const basicRegisterInformationSchema = Yup.object({
	firstName: Yup.string().required("Esse campo é obrigatório."),
	email: Yup.string()
		.email("Insira um e-mail válido.")
		.required("Esse campo é obrigatório."),
	confirmEmail: Yup.string()
		.oneOf([Yup.ref("email")], "Os e-mails precisam ser iguais.")
		.required("Esse campo é obrigatório."),
	phone: Yup.string()
		.matches(
			/^\(\d{2}\)\s\d{4,5}-\d{4}$/,
			"Insira um número de telefone válido com DDD."
		)
		.required("Esse campo é obrigatório."),
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
	color: Yup.string().required("Esse campo é obrigatório."),
});

export default function BasicRegisterInformation() {
	async function handleSubmit(
		values: Yup.InferType<typeof basicRegisterInformationSchema>
	) {
		const isSurvivorAdult = isAdult(values.dateOfBirth);
		if (!isSurvivorAdult) {
			return {
				redirectTo: "/fora-criterios",
			};
		}

		const response = await fetch("/validate", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				phone: values.phone,
				email: values.email,
			}),
		});

		if (!response.ok) {
			throw new Error(response.statusText);
		}

		const data = await response.json();
		return data;
	}

	return (
		<Step
			onSubmit={handleSubmit}
			validationSchema={basicRegisterInformationSchema}
			title={"Seus dados"}
			img={{
				src: "/illustrations/woman-floating.svg",
				alt: "Ilustração com uma mulher flutuando.",
			}}
		>
			<Box pt={{ initial: "7", sm: "8" }} width={"100%"} maxWidth={"22rem"}>
				<TextInput
					name="firstName"
					label="Primeiro nome"
					placeholder="Qual o seu primeiro nome?"
				/>
			</Box>
			<TextInput
				name="email"
				type="email"
				label="E-mail"
				placeholder="Qual o seu melhor e-mail?"
			/>
			<TextInput
				name="confirmEmail"
				type="email"
				label="Confirme seu E-mail"
				placeholder="Confirme seu e-mail"
			/>
			<TextInput
				name="phone"
				type="phone"
				label="Whatsapp"
				placeholder="Qual o seu whatsapp (com DDD)?"
				mask="(99) 99999-9999"
			/>
			<TextInput
				name="dateOfBirth"
				type="text"
				label="Data de Nascimento"
				placeholder="DD/MM/AAAA"
				mask="99/99/9999"
			/>
			<SelectInput
				name="color"
				label="Cor"
				options={colorOptions}
				placeholder="Cor"
			/>
		</Step>
	);
}
