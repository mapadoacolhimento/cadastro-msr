import { Button, Flex, Section } from "@radix-ui/themes";
import Image from "next/image";
import { handleClick } from "./SafeExitButton";

export default function Header() {
	return (
		<Section size="1" px="5" asChild>
			<header>
				<Flex
					style={{
						borderBottom: "1px solid var(--gray-4)",
						justifyContent: "space-between",
					}}
					pb={"4"}
				>
					<Image
						src="/logo.svg"
						alt="Logo Mapa do Acolhimento"
						height={30}
						width={0}
						style={{ width: "auto" }}
					/>

					<Flex display={{ initial: "flex", md: "none" }} justify={"end"}>
						<Button
							style={{ backgroundColor: "#EBE5EF" }}
							size={"2"}
							onClick={handleClick}
						>
							<Image
								src="/icons/mobile-return.svg"
								alt="ícone de seta de retorno"
								width={"16"}
								height={"16"}
							/>
						</Button>
					</Flex>
				</Flex>
			</header>
		</Section>
	);
}
