"use client";

import { VolunteerMatch } from "@/types";
import { capitalizeFirst } from "@/utils";
import { Button } from "@radix-ui/themes";
import Image from "next/image";
import { toast } from "react-toastify";

type CopyVolunteerInfoButtonProps = Pick<
	VolunteerMatch,
	"firstName" | "lastName" | "email" | "phone" | "registrationNumber"
> & { registrationType: string; volunteerType: string };

export default function CopyVolunteerInfoButton({
	firstName,
	lastName,
	email,
	phone,
	registrationNumber,
	registrationType,
	volunteerType,
}: CopyVolunteerInfoButtonProps) {
	function copyVolunteerInformation() {
		const text = `
${capitalizeFirst(volunteerType)}
Nome: ${firstName} ${lastName}
E-mail: ${email}
WhatsApp: https://wa.me/55${phone}
${registrationType}: ${registrationNumber}
`;
		navigator.clipboard.writeText(text);
		toast("Informações copiada com sucesso", {
			position: "top-right",
			autoClose: 5000,
			hideProgressBar: true,
			closeOnClick: true,
			pauseOnHover: true,
			progress: undefined,
			theme: "colored",
			type: "success",
			style: {
				backgroundColor: "var(--purple-9)",
			},
		});
	}

	return (
		<Button
			variant={"ghost"}
			color={"gray"}
			style={{
				textTransform: "initial",
				fontSize: "0.813rem",
				alignContent: "center",
				cursor: "pointer",
			}}
			onClick={copyVolunteerInformation}
		>
			<Image
				src={"/icons/copy.svg"}
				alt={"Ícone de copiar"}
				width={13}
				height={16}
			/>{" "}
			Copiar dados
		</Button>
	);
}