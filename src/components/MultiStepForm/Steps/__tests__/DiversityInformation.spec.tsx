import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import DiversityInformation from "../DiversityInformation";
import MultiStepFormWrapper from "../../MultiStepFormWrapper";
import { sleep } from "../../../../lib";
import { type Values } from "../..";

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
					terms: false,
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

		const colorInput = screen.getByRole("combobox", { name: "Cor" });
		const disabilityInput = screen.getByRole("combobox", {
			name: "Você é PcD (Pessoa com deficiência)?",
		});
		const termsCheckbox = screen.getByRole("checkbox");

		expect(colorInput).toBeInTheDocument();
		expect(disabilityInput).toBeInTheDocument();
		expect(termsCheckbox).toBeInTheDocument();
	});

	it("should render empty field error if no info provided", async () => {
		setup();

		const btn = screen.getByRole("button", { name: /enviar/i });
		await userEvent.click(btn);

		await screen.findAllByRole("alert");

		expect(screen.getAllByRole("alert")).toHaveLength(3);
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

	it("should render error if disability is empty", async () => {
		setup();
		const btn = screen.getByRole("button", { name: /enviar/i });
		await userEvent.click(btn);

		const errors = await screen.findAllByRole("alert");
		expect(
			errors.find((error) => error.textContent === "Esse campo é obrigatório.")
		).toBeDefined();
	});

	it("should render error if terms is not accepted", async () => {
		setup();
		const btn = screen.getByRole("button", { name: /enviar/i });
		await userEvent.click(btn);

		const errors = await screen.findAllByRole("alert");
		expect(
			errors.find(
				(error) =>
					error.textContent ===
					"Você precisar aceitar os termos para receber atendimento."
			)
		).toBeDefined();
	});
});
