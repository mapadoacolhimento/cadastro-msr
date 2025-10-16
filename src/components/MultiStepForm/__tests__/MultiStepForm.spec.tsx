import { describe, it, expect, vi } from "vitest";

vi.mock("../Steps", () => ({
	BasicRegisterInformation: () => "BasicRegisterInformation",
	SupportType: () => "SupportType",
	GenderIdentity: () => "GenderIdentity",
	ViolenceLocation: () => "ViolenceLocation",
	ExternalSupport: () => "ExternalSupport",
	Geolocation: () => "Geolocation",
	DiversityInformation: () => "DiversityInformation",
	DateOfBirth: () => "DateOfBirth",
	BeginRegistration: () => "BeginRegistration",
	FinancialBlock: () => "FinancialBlock",
	ViolenceType: () => "ViolenceType",
	ViolenceTime: () => "ViolenceTime",
}));

import { Steps, newSteps } from "../index";

describe("MultiStepForm - Steps Logic", () => {
	describe("Steps function", () => {
		it("should return 11 steps without ViolenceTime", () => {
			const steps = Steps();
			expect(steps).toHaveLength(11);
			expect(steps).not.toContain("ViolenceTime");
		});
	});

	describe("newSteps function", () => {
		it("should return an array with one element containing 12 steps including ViolenceTime", () => {
			const result = newSteps();

			expect(result).toHaveLength(1);

			const stepsArray = result[0];
			expect(stepsArray).toHaveLength(12);

			expect(stepsArray[stepsArray.length - 1]).toBe("ViolenceTime");
		});
	});
});
