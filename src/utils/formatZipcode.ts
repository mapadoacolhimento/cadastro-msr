export default function formatZipcode(zipcode: string): string {
	if (!zipcode) return "not_found";

	return zipcode.replace(/\D/g, "").slice(0, 8);
}
