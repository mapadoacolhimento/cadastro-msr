import { Box, Flex, Text } from "@radix-ui/themes";
import Illustration from "@/components/Illustration";
import ExtraSupport from "@/components/ExtraSupport";
import MainTitle from "@/components/MainTitle";

export default function Page() {
	return (
		<>
			<Box>
				<MainTitle>Agora é só esperar</MainTitle>
				<Text
					as={"p"}
					align={"center"}
					style={{ paddingBottom: "var(--space-5)" }}
				>
					Entraremos em contato por e-mail quando houver uma voluntária
					disponível para você.
				</Text>
				<ExtraSupport />
			</Box>
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
