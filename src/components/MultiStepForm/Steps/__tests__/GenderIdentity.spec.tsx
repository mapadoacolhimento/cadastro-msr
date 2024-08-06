import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import GenderIdentity from "../GenderIdentity";
import MultiStepFormWrapper from "../../MultiStepFormWrapper";
import { sleep } from "../../../../lib";
import { type Values } from "../..";
import { genderIdentityOptions } from "../../../../lib/constants";

vi.mock("next/navigation", () => ({
	useRouter: vi.fn(),
}));

const setup = () => {
	return render(
		<MultiStepFormWrapper
			onSubmit={async (values) =>
				await sleep(300).then(() => console.log(values))
			}
			initialValues={
				{
					genderIdentity: "",
				} as Values
			}
		>
			{GenderIdentity()}
		</MultiStepFormWrapper>
	);
};

describe("<GenderIdentity />", () => {
	it("should render fields", () => {
		setup();

		genderIdentityOptions.forEach((option) => {
			const roleOptionElement = screen.getByRole("radio", {
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

	it("should redirect to `fora-criterios` if option `Não me identifico como mulher` is selected", async () => {
		const pushMock = vi.fn();
		useRouter.mockReturnValue({
			push: pushMock,
		});

		setup();

		const roleOptionElement = screen.getByRole("radio", {
			name: "Não me identifico como mulher",
		});
		await userEvent.click(roleOptionElement);
		const btn = screen.getByRole("button", { name: /enviar/i });
		await userEvent.click(btn);
		expect(pushMock).toHaveBeenCalledWith("/fora-criterios");
	});
});
