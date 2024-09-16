"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Text, Box, Flex } from "@radix-ui/themes";
import "./HoverInfo.css";

interface HoverInfoProps {
	title: string;
	description: string;
}

const HoverInfo: React.FC<HoverInfoProps> = ({ title, description }) => {
	const [visible, setVisible] = useState(false);

	const handleMouseEnter = () => setVisible(true);
	const handleMouseLeave = () => setVisible(false);

	return (
		<>
			<Flex
				align={"center"}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				style={{ cursor: "pointer" }}
				width={"100%"}
				justify={"center"}
				pt={"2"}
			>
				<Text weight={"medium"}>{title}</Text>
				<Image
					src={"/icons/chevron-down.svg"}
					className={`arrow ${visible ? "rotated" : ""}`}
					alt="Ícone de seta para baixo"
					width={12}
					height={8}
				/>
			</Flex>
			<Box className={`description ${visible ? "visible" : "hidden"}`}>
				<Text
					aria-hidden={!visible}
					hidden={!visible}
					size={"2"}
					style={{ textAlign: "center" }}
					as={"p"}
				>
					{description}
				</Text>
			</Box>
		</>
	);
};

export default HoverInfo;
