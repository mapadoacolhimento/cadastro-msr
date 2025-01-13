import { render, screen } from "@testing-library/react";
import DuplicatedMatchRequest from "../DuplicatedMatchRequest";
import { expect } from "vitest";

const setup = (props?: any) =>
	render(<DuplicatedMatchRequest volunteerType="advogada" {...props} />);

describe("<DuplicatedMatchRequest />", () => {
	it("should render title", () => {
		setup();
		expect(screen.getByText("Verifique seu e-mail")).toBeInTheDocument();
	});
	it("should render description and volunteer type", () => {
		setup();
		expect(
			screen.getByText(
				/Identificamos que você já solicitou ajuda anteriormente./
			)
		).toBeInTheDocument();
		expect(screen.getAllByText(/advogada/i)).toHaveLength(2);
	});
	it("should not mention volunteer type if has many volunteers", () => {
		setup({
			isManyVolunteers: true,
		});
		expect(screen.queryByText(/advogada/i)).not.toBeInTheDocument();
		expect(
			screen.getByText(/te indicar outras voluntárias/i)
		).toBeInTheDocument();
	});
});
