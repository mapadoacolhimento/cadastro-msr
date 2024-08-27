import { Values } from "@/types";

const getDateFormat = (date: string) => {
	let [day, month, year] = date.split("/");
	return `${year}-${month}-${day}`;
};

function capitalizeFirst(value: string) {
	return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function getFirstName(value: string) {
	if (!value) return "";

	const split = value.split(" ");
	if (split.length < 2) return "";

	return capitalizeFirst(split[0]);
}

export default function formatRegisterFormValues(values: Values) {
	const parseValues = {
		...values,
		firstName: getFirstName(values.firstName),
		neighborhood: capitalizeFirst(values.neighborhood),
		dateOfBirth: getDateFormat(values.dateOfBirth),
	};

	const replaceYesNoWithBoolean = JSON.stringify(parseValues)
		.replace(/"yes"/g, "true")
		.replace(/"no"/g, "false");

	return replaceYesNoWithBoolean;
}
