export const isDateValid = (dateString: string) => {
	const [day, month, year] = dateString.split("/").map(Number);
	const date = new Date(year, month - 1, day);
	return (
		!isNaN(date.getTime()) &&
		date.getDate() === day &&
		date.getMonth() === month - 1 &&
		date.getFullYear() === year
	);
};
