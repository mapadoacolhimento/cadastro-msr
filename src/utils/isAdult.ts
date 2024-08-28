export default function isAdult(dateOfBirth: string) {
	try {
		const [day, month, year] = dateOfBirth.split("/").map(Number);
		const birthDate = new Date(year, month - 1, day);
		const today = new Date();

		let ageDifference = today.getFullYear() - birthDate.getFullYear();
		const monthDifference = today.getMonth() - birthDate.getMonth();
		const dayDifference = today.getDate() - birthDate.getDate();

		const hasNotReachedBirthdayMonth = monthDifference < 0;
		const isBirthdayMonth = monthDifference === 0;
		const hasNotReachedBirthdayDay = dayDifference < 0;
		const hasNotPassedBirthdayThisYear =
			hasNotReachedBirthdayMonth ||
			(isBirthdayMonth && hasNotReachedBirthdayDay);

		if (hasNotPassedBirthdayThisYear) {
			ageDifference--;
		}
		return ageDifference >= 18;
	} catch {
		return false;
	}
}
