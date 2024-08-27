import {
	render,
	screen,
	waitFor,
	waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Geolocation from "../Geolocation";
import MultiStepFormWrapper from "../../MultiStepFormWrapper";
import createFetchResponse from "../../../../lib/__mocks__/fetch";
import type { Values } from "@/types";
import { normalizeCity } from "@/utils";

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

const cityResponse = [
	{
		value: "SAO PAULO",
		label: "SÃO PAULO",
	},
];

describe("Geolocation", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	beforeEach(() => {
		fetch.mockResolvedValue(createFetchResponse(cityResponse));
	});

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

	describe("Field validation errors", () => {
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
	});

	it("should call fetch with correct params", async () => {
		setup();

		await userEvent.click(screen.getByRole("combobox", { name: "Estado" }));
		await userEvent.click(
			await screen.findByRole("option", { name: "São Paulo" })
		);

		expect(fetch).toHaveBeenCalledWith("/cities?state=SP", {
			method: "GET",
		});
	});

	it("should show loading message when fetching cities", async () => {
		setup();

		await userEvent.click(screen.getByRole("combobox", { name: "Estado" }));
		await userEvent.click(
			await screen.findByRole("option", { name: "São Paulo" })
		);

		await userEvent.click(screen.getByRole("combobox", { name: "Cidade" }));
		expect(
			await screen.findByRole("option", { name: "Carregando cidades..." })
		).toBeInTheDocument();
	});

	it("should validate all fields and not show error messages", async () => {
		setup();

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
		await userEvent.click(
			await screen.findByRole("option", { name: "São Paulo" })
		);

		// city
		await userEvent.click(screen.getByRole("combobox", { name: "Cidade" }));
		await userEvent.click(
			await screen.findByRole("option", { name: "SÃO PAULO" })
		);

		// submit;
		await userEvent.click(screen.getByRole("button", { name: "Enviar" }));

		expect(screen.queryByRole("alert")).not.toBeInTheDocument();
	});

	describe("Error when fetching cities", () => {
		beforeEach(() => {
			vi.restoreAllMocks();
			fetch.mockRejectedValueOnce(createFetchResponse(null, false));
		});

		it("should show error message", async () => {
			setup();

			await userEvent.click(screen.getByRole("combobox", { name: "Estado" }));
			await userEvent.click(
				await screen.findByRole("option", { name: "São Paulo" })
			);

			expect(await screen.findByRole("alert")).toHaveTextContent(
				"Erro ao buscar cidades"
			);
		});
	});

	describe("Autofill geolocation", () => {
		const mockResponse = {
			city: "SÃO PAULO",
			state: "SP",
			neighborhood: "Vila Buarque",
			lat: -23.5505,
			lng: -46.6333,
		};

		beforeEach(() => {
			fetch.mockResolvedValueOnce(createFetchResponse(mockResponse));
		});

		it("should autofill geolocation fields when response is successful", async () => {
			setup();

			await userEvent.type(
				screen.getByRole("textbox", { name: "CEP" }),
				"12345678[tab]"
			);

			const loading = await screen.findByText("Carregando...");
			await waitForElementToBeRemoved(loading);

			expect(
				screen.getByDisplayValue(mockResponse.neighborhood)
			).toBeInTheDocument();
			expect(screen.getByDisplayValue(mockResponse.state)).toBeInTheDocument();
			expect(
				screen.getByDisplayValue(normalizeCity(mockResponse.city))
			).toBeInTheDocument();
		});

		it("should call fetch with correct params", async () => {
			setup();

			const zipcode = "12345678";
			await userEvent.type(
				screen.getByRole("textbox", { name: "CEP" }),
				zipcode + "[tab]"
			);

			expect(fetch).toHaveBeenCalledWith(`/geolocation?zipcode=${zipcode}`, {
				method: "GET",
			});
		});
	});
});
