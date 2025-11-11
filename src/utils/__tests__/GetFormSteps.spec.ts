import { describe, it, expect } from "vitest";
import { getFormSteps, getHiddenStepsForm } from "@/utils/getFormSteps";

import { ViolenceTime } from "../../components/MultiStepForm/Steps";

describe("MultiStepForm - Steps Logic", () => {
	describe("getFormSteps function", () => {
		it("should return 11 steps without hidden components", () => {
			const steps = getFormSteps();
			expect(steps).toHaveLength(11);
		});
	});

	describe("getHiddenStepsForm function", () => {
		it("should return an array with one element containing 21 steps including new components", () => {
			const result = getHiddenStepsForm();

			expect(result).toHaveLength(21);
			expect(result[11]).toStrictEqual(ViolenceTime());
		});
	});
});
