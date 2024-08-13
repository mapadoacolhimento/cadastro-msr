import Illustration from "../../Illustration";
import { Box, Flex, Heading, Text } from "@radix-ui/themes";
import Image from "next/image";

interface ErrorStepProps {
	message: string;
}

export default function ErrorStep({ message }: Readonly<ErrorStepProps>) {
	return (
		<Flex
			width={"100%"}
			justify={"center"}
			py={{ initial: "8", md: "9" }}
			px={{ initial: "6", md: "7" }}
		>
			<Flex direction={"column"} align={"center"} maxWidth={"30rem"}>
				<Box asChild pb={"4"}>
					<Heading
						as={"h1"}
						size={"8"}
						align={"center"}
						color={"purple"}
						highContrast
					>
						Ocorreu um erro inesperado
					</Heading>
				</Box>
				<Flex
					align="center"
					gap="4"
					direction={"column"}
					maxWidth={"20rem"}
					justify={"center"}
				>
					<Text align={"center"}>{message}</Text>
					<Text align={"center"}>Por favor, realize o cadastro novamente</Text>
				</Flex>
			</Flex>
			<Illustration
				img={{
					src: "/icons/error.svg",
					alt: "Ícone de erro",
				}}
			/>
		</Flex>
	);
}
