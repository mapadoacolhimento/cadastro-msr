import { PropsWithChildren } from "react";
import { Strong } from "@radix-ui/themes";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import StatusCard from "./StatusCard";

export default function DuplicatedMatchRequest({
	isManyVolunteers = false,
	volunteerType,
}: PropsWithChildren<{
	isManyVolunteers?: boolean;
	volunteerType: string;
}>) {
	const volunteer = isManyVolunteers ? "voluntárias" : volunteerType;
	const shouldAddPlural = isManyVolunteers ? "s" : "";

	return (
		<StatusCard
			icon={
				<ExclamationTriangleIcon
					width={21}
					height={21}
					style={{ paddingRight: "8px" }}
					color={"#DAA92F"}
				/>
			}
			title={"Verifique seu e-mail"}
		>
			Identificamos que você já solicitou ajuda anteriormente.{" "}
			<Strong style={{ color: "#565656" }}>
				O contato da{shouldAddPlural} {volunteer} foi enviado para o seu e-mail.
			</Strong>{" "}
			Em até 3 dias úteis, entraremos em contato com você para entender o que
			houve e, se necessário, te indicar outra{shouldAddPlural} {volunteer}.
		</StatusCard>
	);
}
