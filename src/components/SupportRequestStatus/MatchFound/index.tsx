import Image from "next/image";
import { Box, Flex, Link, Text } from "@radix-ui/themes";

import VolunteerCard from "./VolunteerCard";
import VolunteerNotFound from "../VolunteerNotFound";
import DuplicatedMatchRequest from "../DuplicatedMatchRequest";
import MainTitle from "../../MainTitle";
import Illustration from "../../Illustration";

import { SupportRequestData } from "@/types";
import { getVolunteerType } from "@/utils";

export default function MatchFound({
	supportRequests,
}: {
	supportRequests: SupportRequestData[];
}) {
	function renderSupportRequestStatusCard(props: SupportRequestData) {
		const { status, supportRequestId, supportType } = props;

		switch (status) {
			case "duplicated":
				return <DuplicatedMatchRequest key={supportRequestId} />;
			case "waiting_for_match":
				return (
					<VolunteerNotFound key={supportRequestId} supportType={supportType} />
				);
			default:
				return <VolunteerCard key={supportRequestId} {...props} />;
		}
	}

	const title =
		supportRequests.filter((s) => s.status === "matched").length > 1
			? "duas voluntárias"
			: "uma " + getVolunteerType(supportRequests[0].supportType);

	return (
		<>
			<Flex align={"center"} direction={"column"}>
				<MainTitle size={"6"}>Encontramos {title} para acolher você!</MainTitle>
				<Text style={{ paddingTop: "8px" }}>
					Entre em contato para agendar o seu atendimento:
				</Text>
			</Flex>

			{supportRequests.map(renderSupportRequestStatusCard)}

			<Flex gap={"3"} justify={"center"} align={"center"}>
				<Image
					src="/icons/chat-msg.svg"
					alt="Balão de diálogo roxo com um coração dentro"
					width={21}
					height={21}
				/>
				<Box>
					<Text size={"2"} as={"p"}>
						O contato da voluntária foi enviado para o seu e-mail.
					</Text>
					<Text size={"2"} as={"p"}>
						Se tiver alguma dúvida, envie uma mensagem para{" "}
						<Link
							href={"mailto:atendimento@mapadoacolhimento.org"}
							target={"_blank"}
							style={{ color: "var(--accent-9)", fontWeight: "500" }}
						>
							atendimento@mapadoacolhimento.org
						</Link>
					</Text>
				</Box>
			</Flex>

			<Box display={{ initial: "none", md: "block" }}>
				<Illustration
					img={{
						src: "/illustrations/woman-getting-support.webp",
						alt: "Ilustração com duas mulheres sentadas conversando",
					}}
				/>
			</Box>
		</>
	);
}
