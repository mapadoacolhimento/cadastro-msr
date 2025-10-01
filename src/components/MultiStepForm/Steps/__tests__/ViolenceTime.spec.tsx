import { render, screen } from "@testing-library/react";
import { expect } from "vitest";
import ViolenceTime from "../ViolenceTime";
import MultiStepFormWrapper from "../../MultiStepFormWrapper";
import { sleep } from "@/utils";
import { type Values } from "@/types";
import { violenceTimeOptions } from "@/lib/constants";

const setup = () => {
	return render(
		<MultiStepFormWrapper
			onSubmit={async (values) =>
				await sleep(300).then(() => console.log(values))
			}
			initialValues={
				{
					violenceTime: [],
				} as unknown as Values
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
			const roleOptionElement = screen.getByRole("checkbox", {
				name: `${option.name}`,
			});
			expect(roleOptionElement).toBeInTheDocument();
		});
	});
});
