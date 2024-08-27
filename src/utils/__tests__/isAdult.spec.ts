import isAdult from "../isAdult";

describe("isAdult", () => {
	it("should return true when the age is exactly 18 years", () => {
		const today = new Date();
		const eighteenYearsAgo = new Date(
			today.getFullYear() - 18,
			today.getMonth(),
			today.getDate()
		);
		const birthYear18 = eighteenYearsAgo.getFullYear();
		const birthMonth18 = String(eighteenYearsAgo.getMonth() + 1).padStart(
			2,
			"0"
		);
		const birthDay18 = String(eighteenYearsAgo.getDate()).padStart(2, "0");
		const dateOfBirth18 = `${birthDay18}/${birthMonth18}/${birthYear18}`;

		expect(isAdult(dateOfBirth18)).toBe(true);
	});

	it("should return true when the age is greater than 18 years", () => {
		const today = new Date();
		const birthYear = today.getFullYear() - 19;
		const birthMonth = String(today.getMonth() + 1).padStart(2, "0");
		const birthDay = String(today.getDate()).padStart(2, "0");
		const dateOfBirth = `${birthDay}/${birthMonth}/${birthYear}`;

		expect(isAdult(dateOfBirth)).toBe(true);
	});

	it("should return false when the age is less than 18 years", () => {
		const today = new Date();
		const seventeenYearsAgo = new Date(
			today.getFullYear() - 17,
			today.getMonth(),
			today.getDate()
		);
		const birthYear17 = seventeenYearsAgo.getFullYear();
		const birthMonth17 = String(seventeenYearsAgo.getMonth() + 1).padStart(
			2,
			"0"
		);
		const birthDay17 = String(seventeenYearsAgo.getDate()).padStart(2, "0");
		const dateOfBirth17 = `${birthDay17}/${birthMonth17}/${birthYear17}`;

		expect(isAdult(dateOfBirth17)).toBe(false);
	});

	it("should return false when the person will be 18 this year, on this same date, but only one month later", () => {
		const today = new Date();
		const eighteenYearsAgo = new Date(
			today.getFullYear() - 18,
			today.getMonth() + 1,
			today.getDate()
		);
		const birthYear = eighteenYearsAgo.getFullYear();
		const birthMonth = String(eighteenYearsAgo.getMonth() + 1).padStart(2, "0");
		const birthDay = String(eighteenYearsAgo.getDate()).padStart(2, "0");
		const dateOfBirth = `${birthDay}/${birthMonth}/${birthYear}`;

		expect(isAdult(dateOfBirth)).toBe(false);
	});

	it("should return true when the person is 18 years old and their birthday has already passed this year", () => {
		const today = new Date();
		const eighteenYearsAgo = new Date(
			today.getFullYear() - 18,
			today.getMonth() - 1,
			today.getDate()
		);
		const birthYear = eighteenYearsAgo.getFullYear();
		const birthMonth = String(eighteenYearsAgo.getMonth() + 1).padStart(2, "0");
		const birthDay = String(eighteenYearsAgo.getDate()).padStart(2, "0");
		const dateOfBirth = `${birthDay}/${birthMonth}/${birthYear}`;

		expect(isAdult(dateOfBirth)).toBe(true);
	});
});
