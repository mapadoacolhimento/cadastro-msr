import { Box } from "@radix-ui/themes";

import Illustration from "@/components/Illustration";
import MainTitle from "@/components/MainTitle";

import type { SupportRequestData } from "@/types";
import { getVolunteerType } from "@/utils";

export default function NoMatchFound({
	supportRequests,
}: {
	supportRequests: SupportRequestData[];
}) {
	const title =
		supportRequests.length > 1
			? "voluntárias"
			: "uma " + getVolunteerType(supportRequests[0].supportType);

	return (
		<>
			<MainTitle size={"6"}>
				Ainda não encontramos {title}{" "}
				{supportRequests.length > 1 ? "disponíveis" : "disponível"}
			</MainTitle>
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
