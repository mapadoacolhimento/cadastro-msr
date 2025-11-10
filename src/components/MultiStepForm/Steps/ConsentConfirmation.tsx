import { Box, Link, Strong } from "@radix-ui/themes";
import CheckboxInput from "../../CheckboxInput";
import Step from "../Step";
import * as Yup from "yup";

const consentConfirmationSchema = Yup.object({
	consentTerms: Yup.boolean().oneOf(
		[true],
		"Você precisar aceitar o termo para receber atendimento."
	),
});

export default function ConsentConfirmation() {
	return (
		<Step
			validationSchema={consentConfirmationSchema}
			title={"Confirmação de Consentimento"}
			img={{
				src: "/illustrations/woman-floating.webp",
				alt: "Ilustração com uma mulher flutuando.",
			}}
		>
			<Box pt={"6"}>
				<Strong>
					<Link
						href="https://docs.google.com/document/d/e/2PACX-1vTI5h8RBjeC7MkZ4bAponamp02YdYhjhPCJC0dQ2kp7inzA1LPoiE_JFgOwmbwv1PPJvU4pMqfEEQn9/pub"
						target="_blank"
						rel="noopener noreferrer"
					>
						Termo de Consentimento
					</Link>
				</Strong>
				<CheckboxInput name="consentTerm">
					Estou ciente de que as informações aqui registradas são verdadeiras e
					que podem ser utilizadas (LGPD).
				</CheckboxInput>
			</Box>
		</Step>
	);
}
