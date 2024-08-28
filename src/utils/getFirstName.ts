import capitalizeFirst from "./capitalizeFirst";

export default function getFirstName(value: string) {
	try {
		if (!value) return "";

		const split = value.split(" ");
		if (split.length < 2) return "";

		return capitalizeFirst(split[0]);
	} catch {
		return "";
	}
}
