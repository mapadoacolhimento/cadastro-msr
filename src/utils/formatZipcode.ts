export default function formatZipcode(zipcode: string): string {
	try {
		if (!zipcode) return "not_found";

		return zipcode.replace(/\D/g, "").slice(0, 8);
	} catch {
		return "not_found";
	}
}
