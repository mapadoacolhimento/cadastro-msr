import { Values } from "@/types";

export default function getFinalFormValues(
	currentFormValues: Values,
	previousFormValues: Values
) {
	const valuesWithoutEmptyProperties = Object.fromEntries(
		Object.entries(currentFormValues).filter(
			([key, value]) =>
				value !== null &&
				typeof value !== "undefined" &&
				value !== "" &&
				(!Array.isArray(value) || value.length > 0)
		)
	);
	return { ...previousFormValues, ...valuesWithoutEmptyProperties };
}
