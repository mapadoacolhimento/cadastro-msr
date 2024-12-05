import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Box, Card, Flex, Strong, Text } from "@radix-ui/themes";

export default function DuplicatedMatchRequest() {
	return (
		<Box width={{ initial: "100%", md: "450px" }} asChild>
			<Card size={"3"} className={"volunteer-not-found__card"}>
				<Flex asChild align={"center"}>
					<Text as={"p"} color={"purple"} highContrast weight={"medium"}>
						<ExclamationTriangleIcon
							width={21}
							height={21}
							style={{ paddingRight: "8px" }}
						/>
						Verifique seu e-mail
					</Text>
				</Flex>
				<Box mt={"4"}>
					<Text size={"2"}>
						Identificamos que você já solicitou ajuda anteriormente.{" "}
						<Strong style={{ color: "#565656" }}>
							O contato da voluntária foi enviado para o seu e-mail.
						</Strong>{" "}
						Em até 3 dias úteis, entraremos em contato com você para entender o
						que houve e, se necessário, te indicar outra voluntária.
					</Text>
				</Box>
			</Card>
		</Box>
	);
}
