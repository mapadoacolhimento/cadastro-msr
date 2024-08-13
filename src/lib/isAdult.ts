const today = new Date();

export const isAdult = (dateOfBirth: string) => {
	const [day, month, year] = dateOfBirth.split("/").map(Number);
	const birthDate = new Date(year, month - 1, day);
	let ageDifference = today.getFullYear() - birthDate.getFullYear();
	const monthDifference = today.getMonth() - birthDate.getMonth();

	const hasNotReachedBirthdayMonth = monthDifference < 0;
	const isBirthdayMonth = monthDifference === 0;
	const hasNotPassedBirthdayThisYear =
		hasNotReachedBirthdayMonth ||
		(isBirthdayMonth && today.getDate() >= birthDate.getDate());

	if (hasNotPassedBirthdayThisYear) {
		ageDifference--;
	}
	return ageDifference >= 18;
};
