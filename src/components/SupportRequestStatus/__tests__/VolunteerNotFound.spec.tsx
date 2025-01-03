import { expect } from "vitest";
import { render, screen } from "@testing-library/react";
import VolunteerNotFound from "../VolunteerNotFound";
import { i } from "vitest/dist/reporters-yx5ZTtEV.js";

const setup = (props?: any) =>
	render(<VolunteerNotFound volunteerType="psicólogca" {...props} />);

describe("<VolunteerNotFound />", () => {
	it("should render title with 'psicóloga' volunteer type", () => {
		setup();
		expect(
			screen.getByText("Em busca de uma psicólogca para você")
		).toBeInTheDocument();
	});
	it("should render title with 'advogada' volunteer type", () => {
		setup({
			volunteerType: "advogada",
		});
		expect(
			screen.getByText("Em busca de uma advogada para você")
		).toBeInTheDocument();
	});
	it("should render description", () => {
		setup("legal");
		expect(
			screen.getByText(/por e-mail assim que localizarmos/i)
		).toBeInTheDocument();
	});
	it("should render default title with many volunteers", () => {
		setup({
			isManyVolunteers: true,
		});
		expect(screen.getByText(/Acompanhe seu e-mail/i)).toBeInTheDocument();
	});
	it("should different description with many volunteers", () => {
		setup({
			isManyVolunteers: true,
		});
		expect(
			screen.getByText(
				/Você está na fila de espera, e nossa equipe está buscando diariamente voluntárias disponíveis./i
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
