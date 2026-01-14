import * as Yup from "yup";
import {
	AlertDialog,
	Button,
	Flex,
	IconButton,
	Strong,
	Text,
} from "@radix-ui/themes";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { InfoCircledIcon } from "@radix-ui/react-icons";

import Step from "../Step";
import CheckboxGroupInput, { CheckboxOption } from "../../CheckboxGroupInput";
import { violenceTypeOptions } from "@/constants";
import { PropsWithChildren } from "react";
import type { Values } from "@/types";

const violenceTypeSchema = Yup.object({
	violenceType: Yup.array()
		.of(Yup.string().oneOf(violenceTypeOptions.map((a) => a.value)))
		.min(1, "Selecione um ou mais tipos de violência")
		.required("Selecione um ou mais tipos de violência"),
});

function renderDialogContent({
	name,
	fullDescription,
}: PropsWithChildren<CheckboxOption>) {
	return (
		<AlertDialog.Content size="4" maxWidth="528px">
			<AlertDialog.Title color={"purple"} highContrast size={"6"} mb={"4"}>
				{name}
			</AlertDialog.Title>
			<AlertDialog.Description size="2">
				<Flex gap={"2"} align={"center"} pb={"4"}>
					<InfoCircledIcon color={"purple"} width={"21"} height={"21"} />
					<Text color={"purple"} highContrast weight={"medium"} size={"3"}>
						Saiba mais sobre os aspectos dessa violência:
					</Text>
				</Flex>
				<Text>{fullDescription}</Text>
			</AlertDialog.Description>

			<Flex mt="7" justify="end">
				<AlertDialog.Cancel>
					<Button
						size={"3"}
						variant="outline"
						color="gray"
						style={{
							fontFamily: "var(--font-nunito-sans)",
							textTransform: "capitalize",
							fontWeight: 600,
						}}
					>
						Fechar
					</Button>
				</AlertDialog.Cancel>
			</Flex>
		</AlertDialog.Content>
	);
}

export async function handleSubmit(values: Values) {
	const selectedViolenceTypes = values.violenceType || [];
	const onlyNoViolence =
		selectedViolenceTypes.includes("noViolence") &&
		selectedViolenceTypes.length === 1;

	if (onlyNoViolence) {
		return {
			redirectTo: "/fora-criterios",
		};
	}
}

export default function ViolenceType() {
	return (
		<Step
			validationSchema={violenceTypeSchema}
			title={"Sobre a violência"}
			img={{
				src: "/illustrations/woman-covering-ears.webp",
				alt: "Ilustração de uma mulher de cabeça baixa tampando os ouvidos",
			}}
			onSubmit={handleSubmit}
		>
			<CheckboxGroupInput
				name={"violenceType"}
				options={violenceTypeOptions}
				question={
					<>
						<Strong>
							Qual(is) tipos de violência você sofreu ou está sofrendo pelo fato
							de ser mulher?
						</Strong>{" "}
						<em>
							(<Strong>Não é</Strong> necessário que você tenha experimentado
							todos os tipos de violência exemplificados nas opções abaixo.
							Qualquer uma das ações <Strong>já configura violência.</Strong>)
						</em>
					</>
				}
				actionButton={
					<IconButton variant={"ghost"}>
						<InfoCircledIcon width={"18"} height={"18"} />
						<VisuallyHidden.Root>
							Saiba mais sobre essa violência.
						</VisuallyHidden.Root>
					</IconButton>
				}
				renderDialogContent={renderDialogContent}
			/>
		</Step>
	);
}
