import Image from "next/image";
import Link from "next/link";
import {
	Box,
	Button,
	Flex,
	Link as ExternalLink,
	Text,
	Strong,
} from "@radix-ui/themes";
import Illustration from "@/components/Illustration";
import MainTitle from "@/components/MainTitle";

export default function Homepage() {
	return (
		<>
			<Flex
				direction={"column"}
				align={"center"}
				gap={{ initial: "7", md: "6" }}
				maxWidth={{ initial: "100%", xs: "25rem" }}
			>
				<Box>
					<MainTitle>Estamos aqui por você</MainTitle>
					<Text align={"center"} as={"p"}>
						Preencha o formulário a seguir para solicitar atendimento
						psicológico e/ou jurídico de nossas profissionais voluntárias.
					</Text>
				</Box>

				<CriteriaBox />

				<Flex
					direction={"column"}
					align={"center"}
					pt={"4"}
					gap={{ initial: "5", md: "6" }}
				>
					<Button size={"4"} asChild>
						<Link href={"/cadastro"}>Quero ser acolhida</Link>
					</Button>

					<Box asChild maxWidth={"18rem"}>
						<Text as={"p"} size={"2"} align={"center"}>
							Ao responder as perguntas você está de acordo com a nossa{" "}
							<Strong>
								<ExternalLink
									href="https://queroseracolhida.mapadoacolhimento.org/static/politica-de-privacidade.pdf"
									target="_blank"
								>
									política de privacidade
								</ExternalLink>
							</Strong>
							.
						</Text>
					</Box>
				</Flex>
			</Flex>
			<Illustration
				isForm={false}
				align={"end"}
				img={{
					src: "/illustrations/therapy-session.svg",
					alt: "Ilustração com duas mulheres sentadas em um sofá, uma delas está segurando um balão de pensamento com um coração dentro.",
				}}
			/>
		</>
	);
}

function CriteriaBox() {
	const criteria = [
		{
			icon: {
				src: "/icons/heart.svg",
				alt: "Ícone de um coração",
			},
			text: "O atendimento é totalmente gratuito e exclusivo para mulheres vítimas de violência.",
		},
		{
			icon: {
				src: "/icons/user-profile.svg",
				alt: "Ícone de um perfil de usuário",
			},
			text: "Maiores de 18 anos, residentes do Brasil e em situação de baixa renda podem solicitar atendimento.",
		},
		{
			icon: {
				src: "/icons/planner.svg",
				alt: "Ícone de uma agenda",
			},
			text: "Todas as informações sobre o atendimento serão enviadas por e-mail.",
		},
	];
	return (
		<Box
			px={"5"}
			style={{
				backgroundColor: "var(--pink-3)",
				borderRadius: "var(--radius-3)",
				border: "1px solid",
				borderColor: "var(--pink-4)",
			}}
		>
			<ul style={{ margin: 0, padding: 0 }}>
				{criteria.map(({ icon: { alt, src }, text }, i) => (
					<Flex
						key={`criteria-${i}`}
						align={"center"}
						gap={"4"}
						py={"4"}
						asChild
						style={{
							borderBottom: i < criteria.length - 1 ? "1px solid" : 0,
							borderColor: "var(--gray-a6)",
						}}
					>
						<li key={`criteria-${alt}`}>
							<Image src={src} alt={alt} width={30} height={30} />
							<Text>{text}</Text>
						</li>
					</Flex>
				))}
			</ul>
		</Box>
	);
}
