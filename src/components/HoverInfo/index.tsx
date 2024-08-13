"use client";
import React, { useState } from "react";
import "./HoverInfo.css";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Text } from "@radix-ui/themes";

interface HoverInfoProps {
	title: string;
	description: string;
}

const HoverInfo: React.FC<HoverInfoProps> = ({ title, description }) => {
	const [visible, setVisible] = useState(false);

	const handleMouseEnter = () => setVisible(true);
	const handleMouseLeave = () => setVisible(false);

	return (
		<div
			className="info-container"
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			<Text>{title}</Text>
			<ChevronDownIcon className={`arrow ${visible ? "rotated" : ""}`} />
			<Text
				className={`description ${visible ? "visible" : "hidden"}`}
				aria-hidden={!!visible}
			>
				{description}
			</Text>
		</div>
	);
};

export default HoverInfo;
