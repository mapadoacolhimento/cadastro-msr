import { useField } from "formik";
import { Box, Card, Flex, Text } from "@radix-ui/themes";

import ErrorMessage from "../ErrorMessage";
import "./RadioInput.css";

type RadioOption = {
	value: string;
	name: string;
};

type RadioInputProps = {
	name: string;
	options: RadioOption[];
	question: React.ReactNode;
};

export default function RadioInput({
	options,
	name,
	question,
}: Readonly<RadioInputProps>) {
	const [field, _meta, helpers] = useField(name);

	function handleClick(value: string) {
		helpers.setValue(value);
	}
	return (
		<Box role="radiogroup" aria-labelledby={"question"} width={"100%"}>
			<Box asChild pb={{ initial: "7", sm: "8" }}>
				<Text asChild align={"center"} id={"question"}>
					<legend>{question}</legend>
				</Text>
			</Box>
			<Flex gap={"4"} direction={"column"} width={"100%"} align={"center"}>
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
			<ErrorMessage name={name} />
		</Box>
	);
}
