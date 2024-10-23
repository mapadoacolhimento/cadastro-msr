import { expect } from "vitest";
import { render, screen } from "@testing-library/react";
import BeginRegistration from "../BeginRegistration";
import MultiStepFormWrapper from "../../MultiStepFormWrapper";
import { Values } from "@/types";

const setup = () => {
	return render(
		<MultiStepFormWrapper onSubmit={vitest.fn()} initialValues={{} as Values}>
			{BeginRegistration()}
		</MultiStepFormWrapper>
	);
};

describe("<BeginRegistration />", () => {
	it("should render the step title", () => {
		setup();
		expect(
			screen.getByRole("heading", {
				name: /você não está sozinha/i,
				level: 2,
			})
		).toBeInTheDocument();
	});

	it("should render the description text", () => {
		setup();
		expect(
			screen.getByText(
				/Com base nas suas respostas identificamos que você pode ser atendida pelo projeto. Agora precisamos de mais algumas informações para concluir o seu cadastro e te direcionar para o atendimento adequado. Vamos lá?/i
			)
		).toBeInTheDocument();
	});

	it("should render the submit button", () => {
		setup();
		expect(
			screen.getByRole("button", { name: /iniciar cadastro/i })
		).toBeInTheDocument();
	});

	it("should render the image with correct attributes", () => {
		setup();
		const img = screen.getAllByRole("img", {
			name: /ilustração com três mulheres, em que uma delas está sendo acolhida pelas outras duas da ponta./i,
		});

		expect(img[0]).toHaveAttribute(
			"alt",
			"Ilustração com três mulheres, em que uma delas está sendo acolhida pelas outras duas da ponta."
		);
	});
});
