import { render, screen } from "@testing-library/react";
import { expect } from "vitest";
import LegalActionsTaken from "../LegalActionsTaken";
import MultiStepFormWrapper from "../../MultiStepFormWrapper";
import { sleep } from "@/utils";
import { type Values } from "@/types";
import { legalActionsTakenOptions } from "@/lib/constants";
import userEvent from "@testing-library/user-event";

const setup = () => {
	return render(
		<MultiStepFormWrapper
			onSubmit={async (values) =>
				(await sleep(300).then(() => console.log(values))) as any
			}
			initialValues={
				{
					legalActionsTaken: [] as string[],
				} as Values
			}
		>
			{LegalActionsTaken()}
		</MultiStepFormWrapper>
	);
};

describe("<LegalActionsTaken />", () => {
	it("should render all violence location options", () => {
		setup();

		legalActionsTakenOptions.forEach((option) => {
			const roleOptionElement = screen.getByRole("checkbox", {
				name: `${option.name}`,
			});
			expect(roleOptionElement).toBeInTheDocument();
		});
	});

	it("should render an error if no option is selected", async () => {
		setup();

		const btn = screen.getByRole("button", { name: /enviar/i });
		await userEvent.click(btn);

		const alert = await screen.findByRole("alert");
		expect(alert).toHaveTextContent("Selecione uma ou mais opções.");
	});
});
