import React from "react";
import { Flex, Button, Text } from "@radix-ui/themes";
import Image from "next/image";

export const handleClick = () => {
	window.location.replace("https://www.google.com");
};

const SafeExitButton = () => (
	<Flex
		display={{ initial: "none", md: "flex" }}
		justify={"end"}
		style={{
			position: "fixed",
			top: "80px",
			right: "24px",
			zIndex: 1000,
		}}
	>
		<Flex asChild justify={"center"}>
			<Button
				color={"pink"}
				size={"3"}
				onClick={handleClick}
				style={{ cursor: "pointer" }}
			>
				<Image
					src="/icons/return.svg"
					alt="Seta de retorno"
					height={0}
					width={18}
					style={{ height: "auto", paddingBottom: "6px" }}
				/>
				<Text color={"purple"} highContrast>
					Sair desse site
				</Text>
			</Button>
		</Flex>
	</Flex>
);

export default SafeExitButton;
