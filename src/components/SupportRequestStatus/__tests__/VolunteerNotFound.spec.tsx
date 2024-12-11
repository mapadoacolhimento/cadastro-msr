import { SupportRequests } from "@prisma/client";
import { expect } from "vitest";
import { render, screen } from "@testing-library/react";
import VolunteerNotFound from "../VolunteerNotFound";

const setup = (supportType: SupportRequests["supportType"]) =>
	render(<VolunteerNotFound supportType={supportType} />);

describe("<VolunteerNotFound />", () => {
	it("should render title with 'psicóloga' volunteer type", () => {
		setup("psychological");
		expect(
			screen.getByText("Em busca de uma psicóloga para você")
		).toBeInTheDocument();
	});
	it("should render title with 'advogada' volunteer type", () => {
		setup("legal");
		expect(
			screen.getByText("Em busca de uma advogada para você")
		).toBeInTheDocument();
	});
	it("should render description", () => {
		setup("legal");
		expect(
			screen.getByText(
				/Ainda não encontramos uma voluntária próxima a você, mas seguimos buscando diariamente./
			)
		).toBeInTheDocument();
	});
	it("should render icon", () => {
		setup("psychological");

		expect(
			screen.getByRole("img", { name: /ícone de busca/i })
		).toBeInTheDocument();
	});
});
