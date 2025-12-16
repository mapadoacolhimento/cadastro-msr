import TermsAcceptanceInput from "../../TermsAcceptanceInput";
import Step from "../Step";
import * as Yup from "yup";

const consentConfirmationSchema = Yup.object({
	terms: Yup.boolean().oneOf(
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
				src: "/illustrations/woman-getting-support.webp",
				alt: "Ilustração com duas mulheres sentadas uma em frente a outra",
			}}
		>
			<TermsAcceptanceInput
				name="terms"
				termsUrl="https://drive.google.com/drive/u/0/folders/1pJ7MbDYdzyBocDqpc7-MN8kJehU5af1D"
				termsLinkText="Termo de Consentimento"
			>
				Estou ciente de que as informações aqui registradas são verdadeiras e
				que podem ser utilizadas (LGPD).
			</TermsAcceptanceInput>
		</Step>
	);
}
