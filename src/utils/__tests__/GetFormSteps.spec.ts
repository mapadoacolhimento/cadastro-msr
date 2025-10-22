import { describe, it, expect, vi } from "vitest";
import { getFormSteps, getHiddenStepsForm } from "@/utils/getFormSteps";

import { ViolenceTime } from "../../components/MultiStepForm/Steps";

describe("MultiStepForm - Steps Logic", () => {
	describe("getFormSteps function", () => {
		it("should return 11 steps without ViolenceTime", () => {
			const steps = getFormSteps();
			expect(steps).toHaveLength(11);
		});
	});

	describe("getHiddenStepsForm function", () => {
		it("should return an array with one element containing 12 steps including ViolenceTime", () => {
			const result = getHiddenStepsForm();

			expect(result).toHaveLength(12);
			expect(result[11]).toStrictEqual(ViolenceTime());
		});
	});
});
