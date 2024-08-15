import React from "react";
import { Flex, Button } from "@radix-ui/themes";
import Image from "next/image";

const handleClick = () => {
	window.open("https://www.google.com", "_self", "noopener,noreferrer");
};

const SafeExitButton = () => (
	<Flex
		display={{ initial: "none", md: "flex" }}
		justify={"end"}
		mt={"7"}
		mr={"4"}
	>
		<Button color="pink" size={"4"} onClick={handleClick}>
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
