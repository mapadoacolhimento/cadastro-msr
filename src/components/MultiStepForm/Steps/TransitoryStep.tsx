import { Flex, Link, Text } from "@radix-ui/themes";
import Image from "next/image";
import Illustration from "@/components/Illustration";
import MainTitle from "@/components/MainTitle";

export default function TransitoryStep({
	title,
	children,
}: Readonly<{ title: string; children: React.ReactNode }>) {
	return (
		<>
			<Flex
				height={"calc(100vh - 100px - 80px)"}
				justify={"center"}
				direction={"column"}
				align={"center"}
				gap={"6"}
			>
				<MainTitle>{title}</MainTitle>
				{children}
			</Flex>
			<Illustration
				bottom={"0"}
				backgroundColor={"var(--pink-3)"}
				isForm={true}
				align={"end"}
				img={{
					src: "/illustrations/woman.webp",
					alt: "Ilustração de uma mulher com cabelo castanho escuro e blusa roxa com um coração branco do mapa do acolhimento",
				}}
			/>
		</>
	);
}

TransitoryStep.Loading = () => {
	return (
		<TransitoryStep title={"Cadastro realizado"}>
			<Image
				src="/icons/spinner.svg"
				alt="Ícone de círculo em movimento indicando carregamento"
				width={50}
				height={50}
			/>
			<Text align={"center"}>
				Nesse momento estamos analisando seus dados e buscando uma voluntária
				para te atender.
			</Text>
		</TransitoryStep>
	);
};

// @ts-expect-error
TransitoryStep.Loading.displayName = "TransitoryStep.Loading";

TransitoryStep.Error = ({ errorMsg }: Readonly<{ errorMsg: string }>) => {
	return (
		<TransitoryStep title={"Ocorreu um erro inesperado"}>
			<Image
				src={"/icons/exclamation-triangle.svg"}
				alt={"Ícone de triângulo de exclamação"}
				width={32}
				height={32}
				style={{ width: "auto" }}
			/>
			<Flex direction={"column"} gap={"2"}>
				<Text align={"center"} as={"p"}>
					{errorMsg}
				</Text>
				<Text align={"center"} as={"p"}>
					Por favor, realize o cadastro novamente.
				</Text>
				<Text align={"center"} as={"p"}>
					Caso o erro persista entre em contato com nossa equipe pelo e-mail{" "}
					<Link href="mailto:atendimento@mapadoacolhimento.org">
						atendimento@mapadoacolhimento.org
					</Link>
				</Text>
			</Flex>
		</TransitoryStep>
	);
};

// @ts-expect-error
TransitoryStep.Error.displayName = "TransitoryStep.Error";
