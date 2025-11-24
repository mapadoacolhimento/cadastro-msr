import { useField } from "formik";
import { Box, Card, Flex, Text, ScrollArea } from "@radix-ui/themes";

import ErrorMessage from "../ErrorMessage";
import "./RadioInput.css";
import Question from "../Question";

type RadioOption = {
	value: string | number;
	name: string;
};

type RadioInputProps = {
	name: string;
	options: RadioOption[];
	question: React.ReactNode;
	scrollAreaHeight?: number;
};

export default function RadioInput({
	options,
	name,
	question,
	scrollAreaHeight = 440,
}: Readonly<RadioInputProps>) {
	const [field, _meta, helpers] = useField(name);

	function handleClick(value: string | number) {
		helpers.setValue(value);
	}
	return (
		<Box role="radiogroup" aria-labelledby={"question"} width={"100%"}>
			<Question id={"question"}>{question}</Question>
			<ScrollArea
				type={options.length > 4 ? "always" : undefined}
				scrollbars="vertical"
				style={{ height: scrollAreaHeight }}
			>
				<Flex
					gap={"4"}
					direction={"column"}
					width={"100%"}
					align={"center"}
					pr={options.length > 4 ? { initial: "6", sm: "8" } : "0"}
					mb={"80px"}
				>
					{options.map((option: RadioOption, i) => {
						return (
							<Card asChild key={option.value} className={"radio"}>
								<Flex
									role={"radio"}
									aria-checked={field.value === option.value}
									tabIndex={0}
									aria-labelledby={`radio-label-${i}`}
									data-value={option.value}
									onClick={() => handleClick(option.value)}
									justify={"center"}
									width={"100%"}
									maxWidth={"22rem"}
									style={{ cursor: "pointer" }}
									display={"inline-flex"}
								>
									<Text asChild size={"2"} weight={"medium"}>
										<label id={`radio-label-${i}`}>{option.name}</label>
									</Text>
								</Flex>
							</Card>
						);
					})}
				</Flex>
			</ScrollArea>
			<ErrorMessage name={name} />
		</Box>
	);
}
