import Image from "next/image";
import { Box, Flex, Link, Text } from "@radix-ui/themes";

import MainTitle from "../../MainTitle";
import Illustration from "../../Illustration";
import VolunteerNotFound from "../VolunteerNotFound";
import DuplicatedMatchRequest from "../DuplicatedMatchRequest";

import { SupportRequestData } from "@/types";
import { getVolunteerType } from "@/utils";
import { PropsWithChildren } from "react";

export default function MatchNotFound({
	supportRequests,
}: PropsWithChildren<{
	supportRequests: SupportRequestData[];
}>) {
	function renderSupportRequestStatusCard({
		status,
		supportRequestId,
		supportType,
	}: SupportRequestData) {
		switch (status) {
			case "duplicated":
				return <DuplicatedMatchRequest key={supportRequestId} />;
			default:
				return (
					<VolunteerNotFound key={supportRequestId} supportType={supportType} />
				);
		}
	}

	const getTitle = (supportRequests: SupportRequestData[]) => {
		const volunteerType = getVolunteerType(supportRequests[0].supportType);

		const hasOnlyDuplicatedRequest = supportRequests.every(
			({ status }) => status === "duplicated"
		);
		if (hasOnlyDuplicatedRequest) {
			const volunteerName =
				supportRequests.length > 1
					? "das voluntárias"
					: "de uma " + volunteerType;
			return `Você já recebeu o contato ${volunteerName}`;
		}
		const validSupportRequests = supportRequests.filter(
			({ status }) => status !== "duplicated"
		);
		const hasOnlyWaitingMatch = supportRequests.every(
			({ status }) => status === "waiting_for_match"
		);

		if (hasOnlyWaitingMatch) {
			const volunteerName =
				validSupportRequests.length > 1
					? "voluntárias disponíveis"
					: "uma " + volunteerType + " disponível";

			return `Ainda não encontramos ${volunteerName}`;
		}

		return "";
	};

	return (
		<>
			<MainTitle size={"6"}>{getTitle(supportRequests)}</MainTitle>

			{supportRequests.map(renderSupportRequestStatusCard)}

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
