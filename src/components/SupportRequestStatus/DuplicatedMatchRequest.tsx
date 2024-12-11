import { PropsWithChildren } from "react";
import { Strong } from "@radix-ui/themes";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import StatusCard from "./StatusCard";

export default function DuplicatedMatchRequest() {
	return (
		<StatusCard
			icon={
				<ExclamationTriangleIcon
					width={21}
					height={21}
					style={{ paddingRight: "8px" }}
				/>
			}
			title={"Verifique seu e-mail"}
		>
			Identificamos que você já solicitou ajuda anteriormente.{" "}
			<Strong style={{ color: "#565656" }}>
				O contato da(s) voluntária(s) foi enviado para o seu e-mail.
			</Strong>{" "}
			Em até 3 dias úteis, entraremos em contato com você para entender o que
			houve e, se necessário, te indicar outra(s) voluntária(s).
		</StatusCard>
	);
}
