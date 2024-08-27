import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ExternalSupport from "../ExternalSupport";
import MultiStepFormWrapper from "../../MultiStepFormWrapper";
import { sleep } from "@/utils";
import { externalSupportOptions } from "@/constants";
import { type Values } from "../..";

const setup = () => {
	return render(
		<MultiStepFormWrapper
			onSubmit={async (values) =>
				await sleep(300).then(() => console.log(values))
			}
			initialValues={
				{
					supportType: ["legal"],
					externalSupport: "",
				} as Values
			}
		>
			{ExternalSupport()}
		</MultiStepFormWrapper>
	);
};

describe("<ExternalSupport />", () => {
	it("should render two options", () => {
		setup();

		externalSupportOptions.forEach((option) => {
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
