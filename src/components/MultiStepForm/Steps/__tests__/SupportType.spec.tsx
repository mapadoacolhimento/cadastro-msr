import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SupportType from "../SupportType";
import MultiStepFormWrapper from "../../MultiStepFormWrapper";
import { sleep } from "../../../../utils";
import { type Values } from "../..";

const setup = () => {
	return render(
		<MultiStepFormWrapper
			onSubmit={async (values) =>
				await sleep(300).then(() => console.log(values))
			}
			initialValues={
				{
					supportType: [] as string[],
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

	it("should render step question", () => {
		setup();

		expect(
			screen.getByText("Que tipo de acolhimento você precisa?")
		).toBeInTheDocument();
	});
});
