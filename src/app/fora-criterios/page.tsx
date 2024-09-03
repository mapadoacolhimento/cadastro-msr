import { Box, Heading, Text } from "@radix-ui/themes";
import ExtraSupport from "../../components/ExtraSupport";
import Illustration from "../../components/Illustration";

export default function Page() {
	return (
		<>
			<Box>
				<Box asChild pb={"5"}>
					<Heading
						as={"h1"}
						size={"8"}
						align={"center"}
						color={"purple"}
						highContrast
					>
						Sentimos muito
					</Heading>
				</Box>
				<Text align={"center"} as={"p"}>
					O Mapa do Acolhimento atende mulheres cis, trans ou travestis maiores
					de 18 anos, que vivem no Brasil e enfrentam situações de
					vulnerabilidade socioeconômica.
				</Text>
			</Box>
			<ExtraSupport />
			<Illustration
				isForm={false}
				img={{
					src: "/illustrations/laptop.svg",
					alt: "Computador branco com rosa, com a logo roxa do mapa do acolhimento na tela do monitor",
				}}
			/>
		</>
	);
}
