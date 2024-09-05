import { Button, Flex, Section } from "@radix-ui/themes";
import Image from "next/image";
import { handleClick } from "./SafeExitButton";
import Link from "next/link";

export default function Header() {
	return (
		<Section size="1" px="5" asChild>
			<header>
				<Flex
					style={{
						borderBottom: "1px solid var(--gray-4)",
					}}
					justify={"between"}
					pb={"4"}
				>
					<Link href={"/"}>
						<Image
							src="/logo.svg"
							alt="Logo Mapa do Acolhimento"
							height={30}
							width={0}
							style={{ width: "auto" }}
						/>
					</Link>

					<Flex
						display={{ initial: "flex", md: "none" }}
						justify={"end"}
						style={{ color: "purple" }}
					>
						<Button variant={"soft"} size={"3"} onClick={handleClick}>
							<Image
								src="/icons/return.svg"
								alt="Seta de retorno"
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
