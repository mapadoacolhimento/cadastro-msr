"use client";
import React, { useState } from "react";
import { Box, Text } from "@radix-ui/themes";
import { useField } from "formik";
import Select, { SingleValue } from "react-select";
import ErrorMessage from "../ErrorMessage";
import "./SelectInput.css";

type Option = { value: string; label: string };

interface SelectInputProps {
	name: string;
	label: string;
	options: Option[];
	placeholder?: string;
	onChange?: (value: string) => Promise<void> | void;
	isLoading?: boolean;
}

const SelectInput: React.FC<SelectInputProps> = ({
	name,
	label,
	options,
	placeholder,
	onChange,
	isLoading,
}) => {
	const [field, meta, helpers] = useField(name);
	const [isFocused, setIsFocused] = useState(false);
	const hasError = meta.touched && meta.error;

	const handleFocus = () => {
		setIsFocused(true);
	};

	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		field.onBlur(e);
		setIsFocused(field.value !== "");
	};

	const handleValueChange = (option: SingleValue<Option>) => {
		if (onChange) {
			onChange(option?.value ?? "");
		}
		helpers.setValue(option?.value);
		setIsFocused(true);
	};

	return (
		<Box position={"relative"} className={"select-input-container"}>
			<Text asChild size={"1"} color={"purple"} weight={"bold"}>
				<label
					className={isFocused || field.value ? "active" : ""}
					htmlFor={field.name}
					id={`select-label-${field.name}`}
				>
					{label}
				</label>
			</Text>
			<Select
				aria-live={"polite"}
				aria-busy={isLoading}
				classNamePrefix={`${field.value ? "custom-select--with-value" : ""} custom-select`}
				options={options}
				name={field.name}
				inputId={field.name}
				value={
					options ? options.find((option) => option.value === field.value) : ""
				}
				onChange={(option) => handleValueChange(option as SingleValue<Option>)}
				onBlur={handleBlur}
				onFocus={handleFocus}
				placeholder={placeholder}
				aria-invalid={!!hasError}
				aria-labelledby={`select-label-${field.name}`}
				isLoading={isLoading}
			/>
			<ErrorMessage name={name} />
		</Box>
	);
};

export default SelectInput;
