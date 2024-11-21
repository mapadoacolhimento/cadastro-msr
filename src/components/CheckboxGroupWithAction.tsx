import { PropsWithChildren, ReactElement, useEffect } from "react";
import { useField } from "formik";
import {
	Box,
	CheckboxGroup,
	Text,
	Flex,
	ScrollArea,
	Card,
	Button,
	AlertDialog,
} from "@radix-ui/themes";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { InfoCircledIcon } from "@radix-ui/react-icons";

import ErrorMessage from "./ErrorMessage";
import Question from "./Question";
import "./CheckboxGroupInput/CheckboxGroupInput.css";

type CheckboxOption = {
	value: string;
	name: string;
	description: string;
	fullDescription: string;
};

type CheckboxGroupInputProps = {
	name: string;
	options: CheckboxOption[];
	question: React.ReactNode;
	actionButton?: ReactElement<PropsWithChildren>;
};

function renderDialogContent({
	name,
	fullDescription,
}: {
	name: string;
	fullDescription: string;
}) {
	return (
		<AlertDialog.Content size="4" maxWidth="528px">
			<AlertDialog.Title color={"purple"} highContrast size={"6"} mb={"4"}>
				{name}
			</AlertDialog.Title>
			<AlertDialog.Description size="2">
				<Flex gap={"2"} align={"center"} pb={"4"}>
					<InfoCircledIcon color={"purple"} width={"21"} height={"21"} />
					<Text color={"purple"} highContrast weight={"medium"} size={"3"}>
						Saiba mais sobre os aspectos dessa violência:
					</Text>
				</Flex>
				<Text>{fullDescription}</Text>
			</AlertDialog.Description>

			<Flex mt="7" justify="end">
				<AlertDialog.Cancel>
					<Button
						size={"3"}
						variant="outline"
						color="gray"
						style={{
							fontFamily: "var(--font-nunito-sans)",
							textTransform: "capitalize",
							fontWeight: 600,
						}}
					>
						Fechar
					</Button>
				</AlertDialog.Cancel>
			</Flex>
		</AlertDialog.Content>
	);
}

export default function CheckboxGroupInput({
	options,
	name,
	question,
	actionButton,
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
					{options.map((option: CheckboxOption, i) => {
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
											<Text highContrast color={"purple"} weight={"medium"}>
												{option.name}
											</Text>
											<Text>{option.description}</Text>
										</Flex>
										{actionButton ? (
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
