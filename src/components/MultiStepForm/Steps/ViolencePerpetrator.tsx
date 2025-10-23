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
import { violencePerpetratorOptions } from "@/constants";
import { PropsWithChildren } from "react";
import type { Values } from "@/types";

const violencePerpetratorSchema = Yup.object({
	violenceType: Yup.array()
		.of(Yup.string().oneOf(violencePerpetratorOptions.map((a) => a.value)))
		.min(1, "Selecione uma ou mais opções")
		.required("Selecione uma ou mais opções"),
});

function renderDialogContent({
	name,
	description,
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
				<Text>{description}</Text>
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

export default function ViolencePerpetrator() {
	return (
		<Step
			validationSchema={violencePerpetratorSchema}
			title={"Dados da violência"}
			img={{
				src: "/illustrations/woman-covering-ears.webp",
				alt: "Ilustração de uma mulher de cabeça baixa tampando os ouvidos",
			}}
		>
			<CheckboxGroupInput
				name="violencePerpetrator"
				options={violencePerpetratorOptions}
				question={
					<>
						Quem <Strong>é ou foi o aturo(a)</Strong> da violência?{" "}
						<em>(Selecione todas as opções que se aplicam)</em>
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
