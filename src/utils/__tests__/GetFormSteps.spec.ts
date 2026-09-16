import { getFormSteps } from "../getFormSteps";
import { ViolenceTime } from "../../components/MultiStepForm/Steps";

describe("MultiStepForm - Steps Logic", () => {
	describe("getFormSteps function", () => {
		it("should return 21 steps including new components", () => {
			const steps = getFormSteps();

			expect(steps).toHaveLength(21);
			expect(steps[11]).toStrictEqual(ViolenceTime());
		});
	});
});
