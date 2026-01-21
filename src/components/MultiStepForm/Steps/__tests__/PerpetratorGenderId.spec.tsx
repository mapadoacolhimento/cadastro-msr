import { expect } from "vitest";
import { perpetratorGenderOptions } from "@/constants";
import { render, screen } from "@testing-library/react";
import { type Values } from "@/types";
import MultiStepFormWrapper from "../../MultiStepFormWrapper";
import userEvent from "@testing-library/user-event";
import PerpetratorGender from "../PerpetratorGender";

const setup = () => {
	return render(
		<MultiStepFormWrapper
			onSubmit={async (values) =>
				(await sleep(300).then(() => console.log(values))) as any
			}
			initialValues={
				{
					perpetratorGender: "",
				} as unknown as Values
			}
		>
			{PerpetratorGender()}
		</MultiStepFormWrapper>
	);
};

describe("<PerpetratorGender/>", () => {
	it("should render all violence gender id type options", () => {
		setup();

		perpetratorGenderOptions.forEach((option) => {
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
