import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PoliceReportDifficulty from "../PoliceReportDifficulty";
import MultiStepFormWrapper from "../../MultiStepFormWrapper";
import { policeReportDifficultyOptions } from "@/constants";
import { sleep } from "@/utils";
import type { Values } from "@/types";

const setup = () => {
	return render(
		<MultiStepFormWrapper
			onSubmit={async (values) =>
				(await sleep(300).then(() => console.log(values))) as any
			}
			initialValues={
				{
					policeReportDifficulty: [],
					policeReportDifficultyOther: "",
				} as unknown as Values
			}
		>
			{PoliceReportDifficulty()}
		</MultiStepFormWrapper>
	);
};

describe("<PoliceReportDifficulty />", () => {
	it("should render all difficulty reasons options", () => {
		setup();

		policeReportDifficultyOptions.forEach((option) => {
			const roleOptionElement = screen.getByRole("checkbox", {
				name: new RegExp(option.name, "i"),
			});
			expect(roleOptionElement).toBeInTheDocument();
		});
	});

	it("should render an error if no option is selected", async () => {
		setup();

		const btn = screen.getByRole("button", { name: /enviar/i });
		await userEvent.click(btn);

		const alert = await screen.findByRole("alert");
		expect(alert).toHaveTextContent(
			/selecione pelo menos uma opção|esse campo é obrigatório/i
		);
	});

	it("should open popup when 'Outro Motivo' option is selected", async () => {
		setup();

		const othersOption = policeReportDifficultyOptions.find(
			(opt) => opt.value === "others"
		);
		expect(othersOption).toBeDefined();

		const othersCheckbox = screen.getByRole("checkbox", {
			name: new RegExp(othersOption!.name, "i"),
		});

		await userEvent.click(othersCheckbox);

		await waitFor(() => {
			expect(screen.getByRole("dialog")).toBeInTheDocument();
		});

		expect(screen.getByText(/descreva a situação/i)).toBeInTheDocument();
	});

	it("should close popup when cancel button is clicked", async () => {
		setup();

		const othersOption = policeReportDifficultyOptions.find(
			(opt) => opt.value === "others"
		);
		const othersCheckbox = screen.getByRole("checkbox", {
			name: new RegExp(othersOption!.name, "i"),
		});

		await userEvent.click(othersCheckbox);

		await waitFor(() => {
			expect(screen.getByRole("dialog")).toBeInTheDocument();
		});

		const cancelButton = screen.getByRole("button", { name: /cancelar/i });
		await userEvent.click(cancelButton);

		await waitFor(() => {
			expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
		});

		expect(othersCheckbox).toBeChecked();
	});

	it("should show error and disable button if popup text area is empty", async () => {
		setup();

		const othersOption = policeReportDifficultyOptions.find(
			(opt) => opt.value === "others"
		);
		const othersCheckbox = screen.getByRole("checkbox", {
			name: new RegExp(othersOption!.name, "i"),
		});

		await userEvent.click(othersCheckbox);

		const dialog = await screen.findByRole("dialog");
		expect(dialog).toBeInTheDocument();

		const confirmButton = within(dialog).getByRole("button", {
			name: /enviar/i,
		});
		expect(confirmButton).toBeDisabled();
	});

	it("should close popup and save text when confirm button is clicked with valid input", async () => {
		setup();

		const othersOption = policeReportDifficultyOptions.find(
			(opt) => opt.value === "others"
		);
		const othersCheckbox = screen.getByRole("checkbox", {
			name: new RegExp(othersOption!.name, "i"),
		});

		await userEvent.click(othersCheckbox);

		const dialog = await screen.findByRole("dialog");
		expect(dialog).toBeInTheDocument();

		const textarea = screen.getByPlaceholderText(/escreva aqui/i);
		await userEvent.type(textarea, "Motivo personalizado de dificuldade");

		const confirmButton = within(dialog).getByRole("button", {
			name: /enviar/i,
		});
		await waitFor(() => {
			expect(confirmButton).toBeEnabled();
		});

		await userEvent.click(confirmButton);

		await waitFor(() => {
			expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
		});

		expect(othersCheckbox).toBeChecked();
	});

	it("should show error on form submit if 'Outros' is selected but text field is empty", async () => {
		setup();

		const othersOption = policeReportDifficultyOptions.find(
			(opt) => opt.value === "others"
		);
		const othersCheckbox = screen.getByRole("checkbox", {
			name: new RegExp(othersOption!.name, "i"),
		});

		await userEvent.click(othersCheckbox);

		await waitFor(() => {
			expect(screen.getByRole("dialog")).toBeInTheDocument();
		});

		const cancelButton = screen.getByRole("button", { name: /cancelar/i });
		await userEvent.click(cancelButton);

		await waitFor(() => {
			expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
		});

		const submitButton = screen.getByRole("button", { name: /enviar/i });
		await userEvent.click(submitButton);

		await waitFor(() => {
			const errorMessage = screen.getByText(/por favor, descreva o motivo/i);
			expect(errorMessage).toBeInTheDocument();
		});
	});

	it("should not allow submitting popup with only whitespace", async () => {
		setup();

		const othersOption = policeReportDifficultyOptions.find(
			(opt) => opt.value === "others"
		);
		const othersCheckbox = screen.getByRole("checkbox", {
			name: new RegExp(othersOption!.name, "i"),
		});

		await userEvent.click(othersCheckbox);

		const dialog = await screen.findByRole("dialog");
		expect(dialog).toBeInTheDocument();

		const textarea = screen.getByPlaceholderText(/escreva aqui/i);
		await userEvent.type(textarea, "   ");

		const confirmButton = within(dialog).getByRole("button", {
			name: /enviar/i,
		});
		expect(confirmButton).toBeDisabled();
	});
});
