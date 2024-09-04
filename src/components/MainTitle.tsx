import { ReactNode } from "react";
import { Box, Heading } from "@radix-ui/themes";
import { Responsive } from "@radix-ui/themes/props";

export default function MainTitle({
	children,
	size,
	pt,
}: Readonly<{
	children: ReactNode;
	size?: Responsive<"5" | "1" | "2" | "3" | "4" | "6" | "7" | "8" | "9">;
	pt?: Responsive<string>;
}>) {
	return (
		<Box asChild pt={pt ?? "0"} pb={"3"}>
			<Heading
				as={"h1"}
				size={size ?? "8"}
				color={"purple"}
				highContrast
				align={"center"}
			>
				{children}
			</Heading>
		</Box>
	);
}
