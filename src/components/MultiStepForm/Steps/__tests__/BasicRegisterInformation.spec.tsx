import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import BasicRegisterInformation from "../BasicRegisterInformation";
import MultiStepFormWrapper from "../../MultiStepFormWrapper";
import { sleep } from "../../../../lib";
import { type Values } from "../..";
import { useRouter } from "next/navigation";

const setup = () => {
	return render(
		<MultiStepFormWrapper
			onSubmit={async (values) =>
				await sleep(300).then(() => console.log(values))
			}
			initialValues={
				{
					email: "",
					firstName: "",
					confirmEmail: "",
					phone: "",
				} as Values
			}
		>
			{BasicRegisterInformation()}
		</MultiStepFormWrapper>
	);
};

describe("<BasicRegisterInformation />", () => {
	it("should render fields", () => {
		setup();

		const nameInput = screen.getByRole("textbox", { name: "Primeiro nome" });
		const emailInput = screen.getByRole("textbox", { name: "E-mail" });
		const confirmEmailInput = screen.getByRole("textbox", {
			name: "Confirme seu e-mail",
		});
		const whatsappInput = screen.getByRole("textbox", { name: "Whatsapp" });

		expect(nameInput).toBeInTheDocument();
		expect(emailInput).toBeInTheDocument();
		expect(confirmEmailInput).toBeInTheDocument();
		expect(whatsappInput).toBeInTheDocument();
	});

	it("should render empty field error if no info provided", async () => {
		setup();

		const btn = screen.getByRole("button", { name: /enviar/i });
		await userEvent.click(btn);

		await screen.findAllByRole("alert");

		expect(screen.getAllByRole("alert")).toHaveLength(4);
	});

	it("should render error if name field is empty", async () => {
		setup();

		const btn = screen.getByRole("button", { name: /enviar/i });
		await userEvent.click(btn);

		const errors = await screen.findAllByRole("alert");

		expect(
			errors.find((error) => error.textContent === "Insira seu primeiro nome.")
		).toBeDefined();
	});

	it("should render error if email field is empty", async () => {
		setup();

		const btn = screen.getByRole("button", { name: /enviar/i });
		await userEvent.click(btn);

		const errors = await screen.findAllByRole("alert");
		expect(
			errors.find((error) => error.textContent === "Insira seu e-mail.")
		).toBeDefined();
	});

	it("should render invalid email field error if no valid email is provided", async () => {
		setup();

		const emailInput = screen.getByRole("textbox", { name: "E-mail" });
		await userEvent.type(emailInput, "test");
		expect(emailInput).toHaveValue("test");

		const btn = screen.getByRole("button", { name: /enviar/i });
		await userEvent.click(btn);

		const errors = await screen.findAllByRole("alert");
		expect(
			errors.find((error) => error.textContent === "Insira um e-mail válido.")
		).toBeDefined();
	});

	it("should render error if email confirmation does not match email", async () => {
		setup();
		const emailInput = screen.getByRole("textbox", { name: "E-mail" });
		await userEvent.type(emailInput, "msr@test.com");
		const confirmEmailInput = screen.getByRole("textbox", {
			name: "Confirme seu e-mail",
		});
		await userEvent.type(confirmEmailInput, "test@test.com");

		const btn = screen.getByRole("button", { name: /enviar/i });
		await userEvent.click(btn);

		const errors = await screen.findAllByRole("alert");
		expect(
			errors.find(
				(error) => error.textContent === "Os e-mails precisam ser iguais."
			)
		).toBeDefined();
	});

	it("should render error if whatsapp number is invalid", async () => {
		setup();
		const btn = screen.getByRole("button", { name: /enviar/i });
		await userEvent.click(btn);

		const errors = await screen.findAllByRole("alert");
		expect(
			errors.find(
				(error) =>
					error.textContent === "Insira seu número de telefone celular."
			)
		).toBeDefined();
	});

	it("should redirect to `fora-criterios` when MSR is under 18 years old", async () => {
		const pushMock = vi.fn();
		useRouter.mockReturnValue({
			push: pushMock,
		});

		setup();

		const nameInput = screen.getByRole("textbox", { name: /Nome/i });
		await userEvent.type(nameInput, "MSR");
		const emailInput = screen.getByRole("textbox", { name: "E-mail" });
		await userEvent.type(emailInput, "msr@test.com");
		const confirmEmailInput =
			screen.getByPlaceholderText(/Confirme seu e-mail/i);
		await userEvent.type(confirmEmailInput, "msr@test.com");
		const phoneInput = screen.getByRole("textbox", { name: /whatsapp/i });
		await userEvent.type(phoneInput, "81999999999");
		const dateOfBirth = screen.getByRole("textbox", {
			name: /Data de nascimento/i,
		});
		await userEvent.type(dateOfBirth, "18112014");

		const color = screen.getByRole("combobox", { name: /Cor/i });
		await userEvent.click(color);

		const optionColor = screen.getByText("Preta");
		await userEvent.click(optionColor);

		const btn = screen.getByRole("button", { name: /enviar/i });
		await userEvent.click(btn);

		expect(pushMock).toHaveBeenCalledWith("/fora-criterios");
	});
});
