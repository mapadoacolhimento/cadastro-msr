import { describe, it, expect } from "vitest";
import { isDateValid } from "../isDateValid";

describe("isDateValid", () => {
	it("should return true when the date is valid", () => {
		expect(isDateValid("15/08/2024")).toBe(true);
	});

	it("should return false when the date is invalid", () => {
		expect(isDateValid("31/02/2024")).toBe(false);
	});

	it("should return false when the month is invalid", () => {
		expect(isDateValid("10/13/2024")).toBe(false);
	});

	it("should return false when the year is invalid", () => {
		expect(isDateValid("15/08/0000")).toBe(false);
	});

	it("should return false for an invalid format", () => {
		expect(isDateValid("15/08")).toBe(false);
	});

	it("should return false for an invalid date format", () => {
		expect(isDateValid("15/Aug/2024")).toBe(false);
	});

	it("should return true for a leap year date", () => {
		expect(isDateValid("29/02/2024")).toBe(true);
	});

	it("should return false for a non-leap year date", () => {
		expect(isDateValid("29/02/2023")).toBe(false);
	});
});
