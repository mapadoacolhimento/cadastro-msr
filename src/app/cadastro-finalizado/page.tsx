import { Flex, Text } from "@radix-ui/themes";
import Illustration from "@/components/Illustration";
import InfoBox from "@/components/InfoBox";
import MainTitle from "@/components/MainTitle";

export default function Page() {
	return (
		<>
			<MainTitle>Agora é só esperar</MainTitle>
			<Flex pb={"4"} direction={"column"} gap={"3"}>
				<Text>
					Entraremos em contato por e-mail quando houver uma voluntária
					disponível para você.
				</Text>

				<Text align={"center"}>
					Enquanto isso, preparamos esses materiais para te apoiar no seu
					caminho:
				</Text>

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
			</Flex>
			<Illustration
				isForm={false}
				align={"end"}
				img={{
					src: "/illustrations/woman-self-hug.svg",
					alt: "Ilustração de uma mulher com cabelo roxo se abraçando",
				}}
			/>
		</>
	);
}
