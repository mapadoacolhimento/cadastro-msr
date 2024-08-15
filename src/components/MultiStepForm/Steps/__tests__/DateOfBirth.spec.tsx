import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";

import DateOfBirth from "../DateOfBirth";
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
					dateOfBirth: "",
				} as Values
			}
		>
			{DateOfBirth()}
		</MultiStepFormWrapper>
	);
};

describe("DateOfBirth", () => {
	it("should render date of birth field", () => {
		setup();
		const input = screen.getByRole("textbox", { name: "Data de nascimento" });
		expect(input).toBeInTheDocument();
	});

	it("should render error if date of birth is empty", async () => {
		setup();

		const btn = screen.getByRole("button", { name: /enviar/i });
		await userEvent.click(btn);

		expect(await screen.findByRole("alert")).toBeInTheDocument();
		expect(screen.getByRole("alert")).toHaveTextContent(
			"Esse campo é obrigatório."
		);
	});

	it("should render error if date of birth is prior to 1900", async () => {
		setup();

		const input = screen.getByRole("textbox", { name: "Data de nascimento" });
		await userEvent.type(input, "01/01/1889");

		const btn = screen.getByRole("button", { name: /enviar/i });
		await userEvent.click(btn);

		expect(await screen.findByRole("alert")).toBeInTheDocument();
		expect(screen.getByRole("alert")).toHaveTextContent(
			"A data de nascimento não pode ser anterior ao ano de 1900"
		);
	});

	it("should render error if date of birth is invalid", async () => {
		setup();

		const input = screen.getByRole("textbox", { name: "Data de nascimento" });
		await userEvent.type(input, "32/02/1990");

		const btn = screen.getByRole("button", { name: /enviar/i });
		await userEvent.click(btn);

		expect(await screen.findByRole("alert")).toBeInTheDocument();
		expect(screen.getByRole("alert")).toHaveTextContent(
			"Data de nascimento inválida"
		);
	});

	it("should render error if date of birth is today", async () => {
		setup();

		const input = screen.getByRole("textbox", { name: "Data de nascimento" });
		const nextYear = new Date().getFullYear() + 1;
		await userEvent.type(input, `01/01/${nextYear}`);

		const btn = screen.getByRole("button", { name: /enviar/i });
		await userEvent.click(btn);

		expect(await screen.findByRole("alert")).toBeInTheDocument();
		expect(screen.getByRole("alert")).toHaveTextContent(
			"A data de nascimento não pode ser superior ao dia de hoje"
		);
	});

	it("should not render error if date of birth is valid", async () => {
		setup();

		const input = screen.getByRole("textbox", { name: "Data de nascimento" });
		await userEvent.type(input, `01/01/1980`);

		const btn = screen.getByRole("button", { name: /enviar/i });
		await userEvent.click(btn);

		expect(screen.queryByRole("alert")).not.toBeInTheDocument();
	});

	it("should redirect to `fora-criterios` when MSR is under 18 years old", async () => {
		const pushMock = vi.fn();
		useRouter.mockReturnValue({
			push: pushMock,
		});

		setup();

		const today = new Date();
		const seventeenYearsAgo = new Date(
			today.getFullYear() - 17,
			today.getMonth(),
			today.getDate()
		);
		const birthYear17 = seventeenYearsAgo.getFullYear();
		const birthMonth17 = String(seventeenYearsAgo.getMonth() + 1).padStart(
			2,
			"0"
		);
		const birthDay17 = String(seventeenYearsAgo.getDate()).padStart(2, "0");
		const dateOfBirth17 = birthDay17 + birthMonth17 + birthYear17;

		const dateOfBirth = screen.getByRole("textbox", {
			name: /Data de nascimento/i,
		});
		await userEvent.type(dateOfBirth, dateOfBirth17);

		const btn = screen.getByRole("button", { name: /enviar/i });
		await userEvent.click(btn);

		expect(pushMock).toHaveBeenCalledWith("/fora-criterios");
	});
});
