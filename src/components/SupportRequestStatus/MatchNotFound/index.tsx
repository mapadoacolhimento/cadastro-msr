"use server";

import Image from "next/image";
import { Box, Flex, Link, Text } from "@radix-ui/themes";

import MainTitle from "../../MainTitle";
import Illustration from "../../Illustration";
import VolunteerNotFound from "../VolunteerNotFound";
import DuplicatedMatchRequest from "../DuplicatedMatchRequest";

import { SupportRequestData } from "@/types";
import { getVolunteerType } from "@/utils";
import { PropsWithChildren } from "react";

const getRepeatingStatus = (supportRequests: SupportRequestData[]) => {
	const hasOnlyDuplicatedRequests = supportRequests.every(
		({ status }) => status === "duplicated"
	);
	if (hasOnlyDuplicatedRequests) return "duplicated";

	const hasOnlyWaitingMatch = supportRequests.every(
		({ status }) => status === "waiting_for_match"
	);
	if (hasOnlyWaitingMatch) return "waiting_for_match";

	return null;
};

export default async function MatchNotFound({
	supportRequests,
}: PropsWithChildren<{
	supportRequests: SupportRequestData[];
}>) {
	const repeatingStatus = getRepeatingStatus(supportRequests);
	const hasManySupportRequests = supportRequests.length > 1;
	const uniqueSupportRequests = repeatingStatus
		? [supportRequests[0]]
		: supportRequests;

	function renderSupportRequestStatusCard({
		status,
		supportRequestId,
		supportType,
	}: SupportRequestData) {
		const volunteerType = getVolunteerType(supportType);

		if (status === "duplicated")
			return (
				<DuplicatedMatchRequest
					key={supportRequestId}
					volunteerType={volunteerType}
					isManyVolunteers={
						hasManySupportRequests && repeatingStatus === "duplicated"
					}
				/>
			);

		return (
			<VolunteerNotFound
				key={supportRequestId}
				volunteerType={volunteerType}
				isManyVolunteers={
					hasManySupportRequests && repeatingStatus === "waiting_for_match"
				}
			/>
		);
	}

	const getTitle = (volunteerType: string) => {
		if (repeatingStatus === "duplicated") {
			const volunteerName = hasManySupportRequests
				? "das voluntárias"
				: "de uma " + volunteerType;
			return `Você já recebeu o contato ${volunteerName}`;
		}

		if (repeatingStatus === "waiting_for_match") {
			const volunteerName = hasManySupportRequests
				? "voluntárias disponíveis"
				: "uma " + volunteerType + " disponível";

			return `Ainda não encontramos ${volunteerName}`;
		}

		return "Atualização sobre seus pedidos de acolhimento";
	};

	return (
		<>
			<MainTitle size={"6"}>
				{getTitle(getVolunteerType(supportRequests[0].supportType))}
			</MainTitle>

			{uniqueSupportRequests.map(renderSupportRequestStatusCard)}

			<Flex gap={"3"} justify={"center"} align={"center"}>
				<Image
					src="/icons/chat-msg.svg"
					alt="Balão de diálogo roxo com um coração dentro"
					width={21}
					height={21}
				/>

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
			</Flex>

			<Box display={{ initial: "none", md: "block" }}>
				<Illustration
					img={{
						src: "/illustrations/woman-getting-support.webp",
						alt: "Ilustração com duas mulheres sentadas conversando",
					}}
					backgroundColor={"var(--pink-3)"}
				/>
			</Box>
		</>
	);
}
