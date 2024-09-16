import { Text } from "@radix-ui/themes";

export default function VisuallyHidden({
	children,
	...props
}: {
	children: React.ReactNode;
	id?: string;
	className?: string;
}) {
	return (
		<Text
			as={"span"}
			style={{
				// See: https://github.com/twbs/bootstrap/blob/main/scss/mixins/_visually-hidden.scss
				position: "absolute",
				border: 0,
				width: 1,
				height: 1,
				padding: 0,
				margin: -1,
				overflow: "hidden",
				clip: "rect(0, 0, 0, 0)",
				whiteSpace: "nowrap",
				wordWrap: "normal",
			}}
			{...props}
		>
			{children}
		</Text>
	);
}
