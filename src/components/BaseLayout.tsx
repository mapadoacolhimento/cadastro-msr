"use client";

import { type PropsWithChildren } from "react";
import { Flex, Grid } from "@radix-ui/themes";
import { Header } from "./";
import SafeExitButton from "./SafeExitButton";

export default function BaseLayout({ children }: Readonly<PropsWithChildren>) {
	return (
		<Grid columns={{ initial: "1", md: "1fr 55%" }} width="auto">
			<div>
				<Header />
				<Flex width={"100%"} justify={"center"} align={"center"} py={"7"}>
					<Flex
						direction={"column"}
						align={"center"}
						maxWidth={"25rem"}
						asChild
						minHeight={"calc(100vh - 100px - 40px)"}
						gap={"8"}
					>
						<main>{children}</main>
					</Flex>
				</Flex>
			</div>
			<SafeExitButton />
		</Grid>
	);
}
