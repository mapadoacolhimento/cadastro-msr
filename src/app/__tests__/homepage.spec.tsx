import { render, screen } from "@testing-library/react";
import Homepage from "../page";

const setup = () => {
	return render(<Homepage />);
};

describe("<Homepage />", () => {
	beforeEach(setup);

	it("should render heading", () => {
		const heading1 = screen.getByRole("heading", {
			name: "Estamos aqui por você",
		});
		expect(heading1).toBeInTheDocument();
	});

	it("should render subtitle", () => {
		const description1 = screen.getByText(
			"Preencha o formulário a seguir para solicitar atendimento psicológico e/ou jurídico de nossas profissionais voluntárias."
		);
		expect(description1).toBeInTheDocument();
	});

	it("should render criteria", () => {
		const list = screen.getAllByRole("listitem");
		const findCriteriaItem = list.find(
			(listitem) =>
				listitem.textContent ===
				"Maiores de 18 anos, residentes do Brasil e em situação de baixa renda podem solicitar atendimento."
		);

		expect(findCriteriaItem).toBeDefined();
	});

	it("should render service conditions", () => {
		const list = screen.getAllByRole("listitem");
		const findFreeServiceItem = list.find(
			(listitem) =>
				listitem.textContent ===
				"O atendimento é totalmente gratuito e exclusivo para mulheres vítimas de violência."
		);

		expect(findFreeServiceItem).toBeDefined();
	});

	it("should render that service communication is by email", () => {
		const list = screen.getAllByRole("listitem");
		const findCommunicationItem = list.find(
			(listitem) =>
				listitem.textContent ===
				"Todas as informações sobre o atendimento serão enviadas por e-mail."
		);

		expect(findCommunicationItem).toBeDefined();
	});

	it("should render button", () => {
		const button = screen.getByRole("button", { name: "Quero ser acolhida" });
		expect(button).toBeInTheDocument();
	});

	it("should render background image", () => {
		const desktopImage = screen.getAllByRole("img", {
			name: "Ilustração com duas mulheres sentadas em um sofá, uma delas está segurando um balão de pensamento com um coração dentro.",
		});
		expect(desktopImage).toHaveLength(2);
	});
});
