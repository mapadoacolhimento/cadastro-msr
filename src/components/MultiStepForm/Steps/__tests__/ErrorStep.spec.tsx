import { render, screen } from "@testing-library/react";
import ErrorStep from "../ErrorStep"; // ajuste o caminho conforme necessário
import "@testing-library/jest-dom"; // para matchers adicionais

describe("ErrorStep Component", () => {
	test("renders the error message and description", () => {
		const errorMessage = "Test error message";

		render(<ErrorStep message={errorMessage} />);

		expect(screen.getByText("Ocorreu um erro inesperado")).toBeInTheDocument();

		expect(screen.getByText(errorMessage)).toBeInTheDocument();

		expect(
			screen.getByText("Por favor, realize o cadastro novamente")
		).toBeInTheDocument();

		expect(screen.getByAltText("Ícone de erro")).toBeInTheDocument();
	});
});
