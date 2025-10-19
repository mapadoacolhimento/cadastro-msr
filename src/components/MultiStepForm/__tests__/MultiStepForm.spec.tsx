import { describe, it, expect, vi } from "vitest";
import { getFormSteps, getHiddenStepsForm } from "@/utils/getFormSteps";

describe("MultiStepForm - Steps Logic", () => {
	describe("Steps function", () => {
		it("should return 11 steps without ViolenceTime", () => {
			const steps = getFormSteps();
			expect(steps).toHaveLength(11);
			expect(steps).not.toContain("ViolenceTime");
		});
	});

	describe("newSteps function", () => {
		it("should return an array with one element containing 12 steps including ViolenceTime", () => {
			const result = getHiddenStepsForm();

			expect(result).toHaveLength(1);

			const stepsArray = result[0];
			expect(stepsArray).toHaveLength(12);
		});
	});
});
