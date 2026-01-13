import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DiversityInformation from "../DiversityInformation";
import MultiStepFormWrapper from "../../MultiStepFormWrapper";
import { sleep } from "@/utils";
import { type Values } from "@/types";

const setup = () => {
	return render(
		<MultiStepFormWrapper
			onSubmit={async (values) =>
				await sleep(300).then(() => console.log(values))
			}
			initialValues={
				{
					color: "",
					hasDisability: "",
				} as Values
			}
		>
			{DiversityInformation()}
		</MultiStepFormWrapper>
	);
};

describe("<DiversityInformation />", () => {
	it("should render fields", () => {
		setup();

		const colorInput = screen.getByRole("combobox", {
			name: "Selecione sua cor",
		});

		expect(colorInput).toBeInTheDocument();
	});

	it("should render empty field error if no info provided", async () => {
		setup();

		const btn = screen.getByRole("button", { name: /enviar/i });
		await userEvent.click(btn);

		await screen.findAllByRole("alert");
	});

	it("should render error if color is empty", async () => {
		setup();
		const btn = screen.getByRole("button", { name: /enviar/i });
		await userEvent.click(btn);

		const errors = await screen.findAllByRole("alert");
		expect(
			errors.find((error) => error.textContent === "Selecione sua cor.")
		).toBeDefined();
	});
});
