import Image from "next/image";
import { Box, Flex, Link, Text } from "@radix-ui/themes";

import MainTitle from "@/components/MainTitle";
import Illustration from "@/components/Illustration";
import VolunteerCard from "@/components/VolunteerCard";
import { getVolunteerType } from "@/utils";

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

	const volunteers = [psychologistVolunteer];

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
