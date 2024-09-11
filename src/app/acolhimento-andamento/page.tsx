import { Box, Strong, Text, Link } from "@radix-ui/themes";
import ExtraSupport from "@/components/ExtraSupport";
import Illustration from "@/components/Illustration";
import MainTitle from "@/components/MainTitle";

export default function Page() {
	return (
		<>
			<Box>
				<MainTitle>Você já recebeu uma voluntária</MainTitle>
				<Text align={"center"} as={"p"}>
					Verificamos que você já solicitou ajuda anteriormente. O contato da
					voluntária foi enviado para o seu e-mail.
				</Text>
				<Text align={"center"} as={"p"}>
					De toda forma, entraremos em contato com você por e-mail em até{" "}
					<Strong>3 dias úteis</Strong> para compreender o que houve e, se
					necessário, te indicar outra voluntária. Se desejar, pode nos contatar
					diretamente pelo e-mail{" "}
					<Strong>
						<Link
							href={"mailto:atendimento@mapadoacolhimento.org"}
							target={"_blank"}
						>
							atendimento@mapadoacolhimento.org
						</Link>
					</Strong>
				</Text>
			</Box>
			<ExtraSupport />
			<Illustration
				isForm={false}
				img={{
					src: "/illustrations/computer.webp",
					alt: "Computador branco com rosa, com a logo roxa do mapa do acolhimento na tela do monitor",
				}}
			/>
		</>
	);
}
