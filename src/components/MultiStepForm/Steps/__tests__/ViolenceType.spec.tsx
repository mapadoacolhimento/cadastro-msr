import { expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ViolenceType from "../ViolenceType";
import MultiStepFormWrapper from "../../MultiStepFormWrapper";
import { useRouter } from "next/navigation";
import { handleSubmit } from "../ViolenceType";
import { sleep } from "@/utils";
import { violenceTypeOptions } from "@/constants";
import { type Values } from "@/types";

const setup = () => {
	return render(
		<MultiStepFormWrapper
			onSubmit={async (values) =>
				(await sleep(300).then(() => console.log(values))) as any
			}
			initialValues={
				{
					violenceType: [],
				} as unknown as Values
			}
		>
			{ViolenceType()}
		</MultiStepFormWrapper>
	);
};

describe("<ViolenceType />", () => {
	it("should render all violence type options", () => {
		setup();

		violenceTypeOptions.forEach((option) => {
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

		await screen.findByRole("alert");

		expect(screen.getByRole("alert")).toHaveTextContent(
			"Selecione um ou mais tipos de violência"
		);
	});
});

it("should redirect to `fora-criterios` if MSR is not suffering violence", async () => {
	const pushMock = vi.fn();
	useRouter.mockReturnValue({
		push: pushMock,
	});

	setup();

	const noViolenceOpt = screen.getByRole("checkbox", {
		name: "Não estou sofrendo violência/Não sofri violência",
	});
	await userEvent.click(noViolenceOpt);

	const btn = screen.getByRole("button", { name: /enviar/i });
	await userEvent.click(btn);

	expect(pushMock).toHaveBeenCalledWith("/fora-criterios");
});

it("should return redirect to /fora-criterios when 'noViolence' is selected", async () => {
	const values = {
		violenceType: ["no_violence"],
	} as Values;

	const result = await handleSubmit(values);

	expect(result).toEqual({ redirectTo: "/fora-criterios" });
});

it("should not redirect when 'noViolence' is selected with other violence types", async () => {
	const values = {
		violenceType: ["no_violence", "physical"],
	} as Values;

	const result = await handleSubmit(values);

	expect(result).not.toEqual({ redirectTo: "/fora-criterios" });
});

it("renders info buttons only for options with descriptions", () => {
	setup();

	const expectedButtons = violenceTypeOptions.filter(
		(o) => o.value !== "no_violence"
	).length;
	const infoButtons = screen.getAllByRole("button", {
		name: /saiba mais sobre essa violência/i,
	});
	expect(infoButtons).toHaveLength(expectedButtons);
});
