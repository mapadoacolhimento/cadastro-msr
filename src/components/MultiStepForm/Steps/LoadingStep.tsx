import { Box, Flex, Heading, Text } from "@radix-ui/themes";
import DesktopIllustration from "../../DesktopIllustration";
import Image from "next/image";

export default function LoadingStep() {
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
						Agora é só esperar
					</Heading>
				</Box>
				<Flex
					align="center"
					gap="4"
					direction={"column"}
					maxWidth={"20rem"}
					justify={"center"}
				>
					<Image
						src="/icons/spinner.svg"
						alt="Ícone de círculo em movimento indicando carregamento"
						width={50}
						height={50}
					/>
					<Text align={"center"}>
						Nesse momento estamos analisando seus dados e em breve buscaremos
						uma voluntária para te atender
					</Text>
				</Flex>
			</Flex>
			<DesktopIllustration
				img={{
					src: "/illustrations/woman.svg",
					alt: "Ilustração de uma mulher com cabelo castanho escuro e blusa roxa com um coração branco do mapa do acolhimento",
				}}
			/>
			<Flex
				position={"absolute"}
				right={"0"}
				bottom={"0"}
				display={{ initial: "flex", md: "none" }}
			>
				<Image
					src="/illustrations/woman.svg"
					width={200}
					height={200}
					alt="Ilustração de uma mulher com cabelo castanho escuro e blusa roxa com um coração branco do mapa do acolhimento"
				/>
			</Flex>
		</Flex>
	);
}
