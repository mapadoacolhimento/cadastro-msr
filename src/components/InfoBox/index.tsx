import { Box, Flex, Text, Card } from "@radix-ui/themes";
import Image from "next/image";
import "./InfoBox.css";

interface InfoBoxProps {
	imgSrc: string;
	imgAlt: string;
	title: string;
	description: string;
}

const InfoBox = ({ imgSrc, imgAlt, title, description }: InfoBoxProps) => (
	<Card
		className={"info-box-card"}
		style={{
			borderRadius: "var(--radius-3)",
			borderColor: "var(--pink-5)",
		}}
	>
		<Flex direction={"row"} gap={"4"}>
			<Flex
				style={{
					backgroundColor: "var(--pink-8)",
					borderRadius: "var(--radius-3)",
				}}
				justify={"center"}
				align={"center"}
				px={"3"}
			>
				<Image src={imgSrc} alt={imgAlt} width={100} height={100} />
			</Flex>
			<Box>
				<Text
					as={"p"}
					color={"purple"}
					size={"4"}
					highContrast
					weight={"bold"}
					style={{ fontFamily: "var(--heading-font-family)" }}
				>
					{title}
				</Text>
				<Text size={"2"}>{description}</Text>
			</Box>
		</Flex>
	</Card>
);

export default InfoBox;
