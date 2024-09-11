import capitalizeFirst from "./capitalizeFirst";

export default function getFirstName(value: string) {
	try {
		if (!value) return "";

		const split = value.split(" ");
		return capitalizeFirst(split[0]);
	} catch {
		return "";
	}
}
