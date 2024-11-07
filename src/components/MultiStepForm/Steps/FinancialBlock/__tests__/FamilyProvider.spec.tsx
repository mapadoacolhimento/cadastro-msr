import { expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import FamilyProvider from "../FamilyProvider";
import MultiStepFormWrapper from "../../../MultiStepFormWrapper";
import { sleep } from "@/utils";
import { type Values } from "@/types";
import { familyProviderOptions } from "@/constants";

const setup = () => {
	return render(
		<MultiStepFormWrapper
			onSubmit={async (values) =>
				(await sleep(300).then(() => console.log(values))) as any
			}
			initialValues={
				{
					familyProvider: "",
				} as Values
			}
		>
			{FamilyProvider()}
		</MultiStepFormWrapper>
	);
};

describe("FinancialBlock > <FamilyProvider />", () => {
	it("should render the title", () => {
		setup();
		const title = screen.getByRole("heading", {
			name: /sobre sua renda/i,
			level: 1,
		});
		expect(title).toBeInTheDocument();
	});

	it("should render fields", () => {
		setup();

		familyProviderOptions.forEach((option) => {
			const roleOptionElement = screen.getByRole("radio", {
				name: option.name,
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
			"Esse campo é obrigatório."
		);
	});
});
