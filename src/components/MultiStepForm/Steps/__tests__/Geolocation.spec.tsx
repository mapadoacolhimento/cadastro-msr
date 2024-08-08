import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Geolocation from "../Geolocation";
import MultiStepFormWrapper from "../../MultiStepFormWrapper";
import type { Values } from "../..";

const setup = (props?: any) => {
	return render(
		<MultiStepFormWrapper
			onSubmit={vi.fn()}
			initialValues={
				{
					city: "",
					state: "",
					neighborhood: "",
					lat: 0,
					lng: 0,
					zipcode: "",
				} as Values
			}
			{...props}
		>
			{Geolocation()}
		</MultiStepFormWrapper>
	);
};

describe("Geolocation", () => {
	it("should render geolocation fields", () => {
		setup();
		expect(screen.getByRole("textbox", { name: "CEP" })).toBeInTheDocument();
		expect(screen.getByRole("textbox", { name: "Bairro" })).toBeInTheDocument();
		expect(
			screen.getByRole("combobox", { name: "Cidade" })
		).toBeInTheDocument();
		expect(
			screen.getByRole("combobox", { name: "Estado" })
		).toBeInTheDocument();
	});

	it("should show an error message if city is not selected", async () => {
		setup();

		await userEvent.click(screen.getByRole("button", { name: "Enviar" }));

		const errors = await screen.findAllByRole("alert");

		expect(
			errors.find((error) => error.textContent === "Insira sua cidade")
		).toBeDefined();
	});

	it("should show an error message if state is not selected", async () => {
		setup();

		await userEvent.click(screen.getByRole("button", { name: "Enviar" }));

		const errors = await screen.findAllByRole("alert");

		expect(
			errors.find((error) => error.textContent === "Insira seu estado")
		).toBeDefined();
	});

	it("should show an error message if neighborhood is not filled", async () => {
		setup();

		await userEvent.click(screen.getByRole("button", { name: "Enviar" }));

		const errors = await screen.findAllByRole("alert");

		expect(
			errors.find((error) => error.textContent === "Insira seu bairro")
		).toBeDefined();
	});

	it("should show an error message if zipcode is not filled", async () => {
		setup();

		await userEvent.click(screen.getByRole("button", { name: "Enviar" }));

		const errors = await screen.findAllByRole("alert");

		expect(
			errors.find((error) => error.textContent === "Insira seu CEP")
		).toBeDefined();
	});

	it("should show an error message if zipcode is invalid", async () => {
		setup();

		await userEvent.type(
			screen.getByRole("textbox", { name: "CEP" }),
			"1234567"
		);
		await userEvent.click(screen.getByRole("button", { name: "Enviar" }));

		const errors = await screen.findAllByRole("alert");

		expect(
			errors.find((error) => error.textContent === "CEP inválido")
		).toBeDefined();
	});

	it("should validate all fields and go to next step", async () => {
		const mockOnSubmit = vi.fn();
		setup({
			onSubmit: mockOnSubmit,
		});

		// zipcode
		await userEvent.type(
			screen.getByRole("textbox", { name: "CEP" }),
			"12345678"
		);

		// neighborhood
		await userEvent.type(
			screen.getByRole("textbox", { name: "Bairro" }),
			"Vila Buarque"
		);

		// state
		await userEvent.click(screen.getByRole("combobox", { name: "Estado" }));
		await userEvent.click(await screen.findByText("São Paulo"));

		// city
		await userEvent.click(screen.getByRole("combobox", { name: "Cidade" }));
		await userEvent.click(await screen.findByText("SÃO PAULO"));

		// submit
		await userEvent.click(screen.getByRole("button", { name: "Enviar" }));

		expect(screen.queryByRole("alert")).not.toBeInTheDocument();
		expect(mockOnSubmit).toHaveBeenCalledTimes(1);
	});
});
