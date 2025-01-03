import Image from "next/image";
import { Strong } from "@radix-ui/themes";

import StatusCard from "./StatusCard";

export default function VolunteerNotFound({
	volunteerType,
	isManyVolunteers = false,
}: Readonly<{
	volunteerType: string;
	isManyVolunteers?: boolean;
}>) {
	const title = isManyVolunteers
		? "Acompanhe seu e-mail"
		: `Em busca de uma ${volunteerType} para você`;

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
			title={title}
		>
			{isManyVolunteers ? (
				<>
					Você está na fila de espera, e nossa equipe está buscando diariamente
					voluntárias disponíveis. Assim que localizarmos as voluntárias,
					entraremos em contato por e-mail.
				</>
			) : (
				<>
					Ainda não encontramos uma {volunteerType} próxima a você, mas seguimos
					buscando diariamente. Avisaremos{" "}
					<Strong style={{ color: "#565656" }}>
						por e-mail assim que localizarmos
					</Strong>{" "}
					uma {volunteerType} para atendê-la.
				</>
			)}
		</StatusCard>
	);
}
