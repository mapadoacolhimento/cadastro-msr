import { PropsWithChildren, ReactElement, useEffect } from "react";
import { useField } from "formik";
import {
	CheckboxGroup,
	Text,
	Flex,
	ScrollArea,
	Card,
	AlertDialog,
} from "@radix-ui/themes";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

import ErrorMessage from "../ErrorMessage";
import Question from "../Question";
import "./CheckboxGroupInput.css";

export type CheckboxOption = {
	value: string;
	name: string;
	description?: string;
	fullDescription?: string;
};

type CheckboxGroupInputProps = {
	name: string;
	options: CheckboxOption[];
	question: React.ReactNode;
	actionButton?: ReactElement<PropsWithChildren>;
	renderDialogContent?: (
		props: CheckboxOption
	) => ReactElement<PropsWithChildren>;
};

export default function CheckboxGroupInput({
	options,
	name,
	question,
	actionButton,
	renderDialogContent,
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
		<CheckboxGroup.Root
			defaultValue={field.value}
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
				<Flex
					pr={options.length > 4 ? { initial: "6", sm: "8" } : "0"}
					gap={"4"}
					direction={"column"}
					mb={"80px"}
				>
					{options.map((option: CheckboxOption) => {
						return (
							<Card key={option.value} size={"2"}>
								<CheckboxGroup.Item
									onClick={() => handleClick(field.value, option.value)}
									value={option.value}
									className={
										field.value.includes(option.value) ? "is-checked" : ""
									}
								>
									<Flex justify={"between"} align="center">
										<Flex
											direction={"column"}
											align={"start"}
											justify={"center"}
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
										</Flex>
										{actionButton &&
										renderDialogContent &&
										option.fullDescription ? (
											<AlertDialog.Root>
												<AlertDialog.Trigger>
													{actionButton}
												</AlertDialog.Trigger>
												{renderDialogContent(option)}
											</AlertDialog.Root>
										) : null}
									</Flex>
								</CheckboxGroup.Item>
								<VisuallyHidden.Root
									id={`checkbox-group-button-content-${option.value}`}
								>
									{option.name}
								</VisuallyHidden.Root>
							</Card>
						);
					})}
				</Flex>
			</ScrollArea>
			<ErrorMessage name={name} />
		</CheckboxGroup.Root>
	);
}
