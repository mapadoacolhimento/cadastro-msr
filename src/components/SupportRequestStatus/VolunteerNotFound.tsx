import Image from "next/image";
import { SupportRequests } from "@prisma/client";
import { Strong } from "@radix-ui/themes";

import StatusCard from "./StatusCard";
import { getVolunteerType } from "@/utils";

export default function VolunteerNotFound({
	supportType,
}: Readonly<{
	supportType: SupportRequests["supportType"];
}>) {
	const volunteerType = getVolunteerType(supportType);
	return (
		<StatusCard
			icon={
				<Image
					src={"/icons/search.svg"}
					alt={"Ícone de busca"}
					width={16}
					height={16}
					style={{ paddingRight: "8px" }}
				/>
			}
			title={`Em busca de uma voluntária para você`}
		>
			Você está na fila de espera, e nossa equipe está buscando diariamente
			voluntárias disponíveis para atendê-la. Assim que localizarmos uma
			voluntária,{" "}
			<Strong style={{ color: "#565656" }}>
				entraremos em contato por e-mail
			</Strong>
			.
		</StatusCard>
	);
}
