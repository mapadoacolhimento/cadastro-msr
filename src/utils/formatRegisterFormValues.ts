import { Values } from "@/types";
import getFirstName from "./getFirstName";
import capitalizeFirst from "./capitalizeFirst";

export default function formatRegisterFormValues(values: Values) {
	const parseValues = {
		...values,
		firstName: getFirstName(values.firstName),
		neighborhood: capitalizeFirst(values.neighborhood),
		dateOfBirth: values.dateOfBirth.replaceAll("/", "-"),
	};

	const replaceYesNoWithBoolean = JSON.stringify(parseValues)
		.replace(/"yes"/g, "true")
		.replace(/"no"/g, "false");

	return replaceYesNoWithBoolean;
}
