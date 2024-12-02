export default function formatPhoneNumber(number: string) {
	return number
		.toString()
		.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, "($1) $2 $3-$4");
}
