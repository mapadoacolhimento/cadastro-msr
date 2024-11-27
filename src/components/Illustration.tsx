import { Box, Flex } from "@radix-ui/themes";
import type { Responsive } from "@radix-ui/themes/props";
import Image from "next/image";

export default function Illustration({
	img,
	align = "center",
	isForm = true,
	backgroundColor,
	bottom,
	hideMobile = false,
}: Readonly<{
	img: { src: string; alt: string };
	align?: Responsive<"center" | "start" | "end" | "baseline" | "stretch">;
	isForm?: boolean;
	backgroundColor?: string;
	bottom?: string;
	hideMobile?: boolean;
}>) {
	return (
		<>
			<Flex
				display={{ initial: "none", md: "flex" }}
				asChild
				style={{
					backgroundColor: backgroundColor ?? "var(--yellow-2)",
					zIndex: "-1",
				}}
				justify={"center"}
				align={align}
				position={"absolute"}
				top={"0"}
				right={"0"}
				width={"55%"}
				height={"100%"}
			>
				<aside>
					<Image
						src={img.src}
						alt={img.alt}
						style={{
							height: "auto",
							position: "relative",
							bottom: bottom ?? "0",
						}}
						width={600}
						height={300}
					/>
				</aside>
			</Flex>
			{isForm ? (
				<Box
					position={"absolute"}
					right={"0"}
					bottom={
						typeof bottom !== "undefined" ? bottom : isForm ? "75px" : "0"
					}
					display={{ initial: hideMobile ? "none" : "block", md: "none" }}
				>
					<Image
						src={img.src}
						height={130}
						width={130}
						style={{ width: "auto" }}
						alt={img.alt}
					/>
				</Box>
			) : null}
		</>
	);
}
