import type { PropsWithChildren } from "react";
import type { StepChildrenProps } from "@/types";
import { Flex } from "@radix-ui/themes";

export default function Step({
	children,
}: PropsWithChildren<StepChildrenProps>) {
	return (
		<Flex direction={"column"} gap={"4"} width={"100%"}>
			{children}
		</Flex>
	);
}
