import { expect } from "vitest";
import { render, screen } from "@testing-library/react";
import RegistrationCompleted from "../cadastro-finalizado/page";

const setup = () => {
	return render(<RegistrationCompleted />);
};

describe("<RegistrationCompleted />", () => {
	it("should render headers and descriptions", () => {
		setup();

		const heading1 = screen.getByRole("heading", {
			name: "Agora é só esperar",
			level: 1,
		});
		expect(heading1).toBeInTheDocument();

		const description1 = screen.getByText(
			"Entraremos em contato por e-mail quando houver uma voluntária disponível para você."
		);
		expect(description1).toBeInTheDocument();

		const heading2 = screen.getByRole("heading", {
			name: "Como podemos te ajudar:",
			level: 2,
		});

		expect(heading2).toBeInTheDocument();

		const description2 = screen.getByText(
			"Conheça a rede de apoio que você pode acessar e um material preparado com cuidado para te ajudar nesse momento difícil:"
		);
		expect(description2).toBeInTheDocument();
	});

	it("should render help cards", () => {
		setup();

		const image1 = screen.getByRole("img", {
			name: "Mulher recebendo atendimento por outra mulher",
		});
		expect(image1).toBeInTheDocument();

		const title1 = screen.getByText("Onde e como posso pedir ajuda?");
		expect(title1).toBeInTheDocument();

		const description1 = screen.getByText(
			"Conheça os serviços públicos de proteção que você pode acessar."
		);
		expect(description1).toBeInTheDocument();

		const image2 = screen.getByRole("img", {
			name: "Mulher de cabeça baixa tampando os ouvidos",
		});
		expect(image2).toBeInTheDocument();

		const title2 = screen.getByText("Sofri violência, e agora?");
		expect(title2).toBeInTheDocument();

		const description2 = screen.getByText(
			"Um guia prático para deixar o ciclo da violência."
		);
		expect(description2).toBeInTheDocument();
	});
});
