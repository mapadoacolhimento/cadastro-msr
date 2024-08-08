import React, { useState } from "react";
import { useField } from "formik";
import "./SelectInput.css";
import Select, { SingleValue } from "react-select";
import ErrorMessage from "../ErrorMessage";

type Option = { value: string; label: string };

interface SelectInputProps {
	name: string;
	label: string;
	options: Option[];
	placeholder?: string;
	onChange?: (optionValue: string) => Promise<void>;
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
		helpers.setValue(option?.value);
		onChange && onChange(option?.value || "");
		setIsFocused(true);
	};

	return (
		<div className="select-input-container">
			<label
				className={isFocused || field.value ? "active" : ""}
				htmlFor={field.name}
				id={`select-label-${field.name}`}
			>
				{label}
			</label>
			<Select
				classNamePrefix="custom-select"
				options={options}
				name={field.name}
				id={field.name}
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
		</div>
	);
};

export default SelectInput;
