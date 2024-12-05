import { getVolunteerType } from "@/utils";
import { SupportRequests } from "@prisma/client";
import { Box, Card, Flex, Strong, Text } from "@radix-ui/themes";
import Image from "next/image";

export default function VolunteerNotFound({
	supportType,
}: Readonly<{
	supportType: SupportRequests["supportType"];
}>) {
	const volunteerType = getVolunteerType(supportType);
	return (
		<Box width={{ initial: "100%", md: "450px" }} asChild>
			<Card size={"3"} className={"volunteer-not-found__card"}>
				<Flex asChild align={"center"}>
					<Text as={"p"} color={"purple"} highContrast weight={"medium"}>
						<Image
							src={"/icons/search.svg"}
							alt={"Ícone de busca"}
							width={16}
							height={16}
							style={{ paddingRight: "8px" }}
						/>
						Em busca de uma {volunteerType} para você
					</Text>
				</Flex>
				<Box mt={"4"}>
					<Text size={"2"}>
						Ainda não encontramos uma voluntária próxima a você, mas seguimos
						buscando diariamente. Avisaremos{" "}
						<Strong style={{ color: "#565656" }}>
							por e-mail assim que localizarmos
						</Strong>{" "}
						uma {volunteerType} para atendê-la.
					</Text>
				</Box>
			</Card>
		</Box>
	);
}
