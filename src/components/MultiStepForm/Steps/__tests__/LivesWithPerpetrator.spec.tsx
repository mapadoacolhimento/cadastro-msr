import { render, screen } from "@testing-library/react";
import { expect } from "vitest";
import LivesWithPerpetrator from "../LivesWithPerpetrator";
import MultiStepFormWrapper from "../../MultiStepFormWrapper";
import { sleep } from "@/utils";
import { type Values } from "@/types";
import { livesWithPerpetratorOptions } from "@/lib/constants";
import userEvent from "@testing-library/user-event";

const setup = () => {
	return render(
		<MultiStepFormWrapper
			onSubmit={async (values) =>
				(await sleep(300).then(() => console.log(values))) as any
			}
			initialValues={
				{
					livesWithPerpetrator: "",
				} as Values
			}
		>
			{LivesWithPerpetrator()}
		</MultiStepFormWrapper>
	);
};

describe("<Lives With Perpetrator />", () => {
	it("should render all options", () => {
		setup();

		livesWithPerpetratorOptions.forEach((opt) => {
			const roleOptionElement = screen.getByRole("radio", {
				name: `${opt.name}`,
			});
			expect(roleOptionElement).toBeInTheDocument();
		});
	});

	it("should render an error if no option is selected", async () => {
		setup();

		const btn = screen.getByRole("button", { name: /enviar/i });
		await userEvent.click(btn);

		const alert = await screen.findByRole("alert");
		expect(alert).toHaveTextContent("Esse campo é obrigatório.");
	});
});
