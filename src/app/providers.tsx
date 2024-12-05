"use client";

import { Theme } from "@radix-ui/themes";
import { ToastContainer } from "react-toastify";

export default function Providers({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<Theme accentColor="purple" grayColor="gray" panelBackground="solid">
			{children}
			<ToastContainer />
		</Theme>
	);
}
