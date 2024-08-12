import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import BasicRegisterInformation from "../BasicRegisterInformation";
import MultiStepFormWrapper from "../../MultiStepFormWrapper";
import { sleep } from "../../../../lib";
import { type Values } from "../..";

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
					dateOfBirth: "",
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
			name: "Confirme seu E-mail",
		});
		const whatsappInput = screen.getByRole("textbox", { name: "Whatsapp" });
		const colorInput = screen.getByRole("combobox", { name: "Cor" });

		expect(nameInput).toBeInTheDocument();
		expect(emailInput).toBeInTheDocument();
		expect(confirmEmailInput).toBeInTheDocument();
		expect(whatsappInput).toBeInTheDocument();
		expect(colorInput).toBeInTheDocument();
	});

	it("should render empty field error if no info provided", async () => {
		setup();

		const btn = screen.getByRole("button", { name: /enviar/i });
		await userEvent.click(btn);

		await screen.findAllByRole("alert");

		expect(screen.getAllByRole("alert")).toHaveLength(5);
	});

	it("should render error if name field is empty", async () => {
		setup();

		const emailInput = screen.getByRole("textbox", { name: "E-mail" });
		await userEvent.type(emailInput, "test@gmail.com");

		const confirmEmailInput =
			screen.getByPlaceholderText(/Confirme seu e-mail/i);
		await userEvent.type(confirmEmailInput, "test@gmail.com");

		const phoneInput = screen.getByRole("textbox", { name: /whatsapp/i });
		await userEvent.type(phoneInput, "81123430219");

		const dateOfBirth = screen.getByRole("textbox", {
			name: /Data de Nascimento/i,
		});
		await userEvent.type(dateOfBirth, "18111996");

		const btn = screen.getByRole("button", { name: /enviar/i });
		await userEvent.click(btn);

		expect(await screen.findByRole("alert")).toBeInTheDocument();
		expect(screen.getByRole("alert")).toHaveTextContent(
			"Esse campo é obrigatório."
		);
	});

	it("should render error if email field is empty", async () => {
		setup();

		const nameInput = screen.getByRole("textbox", { name: /Primeiro nome/i });
		await userEvent.type(nameInput, "MSR");

		const confirmEmailInput =
			screen.getByPlaceholderText(/Confirme seu e-mail/i);
		await userEvent.type(confirmEmailInput, "test@gmail.com");

		const phoneInput = screen.getByRole("textbox", { name: /whatsapp/i });
		await userEvent.type(phoneInput, "81123430219");

		const dateOfBirth = screen.getByRole("textbox", {
			name: /Data de nascimento/i,
		});
		await userEvent.type(dateOfBirth, "18111996");

		const btn = screen.getByRole("button", { name: /enviar/i });
		await userEvent.click(btn);

		const alerts: HTMLElement[] = await screen.findAllByRole("alert");
		expect(screen.getAllByRole("alert")).toHaveLength(2);
		expect(alerts[0]).toHaveTextContent("Esse campo é obrigatório.");
		expect(alerts[1]).toHaveTextContent("Os e-mails precisam ser iguais.");
	});

	it("should render invalid email field error if no valid email is provided", async () => {
		setup();

		const emailInput = screen.getByRole("textbox", { name: "E-mail" });
		await userEvent.type(emailInput, "test");
		expect(emailInput).toHaveValue("test");

		const btn = screen.getByRole("button", { name: /enviar/i });
		await userEvent.click(btn);

		expect(
			await screen.findByText(/Insira um e-mail válido./i)
		).toBeInTheDocument();
	});

	it("should render error if email confirmation does not match email", async () => {
		setup();
		const nameInput = screen.getByRole("textbox", { name: /Nome/i });
		await userEvent.type(nameInput, "MSR");
		const emailInput = screen.getByRole("textbox", { name: "E-mail" });
		await userEvent.type(emailInput, "msr@test.com");
		const confirmEmailInput =
			screen.getByPlaceholderText(/Confirme seu e-mail/i);
		await userEvent.type(confirmEmailInput, "test@test.com");
		const phoneInput = screen.getByRole("textbox", { name: /whatsapp/i });
		await userEvent.type(phoneInput, "91123430219");
		const dateOfBirth = screen.getByRole("textbox", {
			name: /Data de Nascimento/i,
		});
		await userEvent.type(dateOfBirth, "18111996");

		const btn = screen.getByRole("button", { name: /enviar/i });
		await userEvent.click(btn);

		expect(await screen.findByRole("alert")).toBeInTheDocument();
		expect(screen.getByRole("alert")).toHaveTextContent(
			"Os e-mails precisam ser iguais."
		);
	});

	it("should render error if whatsapp number is invalid", async () => {
		setup();
		const nameInput = screen.getByRole("textbox", { name: /Nome/i });
		await userEvent.type(nameInput, "MSR");
		const emailInput = screen.getByRole("textbox", { name: "E-mail" });
		await userEvent.type(emailInput, "msr@test.com");
		const confirmEmailInput =
			screen.getByPlaceholderText(/Confirme seu e-mail/i);
		await userEvent.type(confirmEmailInput, "msr@test.com");
		const phoneInput = screen.getByRole("textbox", { name: /whatsapp/i });
		await userEvent.type(phoneInput, "123430219");
		const dateOfBirth = screen.getByRole("textbox", {
			name: /Data de nascimento/i,
		});
		await userEvent.type(dateOfBirth, "18111996");

		const btn = screen.getByRole("button", { name: /enviar/i });
		await userEvent.click(btn);

		expect(await screen.findByRole("alert")).toBeInTheDocument();
		expect(screen.getByRole("alert")).toHaveTextContent(
			"Insira um número de telefone válido com DDD."
		);
	});
});
