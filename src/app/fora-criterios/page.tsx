import { Box, Text } from "@radix-ui/themes";
import ExtraSupport from "@/components/ExtraSupport";
import Illustration from "@/components/Illustration";
import MainTitle from "@/components/MainTitle";

export default function Page() {
	return (
		<>
			<Box>
				<MainTitle>Sentimos muito</MainTitle>
				<Text align={"center"} as={"p"}>
					O Mapa do Acolhimento atende mulheres cis, trans ou travestis maiores
					de 18 anos, que vivem no Brasil e enfrentam situações de
					vulnerabilidade socioeconômica.
				</Text>
			</Box>
			<ExtraSupport />
			<Illustration
				img={{
					src: "/illustrations/computer.webp",
					alt: "Computador branco com rosa, com a logo roxa do mapa do acolhimento na tela do monitor",
				}}
			/>
		</>
	);
}
