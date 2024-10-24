import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import createFetchResponse from "@/tests/unit/fetch";
import BasicRegisterInformation from "../BasicRegisterInformation";
import MultiStepFormWrapper from "../../MultiStepFormWrapper";
import { sleep } from "@/utils";
import { type Values } from "@/types";

const setup = () => {
	return render(
		<MultiStepFormWrapper
			onSubmit={async (values) =>
				(await sleep(300).then(() => console.log(values))) as any
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
		fetch.mockResolvedValueOnce(createFetchResponse({ values: null }));

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
		fetch.mockResolvedValueOnce(createFetchResponse({ values: null }));

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
});
