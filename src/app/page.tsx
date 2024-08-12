import Image from "next/image";
import Link from "next/link";
import {
	Box,
	Button,
	Flex,
	Heading,
	Link as ExternalLink,
	Separator,
	Text,
	Strong,
} from "@radix-ui/themes";
import Illustration from "../components/Illustration";

export default function Homepage() {
	return (
		<>
			<Flex
				width={"100%"}
				py={{ initial: "8", md: "9" }}
				px={{ initial: "6", md: "7" }}
				justify={"center"}
			>
				<Flex
					direction={"column"}
					align={"center"}
					gap={{ initial: "7", md: "8" }}
					maxWidth={{ initial: "100%", xs: "25rem" }}
				>
					<Box>
						<Heading
							as={"h1"}
							size={"8"}
							align={"center"}
							color={"purple"}
							highContrast
						>
							Estamos aqui por você
						</Heading>
						<Text align={"center"} mt={"4"} as={"p"}>
							Preencha o formulário a seguir para solicitar atendimento
							psicológico e/ou jurídico de nossas profissionais voluntárias.
						</Text>
					</Box>

					<CriteriaBox />

					<Flex direction={"column"} align={"center"}>
						<Box asChild width={"15.625rem"}>
							<Button size={"4"}>
								<Link href={"/cadastro"}>Quero ser acolhida</Link>
							</Button>
						</Box>

						<Text
							as={"p"}
							size={"2"}
							align={"center"}
							mt={{ initial: "5", md: "6" }}
						>
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
					</Flex>
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
					<>
						<Flex align={"center"} gap={"4"} py={"4"} asChild>
							<li key={`criteria-${alt}`}>
								<Image src={src} alt={alt} width={30} height={30} />
								<Text>{text}</Text>
							</li>
						</Flex>
						{i < criteria.length - 1 ? (
							<Separator orientation="horizontal" size="4" />
						) : null}
					</>
				))}
			</ul>
		</Box>
	);
}
