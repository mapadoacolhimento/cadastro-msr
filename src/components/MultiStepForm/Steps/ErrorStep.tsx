import { Flex, Text } from "@radix-ui/themes";
import Illustration from "@/components/Illustration";
import MainTitle from "@/components/MainTitle";

interface ErrorStepProps {
	message: string;
}

export default function ErrorStep({ message }: Readonly<ErrorStepProps>) {
	return (
		<>
			<MainTitle>Ocorreu um erro inesperado</MainTitle>
			<Flex align="center" gap="4" direction={"column"} justify={"center"}>
				<Text align={"center"}>{message}</Text>
				<Text align={"center"}>Por favor, realize o cadastro novamente</Text>
			</Flex>
			<Illustration
				img={{
					src: "/illustrations/woman.svg",
					alt: "Ícone de erro",
				}}
			/>
		</>
	);
}
