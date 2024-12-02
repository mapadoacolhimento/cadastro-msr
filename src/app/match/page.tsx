import Image from "next/image";
import { Box, Button, Card, Flex, Heading, Link, Text } from "@radix-ui/themes";
import { EnvelopeClosedIcon, PersonIcon } from "@radix-ui/react-icons";

import MainTitle from "@/components/MainTitle";
import Illustration from "@/components/Illustration";
import CopyVolunteerInfoButton from "@/components/CopyVolunteerInfoButton";
import { formatPhoneNumber } from "@/utils";
import { VolunteerMatch } from "@/types";

const getVolunteerType = (volunteerType: string) =>
	volunteerType === "psychologist" ? "psicóloga" : "advogada";

function VolunteerCard(props: VolunteerMatch) {
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
						<Text
							color={"purple"}
							style={{ textTransform: "capitalize" }}
							size={"2"}
							highContrast
						>
							{volunteerType} |{" "}
							<Text style={{ textTransform: "capitalize" }}>
								{city.toLowerCase()}
							</Text>{" "}
							- {state}
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
					<Flex display={"inline-flex"} gap={"3"} align={"center"} asChild>
						<Text as={"p"}>
							<EnvelopeClosedIcon
								color={"purple"}
								width={"16px"}
								height={"16px"}
							/>{" "}
							{email}
						</Text>
					</Flex>
					<Flex display={"inline-flex"} gap={"3"} align={"center"} asChild>
						<Text as={"p"}>
							<Image
								src={"/icons/phone.svg"}
								alt={"Ícone de telefone"}
								width={16}
								height={16}
							/>{" "}
							{formatPhoneNumber(phone)}
						</Text>
					</Flex>
					<Flex display={"inline-flex"} gap={"3"} align={"center"} asChild>
						<Text as={"p"}>
							<PersonIcon color={"purple"} width={"16px"} height={"16px"} />
							{registrationType}: {registrationNumber}
						</Text>
					</Flex>
				</Flex>
				<Flex gap={"3"}>
					<Link href={`https://wa.me/55${phone}`} target={"_blank"}>
						<Button style={{ cursor: "pointer" }} size={"3"}>
							<Image
								src={"/icons/whatsapp.svg"}
								alt={"Ícone do aplicativo Whatsapp"}
								width={16}
								height={16}
							/>
							Enviar Whatsapp
						</Button>
					</Link>
					<Link href={`mailto:${email}`}>
						<Button color={"yellow"} style={{ cursor: "pointer" }} size={"3"}>
							<EnvelopeClosedIcon
								color={"white"}
								width={"16px"}
								height={"16px"}
							/>{" "}
							<Text style={{ color: "#fff" }}>Enviar e-mail</Text>
						</Button>
					</Link>
				</Flex>
			</Card>
		</Box>
	);
}

export default function Page() {
	const psychologistVolunteer = {
		id: 1,
		firstName: "Joana",
		lastName: "Nascimento",
		email: "joana.nascimento@gmail.com",
		phone: "92988426606",
		registrationNumber: "11.1111/11",
		occupation: "psychologist",
		city: "ARACAJU",
		state: "SE",
	};

	const lawyerVolunteer = {
		id: 2,
		firstName: "Mariana",
		lastName: "Arruda",
		email: "mariana.arruda@gmail.com",
		phone: "92988426606",
		registrationNumber: "11.1666/11",
		occupation: "lawyer",
		city: "RECIFE",
		state: "PE",
	};

	const volunteers = [psychologistVolunteer, lawyerVolunteer];

	const title =
		volunteers.length > 1
			? "duas voluntárias"
			: getVolunteerType(volunteers[0].occupation);

	return (
		<>
			<Flex align={"center"} direction={"column"}>
				<MainTitle size={"6"}>Encontramos {title} para acolher você!</MainTitle>
				<Text style={{ paddingTop: "8px" }}>
					Entre em contato para agendar o seu atendimento:
				</Text>
			</Flex>

			{volunteers.map((volunteer) => (
				<VolunteerCard key={volunteer.id} {...volunteer} />
			))}

			<Flex gap={"3"} justify={"center"} align={"center"}>
				<Image
					src="/icons/chat-msg.svg"
					alt="Balão de diálogo roxo com um coração dentro"
					width={21}
					height={21}
				/>
				<Box>
					<Text size={"2"} as={"p"}>
						O contato da voluntária foi enviado para o seu e-mail.
					</Text>
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
				</Box>
			</Flex>

			<Box display={{ initial: "none", md: "block" }}>
				<Illustration
					img={{
						src: "/illustrations/woman-getting-support.webp",
						alt: "Ilustração com duas mulheres sentadas conversando",
					}}
					isForm={false}
				/>
			</Box>
		</>
	);
}
