import { render, screen, renderHook } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import DiversityInformation from "../DiversityInformation";
import MultiStepFormWrapper from "../../MultiStepFormWrapper";
import { sleep } from "@/utils";
import { type Values } from "@/types";

const setup = (props?: any) => {
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
			{...props}
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

	it("should render error if hasdisability is empty", async () => {
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

	it("should render disability field when hasDisability field is select 'Sim'", async () => {
		setup();
		const hasDisabilityInput = screen.getByRole("combobox", {
			name: "Você é PcD (Pessoa com deficiência)?",
		});

		await userEvent.click(hasDisabilityInput);
		await userEvent.click(await screen.findByRole("option", { name: "Sim" }));

		const disabilityInput = screen.getByRole("combobox", {
			name: "Qual deficiência você tem?",
		});
		expect(disabilityInput).toBeInTheDocument();
	});

	it("should  NOT render disability field when hasDisability field is select 'Não'", async () => {
		setup();
		const hasDisabilityInput = screen.getByRole("combobox", {
			name: "Você é PcD (Pessoa com deficiência)?",
		});

		await userEvent.click(hasDisabilityInput);
		await userEvent.click(await screen.findByRole("option", { name: "Não" }));

		const disabilityInput = screen.queryByRole("combobox", {
			name: "Qual deficiência você tem?",
		});
		expect(disabilityInput).not.toBeInTheDocument();
	});

	it("should render error if disability is empty", async () => {
		setup();
		const hasDisabilityInput = screen.getByRole("combobox", {
			name: "Você é PcD (Pessoa com deficiência)?",
		});

		await userEvent.click(hasDisabilityInput);
		await userEvent.click(await screen.findByRole("option", { name: "Sim" }));

		const disabilityInput = screen.getByRole("combobox", {
			name: "Qual deficiência você tem?",
		});
		expect(disabilityInput).toBeInTheDocument();

		const btn = screen.getByRole("button", { name: /enviar/i });
		await userEvent.click(btn);

		const errors = await screen.findAllByRole("alert");
		expect(
			errors.find((error) => error.textContent === "Esse campo é obrigatório.")
		).toBeDefined();
	});
});
