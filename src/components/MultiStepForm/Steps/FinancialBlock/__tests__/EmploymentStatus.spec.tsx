import { expect } from "vitest";
import { useRouter } from "next/navigation";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import EmploymentStatus from "../EmploymentStatus";
import MultiStepFormWrapper from "../../../MultiStepFormWrapper";
import { sleep } from "@/utils";
import { type Values } from "@/types";
import { employmentStatusOptions } from "@/constants";

const setup = () => {
	return render(
		<MultiStepFormWrapper
			onSubmit={async (values) =>
				(await sleep(300).then(() => console.log(values))) as any
			}
			initialValues={
				{
					employmentStatus: "",
					monthlyIncome: "yes",
					monthlyIncomeRange: 4,
				} as Values
			}
		>
			{EmploymentStatus()}
		</MultiStepFormWrapper>
	);
};

describe("FinancialBlock > <EmploymentStatus />", () => {
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

		employmentStatusOptions.forEach((option) => {
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

	it("should redirect to `fora-criterios` if MSR has access to income, receives more than 3 min wages and is student", async () => {
		const pushMock = vi.fn();
		// @ts-expect-error
		useRouter.mockReturnValue({
			push: pushMock,
		});

		setup();

		const dependantStudent = screen.getByRole("radio", {
			name: /Estudante e dependente da minha família/i,
		});
		await userEvent.click(dependantStudent);

		const btn = screen.getByRole("button", { name: /enviar/i });
		await userEvent.click(btn);

		expect(pushMock).toHaveBeenCalledWith("/fora-criterios");
	});
});
