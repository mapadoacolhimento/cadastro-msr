import { Values } from "@/types";
import getFirstName from "./getFirstName";
import capitalizeFirst from "./capitalizeFirst";
import formatZipcode from "./formatZipcode";
import normalizeCity from "./normalizeCity";

export default function formatRegisterFormValues(values: Values) {
	const parseValues = {
		...values,
		firstName: getFirstName(values.firstName),
		neighborhood: capitalizeFirst(values.neighborhood),
		dateOfBirth: values.dateOfBirth.replaceAll("/", "-"),
		zipcode: formatZipcode(values.zipcode),
		phone: values.phone.replace(/\D/g, ""),
		city: normalizeCity(values.city),
	};

	const replaceYesNoWithBoolean = JSON.stringify(parseValues)
		.replace(/"yes"/g, "true")
		.replace(/"no"/g, "false");

	return replaceYesNoWithBoolean;
}
