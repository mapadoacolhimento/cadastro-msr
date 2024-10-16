import { expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SupportType from "../SupportType";
import MultiStepFormWrapper from "../../MultiStepFormWrapper";
import { sleep } from "@/utils";
import { type Values } from "@/types";

const setup = (props?: any) => {
	return render(
		<MultiStepFormWrapper
			onSubmit={async (values) =>
				(await sleep(300).then(() => console.log(values))) as any
			}
			initialValues={
				{
					supportType: [] as string[],
					externalSupport: [],
					...props?.initialValues,
				} as Values
			}
		>
			{SupportType()}
		</MultiStepFormWrapper>
	);
};

describe("<SupportType />", () => {
	it("should render two options", () => {
		setup();

		expect(
			screen.getByRole("checkbox", {
				name: /acolhimento psicológico/i,
			})
		).toBeInTheDocument();
		expect(
			screen.getByRole("checkbox", {
				name: /acolhimento jurídico/i,
			})
		).toBeInTheDocument();
	});

	it("should render an error if no option is selected", async () => {
		setup();

		const btn = screen.getByRole("button", { name: /enviar/i });
		await userEvent.click(btn);

		await screen.findByRole("alert");

		expect(screen.getByRole("alert")).toHaveTextContent(
			"Esse campo é obrigatório."
		);
	});

	it("should block legal support if has private lawyer", async () => {
		setup({ initialValues: { externalSupport: ["privateLawyer"] } });

		const legalSupportCheckbox = screen.getByRole("checkbox", {
			name: /acolhimento jurídico/i,
		}) as HTMLInputElement;

		expect(legalSupportCheckbox).toBeDisabled();
	});

	it("should block legal support if has public defender", async () => {
		setup({ initialValues: { externalSupport: ["publicDefender"] } });

		const legalSupportCheckbox = screen.getByRole("checkbox", {
			name: /acolhimento jurídico/i,
		}) as HTMLInputElement;

		expect(legalSupportCheckbox).toBeDisabled();
	});

	it("should block psychologicak support if has private therapist", async () => {
		setup({ initialValues: { externalSupport: ["privateTherapist"] } });

		const psySupportCheckbox = screen.getByRole("checkbox", {
			name: /acolhimento psicológico/i,
		}) as HTMLInputElement;

		expect(psySupportCheckbox).toBeDisabled();
	});
});
