import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LegalActionDifficulty from "../LegalActionDifficulty";
import MultiStepFormWrapper from "../../MultiStepFormWrapper";
import { legalActionDifficultyOptions } from "@/constants";
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
					legalActionDifficulty: [],
				} as unknown as Values
			}
		>
			{LegalActionDifficulty()}
		</MultiStepFormWrapper>
	);
};

describe("<LegalActionDifficulty />", () => {
	it("should render all difficulty reasons options", () => {
		setup();

		legalActionDifficultyOptions.forEach((option) => {
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

		const alert = await screen.findByRole("alert");
		expect(alert).toHaveTextContent(
			/selecione pelo menos uma opção|esse campo é obrigatório/i
		);
	});
});
