import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import AcceptsOnlineSupport from "../AcceptsOnlineSupport";
import MultiStepFormWrapper from "../../MultiStepFormWrapper";
import { sleep } from "../../../../lib";
import type { Values } from "../..";

const setup = () => {
	return render(
		<MultiStepFormWrapper
			onSubmit={async (values) =>
				await sleep(300).then(() => console.log(values))
			}
			initialValues={
				{
					acceptsOnlineSupport: "",
				} as Values
			}
		>
			{AcceptsOnlineSupport()}
		</MultiStepFormWrapper>
	);
};

describe("<AcceptsOnlineSupport />", () => {
	it("should render two options", () => {
		setup();

		expect(
			screen.getByRole("radio", {
				name: /sim, aceito ser atendida online/i,
			})
		).toBeInTheDocument();
		expect(
			screen.getByRole("radio", {
				name: /não, só posso receber atendimento presencial/i,
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
});
