import formatZipcode from "../formatZipcode";

describe("formatZipcode", () => {
	it("should return 'not_found' if the zipcode is empty", () => {
		const result = formatZipcode("");
		expect(result).toStrictEqual("not_found");
	});

	it("should format the zipcode by removing non-digit characters and limiting it to 8 digits", () => {
		const result = formatZipcode("12345-678");
		expect(result).toStrictEqual("12345678");
	});
});
