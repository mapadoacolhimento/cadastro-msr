"use client";

import { type PropsWithChildren } from "react";
import { Grid } from "@radix-ui/themes";
import { Header } from "./";
import SafeExitButton from "./SafeExitButton";

export default function BaseLayout({ children }: Readonly<PropsWithChildren>) {
	return (
		<Grid columns={{ initial: "1", md: "1fr 55%" }} width="auto">
			<div>
				<Header />
				<main>{children}</main>
			</div>
			<SafeExitButton />
		</Grid>
	);
}
