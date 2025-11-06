import { protectiveFactorsOptions } from "@/lib";
import ProtectiveFactors from "../ProtectiveFactors";
import userEvent from "@testing-library/user-event";
import { Values } from "@/types";
import { expect } from "vitest";
import { sleep } from "@/utils";
import { render, screen } from "@testing-library/react";
import MultiStepFormWrapper from "../../MultiStepFormWrapper";

const setup = () => {
	return render(
		<MultiStepFormWrapper
			onSubmit={async (values) =>
				(await sleep(300).then(() => console.log(values))) as any
			}
			initialValues={
				{
					protectiveFactors: [],
				} as unknown as Values
			}
		>
			{ProtectiveFactors()}
		</MultiStepFormWrapper>
	);
};

describe("<ProtectiveFactors />", () => {
	it("should render all protective factors options", () => {
		setup();

		protectiveFactorsOptions.forEach((option) => {
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

		await screen.findByRole("alert");

		expect(screen.getByRole("alert")).toHaveTextContent(
			"Selecione uma ou mais opções"
		);
	});
});
