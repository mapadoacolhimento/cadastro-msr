import { describe, it, expect, beforeAll, beforeEach } from "vitest";

import {
	BasicRegisterInformation,
	SupportType,
	GenderIdentity,
	ViolenceLocation,
	ExternalSupport,
	Geolocation,
	DiversityInformation,
	DateOfBirth,
	BeginRegistration,
	FinancialBlock,
	ViolenceType,
	ViolenceTime,
} from "../Steps";

describe("Components", () => {
	const allComponents = {
		BasicRegisterInformation,
		SupportType,
		GenderIdentity,
		ViolenceLocation,
		ExternalSupport,
		Geolocation,
		DiversityInformation,
		DateOfBirth,
		BeginRegistration,
		FinancialBlock,
		ViolenceType,
		ViolenceTime,
	};

	const getVisibleComponents = () => {
		const ENABLE_NEW_STEPS = process.env.SHOW_NEW_STEPS === "true";

		if (ENABLE_NEW_STEPS) {
			return allComponents;
		}

		const { ViolenceTime, ...componentsWithoutViolenceTime } = allComponents;
		return componentsWithoutViolenceTime;
	};

	describe("when SHOW_NEW_STEPS is true", () => {
		beforeAll(() => {
			process.env.SHOW_NEW_STEPS = "true";
		});

		it("should have exactly 12 components visible", () => {
			const components = getVisibleComponents();
			expect(Object.keys(components)).toHaveLength(12);
		});

		it("should include ViolenceTime component", () => {
			const components = getVisibleComponents();
			expect(components).toHaveProperty("ViolenceTime");
		});

		it("should include ViolenceTime in steps", () => {
			const ENABLE_NEW_STEPS = process.env.SHOW_NEW_STEPS === "true";
			expect(ENABLE_NEW_STEPS).toBe(true);
		});
	});

	describe("when SHOW_NEW_STEPS is false", () => {
		beforeAll(() => {
			process.env.SHOW_NEW_STEPS = "false";
		});

		it("should have exactly 11 components visible", () => {
			const components = getVisibleComponents();
			expect(Object.keys(components)).toHaveLength(11);
		});

		it("should NOT include ViolenceTime component", () => {
			const components = getVisibleComponents();
			expect(components).not.toHaveProperty("ViolenceTime");
		});

		it("should not include ViolenceTime in steps", () => {
			const ENABLE_NEW_STEPS = process.env.SHOW_NEW_STEPS === "true";
			expect(ENABLE_NEW_STEPS).toBe(false);
		});
	});
});
