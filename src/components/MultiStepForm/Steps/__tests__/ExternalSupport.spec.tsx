import { expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";

import ExternalSupport from "../ExternalSupport";
import MultiStepFormWrapper from "../../MultiStepFormWrapper";

import { sleep } from "@/utils";
import { externalSupportOptions } from "@/constants";
import { type Values } from "@/types";

const setup = () => {
	return render(
		<MultiStepFormWrapper
			onSubmit={async (values) =>
				(await sleep(300).then(() => console.log(values))) as any
			}
			initialValues={
				{
					externalSupport: [],
				} as unknown as Values
			}
		>
			{ExternalSupport()}
		</MultiStepFormWrapper>
	);
};

describe("<ExternalSupport />", () => {
	it("should render all external support options", () => {
		setup();

		externalSupportOptions.forEach((option) => {
			const roleOptionElement = screen.getByRole("checkbox", {
				name: option.name,
			});
			expect(roleOptionElement).toBeInTheDocument();
		});
	});

	it("should render an error if no option is selected", async () => {
		setup();

		const btn = screen.getByRole("button", { name: /enviar/i });
		await userEvent.click(btn);

		await screen.findByRole("alert");

		expect(screen.getByRole("alert")).toHaveTextContent(
			"Esse campo é obrigatório."
		);
	});

	it("should redirect to `fora-criterios` if MSR already has external therapist and lawyer support", async () => {
		const pushMock = vi.fn();
		useRouter.mockReturnValue({
			push: pushMock,
		});

		setup();

		const externalTherapistOption = screen.getByRole("checkbox", {
			name: "Estou sendo acompanhada por um(a) psicólogo(a) particular",
		});
		await userEvent.click(externalTherapistOption);
		const externalLawyerOption = screen.getByRole("checkbox", {
			name: "Estou sendo acompanhada na defensoria pública/NUDEM",
		});
		await userEvent.click(externalLawyerOption);

		const btn = screen.getByRole("button", { name: /enviar/i });
		await userEvent.click(btn);

		expect(pushMock).toHaveBeenCalledWith("/fora-criterios");
	});
});
