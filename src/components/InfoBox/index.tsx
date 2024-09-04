import { Box, Flex, Text, Card, Link } from "@radix-ui/themes";
import Image from "next/image";
import "./InfoBox.css";

interface InfoBoxProps {
	imgSrc: string;
	imgAlt: string;
	title: string;
	description: string;
	link: string;
}

const InfoBox = ({
	imgSrc,
	imgAlt,
	title,
	description,
	link,
}: InfoBoxProps) => (
	<Link href={link} target={"_blank"} style={{ cursor: "pointer" }}>
		<Card
			className={"info-box-card"}
			style={{
				borderRadius: "var(--radius-4)",
				boxShadow: "none",
			}}
			size={"1"}
		>
			<Flex direction={"row"} gap={"4"}>
				<Flex
					style={{
						backgroundColor: "#ECC2CC",
						borderRadius: "var(--radius-2)",
					}}
					justify={"center"}
					align={"center"}
					px={"3"}
					width={"6.25rem"}
					height={"4.375rem"}
				>
					<Image
						src={imgSrc}
						alt={imgAlt}
						width={70}
						height={70}
						style={{ width: "auto" }}
					/>
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
					<Text size={"2"} color={"gray"}>
						{description}
					</Text>
				</Box>
			</Flex>
		</Card>
	</Link>
);

export default InfoBox;
