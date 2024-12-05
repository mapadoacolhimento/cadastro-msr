"use client";

import Image from "next/image";
import { Button } from "@radix-ui/themes";
import { toast } from "react-toastify";
import type { Volunteers } from "@prisma/client";

import { capitalizeFirst } from "@/utils";

type CopyVolunteerInfoButtonProps = Pick<
	Volunteers,
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
	async function copyVolunteerInformation() {
		const text = `${capitalizeFirst(volunteerType)}\nNome: ${firstName} ${lastName}\nE-mail: ${email}\nWhatsApp: https://wa.me/55${phone}\n${registrationType}: ${registrationNumber}`;
		await navigator.clipboard.writeText(text);
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
