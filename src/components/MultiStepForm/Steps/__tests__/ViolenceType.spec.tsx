import { expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ViolenceType from "../ViolenceType";
import MultiStepFormWrapper from "../../MultiStepFormWrapper";

import { sleep } from "@/utils";
import { violenceTypeOptions } from "@/constants";
import { type Values } from "@/types";

const setup = () => {
	return render(
		<MultiStepFormWrapper
			onSubmit={async (values) =>
				(await sleep(300).then(() => console.log(values))) as any
			}
			initialValues={
				{
					violenceType: [],
				} as unknown as Values
			}
		>
			{ViolenceType()}
		</MultiStepFormWrapper>
	);
};

describe("<ViolenceType />", () => {
	it("should render all violence type options", () => {
		setup();

		violenceTypeOptions.forEach((option) => {
			const roleOptionElement = screen.getByRole("checkbox", {
				name: `${option.name} ${option.description} Saiba mais sobre essa violência.`,
			});
			expect(roleOptionElement).toBeInTheDocument();
		});
	});

	it("should render an error if no option is selected", async () => {
		setup();

		const btn = screen.getByRole("button", { name: /enviar/i });
		await userEvent.click(btn);

		await screen.findByRole("alert");

		expect(screen.getByRole("alert")).toHaveTextContent(
			"Selecione um ou mais tipos de violência"
		);
	});
});
