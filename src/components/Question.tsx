import { Box, Text } from "@radix-ui/themes";
import { ReactNode } from "react";

export default function Question({
	children,
	...props
}: Readonly<{ children: ReactNode; id?: string }>) {
	return (
		<Box asChild pb={{ initial: "5", sm: "6" }}>
			<Text asChild align={"center"} as={"p"} size={"3"} {...props}>
				<legend>{children}</legend>
			</Text>
		</Box>
	);
}
