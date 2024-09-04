import { expect } from "vitest";
import { render, screen } from "@testing-library/react";
import TransitoryStep from "../TransitoryStep";

describe("<TransitoryStep />", () => {
	describe("Loading", () => {
		it("should render headers and descriptions", () => {
			render(<TransitoryStep.Loading />);

			const heading1 = screen.getByRole("heading", {
				name: "Cadastro realizado",
				level: 1,
			});
			expect(heading1).toBeInTheDocument();

			const description1 = screen.getByText(
				"Nesse momento estamos analisando seus dados e buscando uma voluntária para te atender."
			);
			expect(description1).toBeInTheDocument();
		});
	});

	describe("Error", () => {
		test("renders the error message and description", () => {
			const errorMessage = "Test error message";

			render(<TransitoryStep.Error errorMsg={errorMessage} />);

			expect(
				screen.getByRole("heading", { name: "Ocorreu um erro inesperado" })
			).toBeInTheDocument();

			expect(screen.getByText(errorMessage)).toBeInTheDocument();

			expect(
				screen.getByText("Por favor, realize o cadastro novamente.")
			).toBeInTheDocument();

			expect(
				screen.getAllByAltText(
					"Ilustração de uma mulher com cabelo castanho escuro e blusa roxa com um coração branco do mapa do acolhimento"
				)
			).toHaveLength(2);
		});
	});
});
