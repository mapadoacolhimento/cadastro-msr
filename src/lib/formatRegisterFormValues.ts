import { Values } from "../components/MultiStepForm";

const getDateFormat = (date: string) => {
	let [day, month, year] = date.split("/");
	return `${year}-${month}-${day}`;
};

function capitalizeFirst(value: string) {
	return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function getFirsWord(value: string) {
	return value.split(" ")[0];
}
export default function formatRegisterFormValues(values: Values) {
	const parseValues = {
		...values,
		gender: values.genderIdentity,
		firstName: capitalizeFirst(getFirsWord(values.firstName)),
		neighborhood: capitalizeFirst(values.neighborhood),
		dateOfBirth: getDateFormat(values.dateOfBirth),
		acceptsOnlineSupport: "yes",
	};
	console.log(parseValues);
	return JSON.stringify(parseValues)
		.replace(/"yes"/g, "true")
		.replace(/"no"/g, "false");
}
