"use server";

import { Box, Card, Flex, Text } from "@radix-ui/themes";
import { PropsWithChildren } from "react";

export default async function StatusCard({
	icon,
	title,
	children,
}: PropsWithChildren<{
	icon: React.ReactNode;
	title: string;
}>) {
	return (
		<Box width={{ initial: "100%", md: "450px" }} asChild>
			<Card size={"3"} className={"volunteer-not-found__card"}>
				<Flex asChild align={"center"}>
					<Text as={"p"} color={"purple"} highContrast weight={"medium"}>
						{icon}
						{title}
					</Text>
				</Flex>
				<Box mt={"4"}>
					<Text size={"2"}>{children}</Text>
				</Box>
			</Card>
		</Box>
	);
}
