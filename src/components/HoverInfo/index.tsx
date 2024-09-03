"use client";
import React, { useState } from "react";
import "./HoverInfo.css";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Text, Box, Flex } from "@radix-ui/themes";

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
				<ChevronDownIcon
					className={`arrow ${visible ? "rotated" : ""}`}
					color={"purple"}
				/>
			</Flex>
			<Box className={`description ${visible ? "visible" : "hidden"}`}>
				<Text
					aria-hidden={!!visible}
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
