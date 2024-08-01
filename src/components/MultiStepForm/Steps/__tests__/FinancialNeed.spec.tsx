import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FinancialNeed from "../FinancialNeed";
import MultiStepFormWrapper from "../../MultiStepFormWrapper";
import { sleep } from "../../../../lib";
import { type Values } from "../..";
import { financialNeedOptions } from "../../../../lib/constants";

vi.mock("next/navigation", () => ({
	useRouter() {
		return {
			prefetch: () => null,
		};
	},
}));

const setup = () => {
	return render(
		<MultiStepFormWrapper
			onSubmit={async (values) =>
				await sleep(300).then(() => console.log(values))
			}
			initialValues={
				{
					financialNeed: "",
				} as Values
			}
		>
			{FinancialNeed()}
		</MultiStepFormWrapper>
	);
};

describe("<FinancialNeed />", () => {
	it("should render fields", () => {
		setup();

		financialNeedOptions.forEach((option) => {
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
