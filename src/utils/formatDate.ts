export default function formatDate(date: string): string {
	if (!date) return "";

	const [day, month, year] = date.split("/").map(Number);

	return `${year}-${month}-${day}`;
}
