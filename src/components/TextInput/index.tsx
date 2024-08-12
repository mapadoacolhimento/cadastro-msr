import React, { useState } from "react";
import { useField } from "formik";
import { TextField } from "@radix-ui/themes";
import InputMask from "react-input-mask";
import ErrorMessage from "../ErrorMessage";
import "./TextInput.css";

interface TextInputProps {
	name: string;
	type?: string;
	label: string;
	placeholder?: string;
	mask?: string;
	onBlur?: (value: string) => Promise<void> | void;
}

const TextInput: React.FC<TextInputProps> = (props) => {
	const [field, meta, helpers] = useField(props.name);
	const [isActive, setIsActive] = useState(false);
	const hasError = meta.touched && meta.error;

	function handleTextChange(text: string) {
		helpers.setValue(text);
	}

	function handleFocus() {
		setIsActive(true);
	}

	function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
		field.onBlur(e);
		if (e.target.value === "") {
			setIsActive(false);
		} else {
			if (props.onBlur) {
				props.onBlur(e.target.value);
			}
		}
	}

	return (
		<div className={"input-text-container"}>
			<label
				htmlFor={props.name}
				className={isActive ? "active" : ""}
				style={{ color: hasError ? "var(--red-9)" : "var(--purple-9)" }}
			>
				{props.label}
			</label>
			{props.mask ? (
				<InputMask
					{...field}
					{...props}
					type={(props.type as any) || "text"}
					id={props.name}
					mask={props.mask}
					onChange={(e) => handleTextChange(e.target.value)}
					onFocus={handleFocus}
					onBlur={handleBlur}
					aria-invalid={hasError ? "true" : "false"}
					color={hasError ? "red" : "purple"}
				>
					<TextField.Root size={"3"} />
				</InputMask>
			) : (
				<TextField.Root
					{...field}
					{...props}
					onChange={(e) => handleTextChange(e.target.value)}
					onFocus={handleFocus}
					onBlur={handleBlur}
					type={(props.type as any) || "text"}
					id={props.name}
					size={"3"}
					aria-invalid={hasError ? "true" : "false"}
					color={hasError ? "red" : "purple"}
				/>
			)}
			<ErrorMessage name={props.name} />
		</div>
	);
};

export default TextInput;
