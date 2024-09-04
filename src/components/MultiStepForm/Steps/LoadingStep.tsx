import { Flex, Text } from "@radix-ui/themes";
import Image from "next/image";
import Illustration from "@/components/Illustration";
import MainTitle from "@/components/MainTitle";

export default function LoadingStep() {
	return (
		<>
			<Flex
				height={"calc(100vh - 100px - 80px)"}
				justify={"center"}
				direction={"column"}
				align={"center"}
				gap={"6"}
			>
				<MainTitle>Cadastro realizado</MainTitle>
				<Image
					src="/icons/spinner.svg"
					alt="Ícone de círculo em movimento indicando carregamento"
					width={50}
					height={50}
				/>
				<Text align={"center"}>
					Nesse momento estamos analisando seus dados e buscando uma voluntária
					para te atender
				</Text>
			</Flex>
			<Illustration
				img={{
					src: "/illustrations/woman.svg",
					alt: "Ilustração de uma mulher com cabelo castanho escuro e blusa roxa com um coração branco do mapa do acolhimento",
				}}
			/>
		</>
	);
}
