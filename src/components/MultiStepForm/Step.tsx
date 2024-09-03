import type { PropsWithChildren } from "react";
import type { StepChildrenProps } from "@/types";
import { Flex } from "@radix-ui/themes";

export default function Step({
	children,
}: PropsWithChildren<StepChildrenProps>) {
	return (
		<Flex maxWidth={"22rem"} width={"100%"} direction={"column"} gap={"4"}>
			{children}
		</Flex>
	);
}
