import React from "react";
import { Flex, Button } from "@radix-ui/themes";
import Image from "next/image";

export const handleClick = () => {
	window.location.replace("https://www.google.com");
};

const SafeExitButton = () => (
	<Flex
		display={{ initial: "none", md: "flex" }}
		justify={"end"}
		mt={"7"}
		mr={"6"}
	>
		<Button
			color={"purple"}
			size={"4"}
			onClick={handleClick}
			style={{ cursor: "pointer" }}
			highContrast
		>
			<Image
				src="/icons/return.svg"
				alt="ícone de seta de retorno"
				width={"18"}
				height={"18"}
			/>
			Sair desse site
		</Button>
	</Flex>
);

export default SafeExitButton;
