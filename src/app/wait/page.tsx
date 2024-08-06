import { Box, Flex, Heading, Text } from "@radix-ui/themes";
import DesktopIllustration from "../../components/DesktopIllustration";
import InfoBox from "@/components/InfoBox";

export default function Page() {
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
				<Flex pb={"4"} direction={"column"} gap={"3"} maxWidth={"25rem"}>
					<Text>
						Entraremos em contato por e-mail quando houver uma voluntária
						disponível para você.
					</Text>

					<Text align={"center"}>
						Enquanto isso, preparamos esses materiais para te apoiar no seu
						caminho:
					</Text>

					<InfoBox
						imgSrc="/illustrations/woman-getting-support.svg"
						imgAlt="Mulher recebendo atendimento por outra mulher"
						title="Onde e como posso pedir ajuda?"
						description="Conheça os serviços públicos de proteção que você pode acessar."
					/>
					<InfoBox
						imgSrc="/illustrations/woman-covering-ears.svg"
						imgAlt="Mulher de cabeça baixa tampando os ouvidos"
						title="Sofri violência, e agora?"
						description="Um guia prático para deixar o ciclo da violência."
					/>
				</Flex>
			</Flex>
			<DesktopIllustration
				img={{
					src: "/illustrations/woman-self-hug.svg",
					alt: "Ilustração de uma mulher com cabelo roxo se abraçando",
				}}
			/>
		</Flex>
	);
}
