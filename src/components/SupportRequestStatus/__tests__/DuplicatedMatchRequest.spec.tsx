import { render, screen } from "@testing-library/react";
import DuplicatedMatchRequest from "../DuplicatedMatchRequest";
import { expect } from "vitest";

const setup = () => render(<DuplicatedMatchRequest />);

describe("<DuplicatedMatchRequest />", () => {
	it("should render title", () => {
		setup();
		expect(screen.getByText("Verifique seu e-mail")).toBeInTheDocument();
	});
	it("should render description", () => {
		setup();
		expect(
			screen.getByText("O contato da voluntária foi enviado para o seu e-mail.")
		).toBeInTheDocument();
	});
});
