const today = new Date();

export const isAdult = (dateOfBirth: string) => {
	const [day, month, year] = dateOfBirth.split("/").map(Number);
	const birthDate = new Date(year, month - 1, day);
	let ageDifference = today.getFullYear() - birthDate.getFullYear();
	const monthDifference = today.getMonth() - birthDate.getMonth();
	const dayDifference = today.getDate() - birthDate.getDate();

	const hasNotReachedBirthdayMonth = monthDifference < 0;
	const isBirthdayMonth = monthDifference === 0;
	const hasNotReachedBirthdayDay = dayDifference < 0;
	const hasNotPassedBirthdayThisYear =
		hasNotReachedBirthdayMonth || (isBirthdayMonth && hasNotReachedBirthdayDay);

	if (hasNotPassedBirthdayThisYear) {
		ageDifference--;
	} else {
		return ageDifference >= 18;
	}
};
