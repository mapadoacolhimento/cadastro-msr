export default function capitalizeFirst(value: string) {
	try {
		if (!value) return "";
		return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
	} catch {
		return "";
	}
}
