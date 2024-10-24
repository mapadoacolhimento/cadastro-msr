import * as Yup from "yup";
import { Box, Text, Flex, Button } from "@radix-ui/themes";

import Step from "../Step";

export default function BeginRegistration() {
	return (
		<Step
			validationSchema={Yup.object({})}
			title={"Você não está sozinha"}
			img={{
				src: "/illustrations/women-supporting.webp",
				alt: "Ilustração com três mulheres, em que uma delas está sendo acolhida pelas outras duas da ponta.",
				align: "end",
				bottom: "75px",
			}}
		>
			<Flex
				justify={"center"}
				direction={"column"}
				height={"100%"}
				align={"center"}
			>
				<Box pb={{ initial: "5", sm: "6" }} width={"100%"}>
					<Text align={"center"} as={"p"} size={"3"}>
						Com base nas suas respostas identificamos que você pode ser atendida
						pelo projeto. Agora precisamos de mais algumas informações para
						concluir o seu cadastro e te direcionar para o atendimento adequado.
						Vamos lá?
					</Text>
				</Box>

				<Button size={"4"} type={"submit"}>
					Iniciar cadastro
				</Button>
			</Flex>
		</Step>
	);
}
