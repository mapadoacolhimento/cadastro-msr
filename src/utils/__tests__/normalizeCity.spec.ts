import normalizeCity from "../normalizeCity";

describe("normalizeCity", () => {
	it("should return 'not_found' if city is 'not_found'", () => {
		const city = "not_found";
		const result = normalizeCity(city);
		expect(result).toStrictEqual("not_found");
	});

	it("should return 'not_found' if city is falsy", () => {
		// @ts-expect-error
		expect(normalizeCity(undefined)).toStrictEqual("not_found");
		// @ts-expect-error
		expect(normalizeCity(null)).toStrictEqual("not_found");
	});

	it("should normalize and uppercase the city name", () => {
		const city = "São Paulo";
		const result = normalizeCity(city);
		expect(result).toStrictEqual("SAO PAULO");
	});

	it("should remove diacritics from the city name", () => {
		const city = "São Paulo";
		const result = normalizeCity(city);
		expect(result).toStrictEqual("SAO PAULO");
	});

	it("should remove single quotes from the city name", () => {
		const city = "New 'York'";
		const result = normalizeCity(city);
		expect(result).toStrictEqual("NEW YORK");
	});

	it("should remove double quotes from the city name", () => {
		const city = 'Los "Angeles"';
		const result = normalizeCity(city);
		expect(result).toStrictEqual("LOS ANGELES");
	});

	it("should remove parentheses and their contents from the city name", () => {
		const city = "San Francisco (CA)";
		const result = normalizeCity(city);
		expect(result).toStrictEqual("SAN FRANCISCO");
	});
});
