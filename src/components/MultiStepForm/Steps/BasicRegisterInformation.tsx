import { Box } from "@radix-ui/themes";
import * as Yup from "yup";

import { useFormikContext } from "formik";
import { useState } from "react";
import { TextInput } from "../..";
import Step from "../Step";
import { updateEmptyFields } from "@/utils";
import { Values } from "@/types";

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
});

function BasicRegisterInformationFields() {
	const { values, setFieldValue, setValues } = useFormikContext();

	async function loadMsrRegisterData(email: string) {
		const response = await fetch(`/db/load-msr-register-data/?email=${email}`, {
			method: "GET",
		});
		if (response.ok) {
			const data = await response.json();
			if (data.values) {
				setFieldValue("confirmEmail", data.values.email);
				setFieldValue("phone", data.values.phone);
				const newValues = updateEmptyFields(values as Values, data.values);
				setValues(newValues);
			}
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
				onBlur={loadMsrRegisterData}
			/>
			<TextInput
				name="confirmEmail"
				type="email"
				label="Confirme seu e-mail"
				placeholder="Confirme seu e-mail"
			/>
			<TextInput
				name="phone"
				type="tel"
				label="Whatsapp"
				placeholder="Qual o seu whatsapp (com DDD)?"
				mask="(99) 99999-9999"
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
