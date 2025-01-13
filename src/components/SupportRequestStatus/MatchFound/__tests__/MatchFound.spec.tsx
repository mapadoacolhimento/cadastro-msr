import { render, screen } from "@testing-library/react";
import MatchFound from "..";
import { SupportRequestData } from "@/types";
import { expect } from "vitest";

const defaultSupportRequests = [
	{
		supportRequestId: 0,
		status: "matched",
		supportType: "legal",
		volunteer: {
			firstName: "Test",
			lastName: "Law",
			occupation: "lawyer",
			city: "SAO PAULO",
			state: "SP",
			email: "law.test@gmail.com",
			phone: "11911911019",
			registrationNumber: "12312312",
		},
	},
	{
		supportRequestId: 1,
		status: "matched",
		supportType: "psychological",
		volunteer: {
			firstName: "Test",
			lastName: "Psy",
			occupation: "psychologist",
			city: "SAO PAULO",
			state: "SP",
			email: "psi.test@gmail.com",
			phone: "11911911019",
			registrationNumber: "12312312",
		},
	},
] as SupportRequestData[];

const setup = (props?: any) => {
	return render(
		<MatchFound supportRequests={defaultSupportRequests} {...props} />
	);
};
describe("<MatchFound />", () => {
	it("should render single volunteer on title", () => {
		setup({
			supportRequests: [defaultSupportRequests[1]],
		});
		expect(
			screen.getByText(/encontramos uma psicóloga para acolher você!/i)
		).toBeInTheDocument();
	});
	it("should render many volunteers on title", () => {
		setup();
		expect(
			screen.getByText(/encontramos duas voluntárias para acolher você!/i)
		).toBeInTheDocument();
	});
	it("should render footer", () => {
		setup();
		expect(
			screen.getByText(/O contato da voluntária foi enviado para o seu e-mail./)
		).toBeInTheDocument();
		expect(
			screen.getByRole("link", { name: "atendimento@mapadoacolhimento.org" })
		).toBeInTheDocument();
	});
});
