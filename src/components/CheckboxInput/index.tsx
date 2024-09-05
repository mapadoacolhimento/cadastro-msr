import { useEffect } from "react";
import { Checkbox, Flex, Text } from "@radix-ui/themes";
import { useField } from "formik";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import ErrorMessage from "../ErrorMessage";

interface CheckboxInputProps {
	name: string;
	children: React.ReactNode;
}

const CheckboxInput: React.FC<CheckboxInputProps> = ({ name, children }) => {
	const [field, _meta, helpers] = useField(name);

	const handleCheckedChange = (checked: boolean) => {
		helpers.setValue(checked === true);
	};

	useEffect(() => {
		const button = document.querySelector("button[role='checkbox']");
		if (button && button.textContent === "") {
			const buttonContent = document.querySelector(
				"span.checkbox-input-button-content"
			);
			button.appendChild(buttonContent?.cloneNode(true) as Node);
		}
	}, []);

	return (
		<>
			<Text as="label" htmlFor={name}>
				<Flex align="start" as="span" gap={"4"}>
					<Checkbox
						id={name}
						checked={field.value}
						onCheckedChange={handleCheckedChange}
						color="purple"
					/>
					<Text as="span" size="2">
						{children}
					</Text>
					<VisuallyHidden.Root className={"checkbox-input-button-content"}>
						{name}
					</VisuallyHidden.Root>
				</Flex>
			</Text>
			<ErrorMessage name={name} />
		</>
	);
};

export default CheckboxInput;
