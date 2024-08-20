import * as Yup from "yup";
import { Box } from "@radix-ui/themes";

import Step from "../Step";
import { TextInput } from "../..";
import { sleep } from "../../../lib";

const basicRegisterInformationSchema = Yup.object({
	firstName: Yup.string().required("Insira seu primeiro nome."),
	email: Yup.string()
		.email("Insira um e-mail válido.")
		.required("Insira seu e-mail."),
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

export default function BasicRegisterInformation() {
	return (
		<Step
			onSubmit={async (values) =>
				await sleep(300).then(() => console.log(values))
			}
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
				label="Confirme seu e-mail"
				placeholder="Confirme seu e-mail"
			/>
			<TextInput
				name="phone"
				type="phone"
				label="Whatsapp"
				placeholder="Qual o seu whatsapp (com DDD)?"
				mask="(99) 99999-9999"
			/>
		</Step>
	);
}
