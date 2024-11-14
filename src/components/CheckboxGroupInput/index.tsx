import { useEffect } from "react";
import { useField } from "formik";
import { Box, CheckboxCards, Text, Flex, ScrollArea } from "@radix-ui/themes";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

import ErrorMessage from "../ErrorMessage";
import Question from "../Question";
import "./CheckboxGroupInput.css";

type CheckboxOption = {
	value: string;
	name: string;
	description?: string;
};

type CheckboxGroupInputProps = {
	name: string;
	options: CheckboxOption[];
	question: React.ReactNode;
};

export default function CheckboxGroupInput({
	options,
	name,
	question,
}: Readonly<CheckboxGroupInputProps>) {
	const [field, _meta, helpers] = useField({
		name,
		type: "checkbox",
		multiple: true,
	});

	function handleClick(oldValues: string[], newValue: string) {
		if (oldValues.includes(newValue)) {
			const newFilteredValues = oldValues.filter(
				(oldValue: string) => oldValue !== newValue
			);
			return helpers.setValue(newFilteredValues);
		}

		helpers.setValue([...oldValues, newValue]);
	}

	useEffect(() => {
		const checkboxButtons = document.querySelectorAll(
			"button[role='checkbox']"
		);
		checkboxButtons.forEach((checkboxButton) => {
			if (checkboxButton && checkboxButton.textContent === "") {
				const checkboxButtonValue = checkboxButton.getAttribute("value");
				const hiddenCheckboxButtonContent = document.getElementById(
					`checkbox-group-button-content-${checkboxButtonValue}`
				);
				checkboxButton.appendChild(
					hiddenCheckboxButtonContent?.cloneNode(true) as Node
				);
			}
		});
	}, []);

	return (
		<CheckboxCards.Root
			defaultValue={field.value}
			columns={"1"}
			aria-labelledby={"question"}
			id={`checkbox-group-${name}`}
			color={"purple"}
			style={{ width: "100%" }}
		>
			<Question id={"question"}>{question}</Question>
			<ScrollArea
				type={options.length > 4 ? "always" : undefined}
				scrollbars="vertical"
				style={{ height: 440 }}
			>
				<Box pr={options.length > 4 ? { initial: "6", sm: "8" } : "0"}>
					{options.map((option: CheckboxOption, i) => {
						return (
							<Box key={option.value}>
								<Flex
									direction={"column"}
									asChild
									align={"start"}
									justify={"center"}
									mb={options.length - 1 === i ? "80px" : "4"}
								>
									<CheckboxCards.Item
										onClick={() => handleClick(field.value, option.value)}
										value={option.value}
										className={
											field.value.includes(option.value) ? "is-checked" : ""
										}
									>
										<Text
											highContrast={!!option.description}
											color={option.description ? "purple" : undefined}
											weight={option.description ? "medium" : undefined}
										>
											{option.name}
										</Text>
										{option.description ? (
											<Text>{option.description}</Text>
										) : null}
									</CheckboxCards.Item>
								</Flex>
								<VisuallyHidden.Root
									id={`checkbox-group-button-content-${option.value}`}
								>
									{option.name}
								</VisuallyHidden.Root>
							</Box>
						);
					})}
				</Box>
			</ScrollArea>
			<ErrorMessage name={name} />
		</CheckboxCards.Root>
	);
}
