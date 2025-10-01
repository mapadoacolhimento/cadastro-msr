import { render, screen } from "@testing-library/react";
import { expect } from "vitest";
import ViolenceTime from "../ViolenceTime";
import MultiStepFormWrapper from "../../MultiStepFormWrapper";
import { sleep } from "@/utils";
import { type Values } from "@/types";
import { violenceTimeOptions } from "@/lib/constants";
import userEvent from "@testing-library/user-event";

const setup = () => {
	return render(
		<MultiStepFormWrapper
			onSubmit={async (values) =>
				await sleep(300).then(() => console.log(values))
			}
			initialValues={
				{
					violenceTime: "",
				} as Values
			}
		>
			{ViolenceTime()}
		</MultiStepFormWrapper>
	);
};

describe("<ViolenceTime />", () => {
	it("should render all violence time options", () => {
		setup();

		violenceTimeOptions.forEach((option) => {
			const roleOptionElement = screen.getByRole("radio", {
				name: `${option.name}`,
			});
			expect(roleOptionElement).toBeInTheDocument();
		});
	});

	it("should render an error if no option is selected", async () => {
		setup();

		const btn = screen.getByRole("button", { name: /enviar/i });
		await userEvent.click(btn);

		const alert = await screen.findByRole("alert");
		expect(alert).toHaveTextContent("Esse campo é obrigatório.");
	});

	it("should change selection when a different option is clicked", async () => {
		setup();

		const first = screen.getByRole("radio", {
			name: violenceTimeOptions[0].name,
		});
		const second = screen.getByRole("radio", {
			name: violenceTimeOptions[1].name,
		});

		await userEvent.click(first);
		expect(first).toBeChecked();

		await userEvent.click(second);
		expect(second).toBeChecked();
		expect(first).not.toBeChecked();
	});
});
