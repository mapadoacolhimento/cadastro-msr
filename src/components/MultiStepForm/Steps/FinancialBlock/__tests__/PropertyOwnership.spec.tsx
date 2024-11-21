import { expect } from "vitest";
import { useRouter } from "next/navigation";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import PropertyOwnership from "../PropertyOwnership";
import MultiStepFormWrapper from "../../../MultiStepFormWrapper";
import { sleep } from "@/utils";
import { type Values } from "@/types";
import { propertyOwnershipOptions } from "@/constants";

const setup = () => {
	return render(
		<MultiStepFormWrapper
			onSubmit={async (values) =>
				(await sleep(300).then(() => console.log(values))) as any
			}
			initialValues={
				{
					familyProvider: "yes",
					employmentStatus: "employedClt",
					monthlyIncome: "yes",
					monthlyIncomeRange: 5,
					dependants: "yes",
					propertyOwnership: "",
				} as Values
			}
		>
			{PropertyOwnership()}
		</MultiStepFormWrapper>
	);
};

describe("FinancialBlock > <PropertyOwnership />", () => {
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

		propertyOwnershipOptions.forEach((option) => {
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

	it("should redirect to `fora-criterios` if MSR has access to income, receives more than 3 min wages and has property", async () => {
		const pushMock = vi.fn();

		useRouter.mockReturnValue({
			push: pushMock,
		});

		setup();

		const hasPropertyOption = screen.getByRole("radio", {
			name: /Sim/i,
		});
		await userEvent.click(hasPropertyOption);

		const btn = screen.getByRole("button", { name: /enviar/i });
		await userEvent.click(btn);

		expect(pushMock).toHaveBeenCalledWith("/fora-criterios");
	});
});
