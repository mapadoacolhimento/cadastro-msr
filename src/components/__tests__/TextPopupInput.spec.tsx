import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import TextPopupInput from "../TextPopupInput";
import { useFormikContext } from "formik";

vi.mock("reactjs-popup", () => ({
	default: ({ open, children }: any) => (open ? <div>{children}</div> : null),
}));

vi.mock("formik", () => ({
	useFormikContext: vi.fn(),
}));

describe("TextPopupInput", () => {
	it("allows typing and submitting the text", async () => {
		const setFieldValue = vi.fn().mockResolvedValue(undefined);
		const setFieldTouched = vi.fn().mockResolvedValue(undefined);
		const validateField = vi.fn().mockResolvedValue(undefined);

		(useFormikContext as any).mockReturnValue({
			values: {
				reason: ["other reason"],
				details: "",
			},
			errors: {},
			touched: {},
			setFieldValue,
			setFieldTouched,
			validateField,
		});

		const user = userEvent.setup();

		render(
			<TextPopupInput
				name="details"
				triggerFieldName="reason"
				triggerValue="other reason"
				title="Explain"
			/>
		);

		await user.type(screen.getByRole("textbox"), "my text");
		await user.click(screen.getByText("Enviar"));

		expect(setFieldValue).toHaveBeenCalledWith("details", "my text");
		expect(setFieldTouched).toHaveBeenCalledWith("details", true);
		expect(validateField).toHaveBeenCalledWith("details");
	});
});
