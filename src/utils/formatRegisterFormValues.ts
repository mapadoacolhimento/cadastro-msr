import { Values } from "@/types";
import getFirstName from "./getFirstName";
import capitalizeFirst from "./capitalizeFirst";
import formatZipcode from "./formatZipcode";
import normalizeCity from "./normalizeCity";
import formatDate from "./formatDate";

const yesNoToBoolean = (value?: string | null): boolean | null =>
	value == null || value === "" ? null : value === "yes";

export default function formatRegisterFormValues(values: Values) {
	const parseValues = {
		...values,
		email: values.email.toLowerCase(),
		firstName: getFirstName(values.firstName),
		neighborhood: capitalizeFirst(values.neighborhood),
		dateOfBirth: new Date(formatDate(values.dateOfBirth)).toISOString(),
		zipcode: formatZipcode(values.zipcode),
		phone: values.phone.replace(/\D/g, ""),
		city: normalizeCity(values.city),
		dependants: yesNoToBoolean(values.dependants),
		propertyOwnership: yesNoToBoolean(values.propertyOwnership),
		acceptsOnlineSupport: yesNoToBoolean(values.acceptsOnlineSupport),
		hasDisability: yesNoToBoolean(values.hasDisability),
		livesWithPerpetrator:
			values.livesWithPerpetrator && values.livesWithPerpetrator !== ""
				? values.livesWithPerpetrator
				: "no",
	};

	return JSON.stringify(parseValues);
}
