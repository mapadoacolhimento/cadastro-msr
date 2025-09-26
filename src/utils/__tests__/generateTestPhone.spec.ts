import generateTestPhone from "../generateTestPhone";
import { describe, it, expect } from "vitest";

describe("generateTestPhone", () => {
	it("should return a string", () => {
		const phone = generateTestPhone();
		expect(typeof phone).toBe("string");
	});

	it("should match the phone number format", () => {
		const phone = generateTestPhone();
		// Regex para formato (dd) 9xxxxx-xxxx
		const phoneRegex = /^\(\d{2}\)\s9\s\d{4}-\d{4}$/;
		expect(phone).toMatch(phoneRegex);
	});

	it("should generate a DDD between 11 and 99", () => {
		const phone = generateTestPhone();
		const ddd = parseInt(phone.slice(1, 3), 10);
		expect(ddd).toBeGreaterThanOrEqual(11);
		expect(ddd).toBeLessThanOrEqual(99);
	});

	it("should always start with 9 after the DDD", () => {
		const phone = generateTestPhone();
		const withoutMask = phone.replace(/\D/g, "");
		const digitAfterDDD = withoutMask.slice(2, 3);
		expect(digitAfterDDD).toBe("9");
	});
});
