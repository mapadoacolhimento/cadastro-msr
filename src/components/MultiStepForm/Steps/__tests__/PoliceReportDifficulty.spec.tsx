import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PoliceReportDifficulty from "../PoliceReportDifficulty";
import MultiStepFormWrapper from "../../MultiStepFormWrapper";
import { policeReportDifficultyOptions } from "@/constants";
import { sleep } from "@/utils";
import type { Values } from "@/types";

const setup = () => {
	return render(
		<MultiStepFormWrapper
			onSubmit={async (values) =>
				(await sleep(300).then(() => console.log(values))) as any
			}
			initialValues={
				{
					policeReportDifficulty: "",
				} as Values
			}
		>
			{PoliceReportDifficulty()}
		</MultiStepFormWrapper>
	);
};

describe("<PoliceReportDifficulty />", () => {
	it("should render all difficulty reasons options", () => {
		setup();

		policeReportDifficultyOptions.forEach((option) => {
			const roleOptionElement = screen.getByRole("checkbox", {
				name: new RegExp(option.name, "i"),
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
