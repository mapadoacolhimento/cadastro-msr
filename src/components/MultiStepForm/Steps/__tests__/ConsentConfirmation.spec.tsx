import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ConsentConfirmation from "../ConsentConfirmation";
import MultiStepFormWrapper from "../../MultiStepFormWrapper";
import { sleep } from "@/utils";
import { type Values } from "@/types";

const setup = () => {
	return render(
		<MultiStepFormWrapper
			onSubmit={async (values) =>
				await sleep(300).then(() => console.log(values))
			}
			initialValues={
				{
					terms: false,
				} as Values
			}
		>
			{ConsentConfirmation()}
		</MultiStepFormWrapper>
	);
};

describe("<ConsentConfirmation />", () => {
	it("should render the terms text and link", () => {
		setup();

		const text = screen.getByText(
			/Estou ciente de que as informações aqui registradas são verdadeiras/i
		);
		const link = screen.getByRole("link", { name: /termo de consentimento/i });
		const checkbox = screen.getByRole("checkbox");

		expect(text).toBeInTheDocument();
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute(
			"href",
			"https://docs.google.com/document/d/1bcZ3Fqcm_IlWouBD5I9_vkn52yNl5jLK/edit"
		);
		expect(checkbox).toBeInTheDocument();
	});

	it("should show error if checkbox is not checked", async () => {
		setup();

		const submitBtn = screen.getByRole("button", { name: /enviar/i });
		await userEvent.click(submitBtn);

		const error = await screen.findByRole("alert");
		expect(error).toHaveTextContent(
			"Você precisar aceitar o termo para receber atendimento."
		);
	});

	it("should not show error after checking the box", async () => {
		setup();

		const checkbox = screen.getByRole("checkbox");
		const submitBtn = screen.getByRole("button", { name: /enviar/i });

		// Primeiro clica sem marcar
		await userEvent.click(submitBtn);
		const error = await screen.findByRole("alert");
		expect(error).toBeInTheDocument();

		// Marca e tenta novamente
		await userEvent.click(checkbox);
		await userEvent.click(submitBtn);

		// Aguarda o erro sumir
		expect(screen.queryByRole("alert")).not.toBeInTheDocument();
	});
});
