import { Box, Button, Flex, Heading, Progress } from "@radix-ui/themes";

export interface StepsControllerProps {
	stepName: string;
	stepNumber: number;
	isButtonDisabled: boolean;
	progress: number;
	isLastStep: boolean;
}

export default function StepsController({
	stepName,
	stepNumber,
	isButtonDisabled,
	progress,
	isLastStep,
}: Readonly<StepsControllerProps>) {
	return (
		<Box
			position={"fixed"}
			bottom={"0"}
			left={"0"}
			width={"100%"}
			style={{ background: "white" }}
		>
			<Progress
				color={"yellow"}
				size={"3"}
				radius="none"
				value={progress}
				variant={"soft"}
				max={100}
				aria-label="Barra de progresso de preenchimento do formulário."
			/>
			<Flex
				px={"6"}
				py={"4"}
				width={"100%"}
				justify={"between"}
				align={"center"}
			>
				<Heading color="purple" highContrast size={"4"} as="h2">
					{stepNumber}. {stepName}
				</Heading>
				<Button disabled={isButtonDisabled} size={"4"} type={"submit"}>
					{isLastStep ? "Enviar" : "Continuar"}
				</Button>
			</Flex>
		</Box>
	);
}
