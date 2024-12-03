import Image from "next/image";
import { Box, Button, Card, Flex, Heading, Link, Text } from "@radix-ui/themes";
import { EnvelopeClosedIcon, PersonIcon } from "@radix-ui/react-icons";

import CopyVolunteerInfoButton from "./CopyVolunteerInfoButton";
import { capitalizeFirst, formatPhoneNumber, getVolunteerType } from "@/utils";
import { VolunteerMatch } from "@/types";

export default function VolunteerCard(props: VolunteerMatch) {
	const {
		firstName,
		lastName,
		occupation,
		city,
		state,
		email,
		phone,
		registrationNumber,
	} = props;
	const registrationType = occupation === "psychologist" ? "CRP" : "OAB";
	const volunteerType = getVolunteerType(occupation);
	const volunteerInfo = [
		{
			Icon: () => (
				<EnvelopeClosedIcon color={"purple"} width={16} height={16} />
			),
			value: email,
		},
		{
			Icon: () => (
				<Image
					src={"/icons/phone.svg"}
					alt={"Ícone de telefone"}
					width={16}
					height={16}
				/>
			),
			value: formatPhoneNumber(phone),
		},
		{
			Icon: () => <PersonIcon color={"purple"} width={16} height={16} />,
			value: `${registrationType}: ${registrationNumber}`,
		},
	];
	return (
		<Box width={{ initial: "100%", md: "450px" }} asChild>
			<Card size={"3"}>
				<Flex justify={"between"}>
					<Box pb={"5"}>
						<Heading color={"purple"} asChild highContrast size={"5"}>
							<Text as={"p"}>
								{firstName} {lastName}
							</Text>
						</Heading>
						<Text color={"purple"} size={"2"} highContrast>
							{capitalizeFirst(volunteerType)} |{" "}
							<Text>{capitalizeFirst(city.toLowerCase())}</Text> - {state}
						</Text>
					</Box>
					<CopyVolunteerInfoButton
						{...props}
						volunteerType={volunteerType}
						registrationType={registrationType}
					/>
				</Flex>
				<Flex
					direction={"column"}
					pb={"5"}
					style={{ color: "#565656", fontSize: "0.813rem" }}
					gap={"1"}
				>
					{volunteerInfo.map(({ Icon, value }) => (
						<Flex
							display={"inline-flex"}
							gap={"3"}
							align={"center"}
							asChild
							key={value}
						>
							<Text as={"p"}>
								<Icon /> {value}
							</Text>
						</Flex>
					))}
				</Flex>
				<Flex gap={"3"}>
					<Button style={{ cursor: "pointer" }} size={"3"} asChild>
						<Link href={`https://wa.me/55${phone}`} target={"_blank"}>
							<Image
								src={"/icons/whatsapp.svg"}
								alt={"Ícone do aplicativo Whatsapp"}
								width={16}
								height={16}
							/>
							Enviar Whatsapp
						</Link>
					</Button>
					<Button
						color={"yellow"}
						style={{ cursor: "pointer" }}
						size={"3"}
						asChild
					>
						<Link href={`mailto:${email}`}>
							<EnvelopeClosedIcon
								color={"white"}
								width={"16px"}
								height={"16px"}
							/>{" "}
							<Text style={{ color: "#fff" }}>Enviar e-mail</Text>
						</Link>
					</Button>
				</Flex>
			</Card>
		</Box>
	);
}
