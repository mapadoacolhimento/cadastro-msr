import { Box, Flex } from "@radix-ui/themes";
import type { Responsive } from "@radix-ui/themes/props";

export default function Illustration({
	img,
	align = "center",
	isForm = true,
}: Readonly<{
	img: { src: string; alt: string };
	align?: Responsive<"center" | "start" | "end" | "baseline" | "stretch">;
	isForm?: boolean;
}>) {
	return (
		<>
			<Flex
				display={{ initial: "none", md: "flex" }}
				asChild
				style={{ backgroundColor: "var(--yellow-2)", zIndex: "-1" }}
				justify={"center"}
				align={align}
				position={"absolute"}
				top={"0"}
				right={"0"}
				width={"55%"}
				height={"100%"}
			>
				<aside>
					<img src={img.src} alt={img.alt} style={{ maxWidth: "95%" }} />
				</aside>
			</Flex>
			<Box
				position={"absolute"}
				right={"0"}
				bottom={isForm ? "115px" : "0"}
				display={{ initial: "block", md: "none" }}
			>
				<img src={img.src} height={"150px"} alt={img.alt} />
			</Box>
		</>
	);
}
