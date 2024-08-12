import { Box, Flex, Heading, Strong, Text, Link } from "@radix-ui/themes";
import Contact from "../../components/Contact";
import ExtraSupport from "../../components/ExtraSupport";
import Illustration from "../../components/Illustration";

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
						Você já recebeu uma voluntária
					</Heading>
				</Box>
				<Text align={"center"}>
					Verificamos que você já solicitou ajuda anteriormente. O contato da
					voluntária foi enviado para o seu e-mail.
				</Text>
				<br />
				<Text align={"center"}>
					De toda forma, entraremos em contato com você por e-mail em até{" "}
					<Strong>3 dias úteis</Strong> para compreender o que houve e, se
					necessário, te indicar outra voluntária. Se desejar, pode nos contatar
					diretamente pelo e-mail{" "}
					<Link
						href={"mailto:atendimento@mapadoacolhimento.org"}
						target={"_blank"}
					>
						atendimento@mapadoacolhimento.org
					</Link>
				</Text>
				<br />
				<Box pb={{ initial: "7", sm: "8" }} asChild>
					<Text align={"center"}>Obrigada pela confiança!</Text>
				</Box>
				<ExtraSupport />
				<Contact />
			</Flex>
			<Illustration
				img={{
					src: "/illustrations/laptop.svg",
					alt: "Computador branco com rosa, com a logo roxa do mapa do acolhimento na tela do monitor",
				}}
			/>
		</Flex>
	);
}
