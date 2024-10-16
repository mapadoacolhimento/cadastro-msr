import { Values } from "@/types";

export default function updateEmptyFields(
	currentValues: Values,
	loadValues: Values
) {
	const valuesWithoutEmptyProperties = Object.fromEntries(
		Object.entries(currentValues).filter(
			([key, value]) =>
				value !== null &&
				typeof value !== "undefined" &&
				value !== "" &&
				(!Array.isArray(value) || value.length > 0)
		)
	);
	return { ...loadValues, ...valuesWithoutEmptyProperties };
}
