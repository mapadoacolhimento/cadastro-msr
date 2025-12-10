import { useFormikContext } from "formik";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import "./TextPopupInput.css";

interface TextPopupInputProps {
	name: string;
	triggerFieldName: string;
	triggerValue: string;
	title?: string;
	placeholder?: string;
	onClose?: () => void;
}

export default function TextPopupInput({
	name,
	triggerFieldName,
	triggerValue,
	title,
	placeholder,
	onClose,
}: TextPopupInputProps) {
	const { values, setFieldValue, errors, touched } = useFormikContext<any>();
	const [isOpen, setIsOpen] = useState(false);
	const [textValue, setTextValue] = useState("");
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		return () => setMounted(false);
	}, []);

	useEffect(() => {
		const triggerValues = values[triggerFieldName];
		const shouldOpen = Array.isArray(triggerValues)
			? triggerValues.includes(triggerValue)
			: triggerValues === triggerValue;

		if (shouldOpen && !isOpen) {
			setIsOpen(true);
			setTextValue(values[name] || "");
		} else if (!shouldOpen && isOpen) {
			setIsOpen(false);
			setFieldValue(name, "");
		}
	}, [values, triggerFieldName, triggerValue, isOpen, name, setFieldValue]);

	const handleClose = () => {
		setIsOpen(false);

		// Remove o valor trigger do campo que acionou o popup
		const currentValues = values[triggerFieldName];
		if (Array.isArray(currentValues)) {
			const updatedValues = currentValues.filter(
				(item: string) => item !== triggerValue
			);
			setFieldValue(triggerFieldName, updatedValues);
		} else {
			setFieldValue(triggerFieldName, "");
		}

		setFieldValue(name, "");
		setTextValue("");

		if (onClose) onClose();
	};

	const handleSubmit = () => {
		if (textValue.trim()) {
			setFieldValue(name, textValue);
			setIsOpen(false);
		}
	};

	const hasError = touched[name] && errors[name];

	const popupContent = (
		<Popup
			open={isOpen}
			onClose={handleClose}
			modal
			nested
			closeOnDocumentClick={false}
		>
			<div className="text-popup-container">
				<h2 className="text-popup-title">{title}</h2>

				<textarea
					className={`text-popup-textarea ${hasError ? "text-popup-textarea--error" : ""}`}
					placeholder={placeholder}
					value={textValue}
					onChange={(e) => setTextValue(e.target.value)}
				/>

				{hasError && (
					<p className="text-popup-error">{errors[name] as string}</p>
				)}

				<div className="text-popup-actions">
					<button
						type="button"
						onClick={handleClose}
						className="text-popup-btn text-popup-btn--secondary"
					>
						Fechar
					</button>
					<button
						type="button"
						onClick={handleSubmit}
						disabled={!textValue.trim()}
						className="text-popup-btn text-popup-btn--primary"
					>
						Enviar
					</button>
				</div>
			</div>
		</Popup>
	);

	// renderiza via portal para evitar conflitos com o Step
	if (!mounted) return null;

	return createPortal(popupContent, document.body);
}
