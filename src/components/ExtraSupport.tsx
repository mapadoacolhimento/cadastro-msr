"use client";

import { Box, Flex, Heading, Link, Text } from "@radix-ui/themes";
import InfoBox from "./InfoBox";
import Image from "next/image";

const ExtraSupport = () => (
	<Box>
		<Box pb={"2"} asChild>
			<Heading
				as={"h2"}
				size={"5"}
				align={"center"}
				color={"purple"}
				highContrast
			>
				Como podemos te ajudar:
			</Heading>
		</Box>
		<Box pb={"5"} asChild>
			<Text align={"center"} size={"2"} as={"p"}>
				Conheça a rede de apoio que você pode acessar e um material preparado
				com cuidado para te ajudar nesse momento difícil:
			</Text>
		</Box>
		<Flex gap={"4"} direction={"column"}>
			<InfoBox
				link={"https://www.servicospublicos.mapadoacolhimento.org/"}
				imgSrc="/illustrations/woman-getting-support.svg"
				imgAlt="Mulher recebendo atendimento por outra mulher"
				title="Onde e como posso pedir ajuda?"
				description="Conheça os serviços públicos de proteção que você pode acessar."
			/>
			<InfoBox
				link={
					"https://drive.google.com/file/d/1f0BX_DEARQYgsR21yjVl71kjOlL7Rt08/view"
				}
				imgSrc="/illustrations/woman-covering-ears.svg"
				imgAlt="Mulher de cabeça baixa tampando os ouvidos"
				title="Sofri violência, e agora?"
				description="Um guia prático para deixar o ciclo da violência."
			/>
			<Flex gap={"3"} justify={"center"} align={"center"}>
				<Image
					src="/illustrations/chat-msg.svg"
					alt="Balão de diálogo roxo com um coração dentro"
					width={30}
					height={30}
				/>
				<Box>
					<Text size={"2"} as={"p"}>
						Ficou com alguma dúvida?
					</Text>
					<Text size={"2"} as={"p"}>
						Fale conosco em{" "}
						<Link
							href={"mailto:atendimento@mapadoacolhimento.org"}
							target={"_blank"}
						>
							atendimento@mapadoacolhimento.org
						</Link>
					</Text>
				</Box>
			</Flex>
		</Flex>
	</Box>
);

export default ExtraSupport;
