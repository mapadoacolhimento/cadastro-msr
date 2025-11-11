import { Checkbox, Flex, Text, Card, Link, Strong } from "@radix-ui/themes";
import { useField } from "formik";
import ErrorMessage from "../ErrorMessage";
import "./TermsAcceptanceInput.css";

interface TermsAcceptanceInputProps {
	name: string;
	termsUrl: string;
	termsLinkText: string;
	children: React.ReactNode;
}

const TermsAcceptanceInput: React.FC<TermsAcceptanceInputProps> = ({
	name,
	termsUrl,
	termsLinkText,
	children,
}) => {
	const [field, _meta, helpers] = useField(name);

	const handleCheckedChange = (checked: boolean) => {
		helpers.setValue(checked === true);
	};

	const handleCardClick = () => {
		helpers.setValue(!field.value);
	};

	return (
		<>
			<Card
				size="2"
				className={`terms-acceptance-card ${field.value ? "is-checked" : ""}`}
				onClick={handleCardClick}
			>
				<Text as="label" htmlFor={name}>
					<Flex align="start" as="span" gap="4">
						<Checkbox
							id={name}
							checked={field.value}
							onCheckedChange={handleCheckedChange}
							color="purple"
							onClick={(e) => e.stopPropagation()}
						/>

						{/* texto do termo + descrição */}
						<Flex direction="column" gap="2">
							<Strong>
								<Link
									href={termsUrl}
									target="_blank"
									rel="noopener noreferrer"
									className={`terms-link ${field.value ? "is-checked" : ""}`}
									onClick={(e) => e.stopPropagation()}
								>
									{termsLinkText}
								</Link>
							</Strong>

							<Text as="p" size="2" color="gray">
								{children}
							</Text>
						</Flex>
					</Flex>
				</Text>
			</Card>

			<ErrorMessage name={name} />
		</>
	);
};

export default TermsAcceptanceInput;
