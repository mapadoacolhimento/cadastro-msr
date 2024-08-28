export default function normalizeCity(city: string): string {
	try {
		if (city === "not_found" || !city) return "not_found";

		return city
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.replace(/['"]/g, "")
			.replace(/\([^()]*\)/g, "")
			.toUpperCase()
			.trim();
	} catch {
		return "not_found";
	}
}
