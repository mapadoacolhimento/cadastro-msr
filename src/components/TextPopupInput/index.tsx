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
}: TextPopupInputProps) {
	const {
		values,
		setFieldValue,
		errors,
		touched,
		setFieldTouched,
		validateField,
	} = useFormikContext<any>();
	const [isOpen, setIsOpen] = useState(false);
	const [textValue, setTextValue] = useState("");
	const [mounted, setMounted] = useState(false);
	const [prevTriggerValues, setPrevTriggerValues] = useState<any[]>([]);

	useEffect(() => {
		setMounted(true);
		return () => setMounted(false);
	}, []);

	useEffect(() => {
		const triggerValues = values[triggerFieldName] || [];

		const wasSelectedBefore = prevTriggerValues.includes(triggerValue);
		const isSelectedNow = triggerValues.includes(triggerValue);

		if (!wasSelectedBefore && isSelectedNow) {
			setIsOpen(true);
			setTextValue(values[name] || "");
		}
		if (wasSelectedBefore && !isSelectedNow) {
			setIsOpen(false);
			setFieldValue(name, "");
			setTextValue("");
		}

		setPrevTriggerValues(triggerValues);
	}, [
		values,
		triggerFieldName,
		triggerValue,
		name,
		setFieldValue,
		prevTriggerValues,
	]);

	useEffect(() => {
		const triggerValues = values[triggerFieldName] || [];
		const isSelectedNow = triggerValues.includes(triggerValue);

		if (isSelectedNow && touched[name] && errors[name] && !isOpen) {
			setIsOpen(true);
			setTextValue(values[name] || "");
		}
	}, [errors, touched, name, triggerFieldName, triggerValue, values, isOpen]);

	const handleClose = () => {
		setIsOpen(false);
	};

	const handleSubmit = async () => {
		if (textValue.trim()) {
			// atualiza o valor
			await setFieldValue(name, textValue);
			// marca como touched
			await setFieldTouched(name, true);
			// valida o campo
			const error = await validateField(name);
			// só fecha se não houver erro
			if (!error) {
				setIsOpen(false);
			}
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
						Cancelar
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
