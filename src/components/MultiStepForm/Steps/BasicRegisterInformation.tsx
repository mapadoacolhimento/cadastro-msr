import { Box } from "@radix-ui/themes";
import * as Yup from "yup";

import { useFormikContext } from "formik";
import { TextInput } from "../..";
import Step from "../Step";
import { getFinalFormValues } from "@/utils";
import { Values } from "@/types";
import { logger } from "@/lib";

const basicRegisterInformationSchema = Yup.object({
	firstName: Yup.string()
		.required("Insira seu primeiro nome.")
		.max(200, "Insira apenas seu primeiro nome."),
	email: Yup.string()
		.email("Insira um e-mail válido.")
		.required("Insira seu e-mail.")
		.max(200, "Insira apenas seu e-mail."),
	confirmEmail: Yup.string()
		.oneOf([Yup.ref("email")], "Os e-mails precisam ser iguais.")
		.required("Esse campo é obrigatório."),
	phone: Yup.string()
		.matches(
			/^\(\d{2}\)\s\d{4,5}-\d{4}$/,
			"Insira um número de telefone válido com DDD."
		)
		.required("Insira seu número de telefone celular."),
	confirmPhone: Yup.string()
		.matches(
			/^\(\d{2}\)\s\d{4,5}-\d{4}$/,
			"Insira um número de telefone válido com DDD."
		)
		.oneOf([Yup.ref("phone")], "Os números precisam ser iguais.")
		.required("Esse campo é obrigatório."),
});

function BasicRegisterInformationFields() {
	const { values, setValues } = useFormikContext<Values>();

	async function loadMsrRegisterData(email: string) {
		try {
			const response = await fetch(
				`/db/load-msr-register-data/?email=${email}`,
				{
					method: "GET",
				}
			);

			if (!response.ok) {
				throw new Error(response.statusText);
			}

			const data = await response.json();
			if (data.values) {
				const newValues = getFinalFormValues(values, data.values);
				setValues(newValues);
			}
		} catch (error: any) {
			logger.error(error.message);
		}
	}

	return (
		<>
			<Box pt={"3"}>
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
				label="Confirme seu e-mail"
				placeholder="Confirme seu e-mail"
				onBlur={loadMsrRegisterData}
			/>
			<TextInput
				name="phone"
				type="tel"
				label="Whatsapp"
				placeholder="Qual o seu whatsapp (com DDD)?"
				mask="(99) 99999-9999"
			/>
			<TextInput
				name="confirmPhone"
				type="tel"
				label="Confirme seu Whatsapp"
				placeholder="Confirme seu Whatsapp com DDD"
			/>
		</>
	);
}

export default function BasicRegisterInformation() {
	return (
		<Step
			validationSchema={basicRegisterInformationSchema}
			title={"Seus dados"}
			img={{
				src: "/illustrations/woman-floating.webp",
				alt: "Ilustração com uma mulher flutuando.",
			}}
		>
			<BasicRegisterInformationFields />
		</Step>
	);
}
