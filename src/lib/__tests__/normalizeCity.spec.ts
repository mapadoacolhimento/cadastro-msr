import normalizeCity from "../normalizeCity";

describe("normalizeCity", () => {
	it("should return 'not_found' if city is 'not_found'", () => {
		const city = "not_found";
		const result = normalizeCity(city);
		expect(result).toStrictEqual("not_found");
	});

	it("should normalize and uppercase the city name", () => {
		const city = "São Paulo";
		const result = normalizeCity(city);
		expect(result).toStrictEqual("SAO PAULO");
	});
});
