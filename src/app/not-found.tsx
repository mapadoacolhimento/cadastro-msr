import NextLink from "next/link";
import { Heading, Text, Button, Flex, Container } from "@radix-ui/themes";
import Illustration from "@/components/Illustration";
import MainTitle from "@/components/MainTitle";

export default function Custom404() {
	return (
		<Container>
			<Flex
				pt={"9"}
				direction={"column"}
				align={"center"}
				justify={"center"}
				gapY={"2"}
			>
				<MainTitle size={"9"}>404</MainTitle>

				<Flex align={"center"} direction={"column"}>
					<Heading as={"h2"} size="4">
						Página não encontrada
					</Heading>

					<Text>Sentimos muito, mas página que você buscou não existe.</Text>
				</Flex>

				<NextLink href="/">
					<Button style={{ cursor: "pointer", marginTop: "var(--space-3)" }}>
						Ir para página inicial
					</Button>
				</NextLink>
			</Flex>
			<Illustration
				img={{
					src: "/illustrations/woman-sitting-down.webp",
					alt: "Mulher de blusa amarela e calça roxa, sentada de pernas cruzadas com uma almofada de coração roxa",
				}}
			/>
		</Container>
	);
}
