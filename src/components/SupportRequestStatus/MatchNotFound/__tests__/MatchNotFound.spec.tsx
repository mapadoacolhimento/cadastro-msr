import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import MatchNotFound from "..";
import { SupportRequestData } from "@/types";

const defaultSupportRequests = [
	{
		supportRequestId: 0,
		status: "duplicated",
		supportType: "legal",
	},
	{
		supportRequestId: 1,
		status: "waiting_for_match",
		supportType: "psychological",
	},
] as SupportRequestData[];

const setup = (props?: any) => {
	return render(
		<MatchNotFound supportRequests={defaultSupportRequests} {...props} />
	);
};

describe("<MatchNotFound />", () => {
	it("should have a single card if both support requests have the status 'duplicated'", () => {
		setup({
			supportRequests: [
				{
					...defaultSupportRequests[0],
					status: "duplicated",
				},
				{
					...defaultSupportRequests[1],
					status: "duplicated",
				},
			],
		});
		expect(screen.getAllByText(/verifique seu e-mail/i)).toHaveLength(1);
		expect(screen.getByText(/outras voluntárias/i)).toBeInTheDocument();
	});
	it("should have a single card if both support requests have the status 'waiting_for_match'", () => {
		setup({
			supportRequests: [
				{
					...defaultSupportRequests[0],
					status: "waiting_for_match",
				},
				{
					...defaultSupportRequests[1],
					status: "waiting_for_match",
				},
			],
		});
		expect(screen.getAllByText(/Acompanhe seu e-mail/i)).toHaveLength(1);
		expect(
			screen.getByText(/você está na fila de espera/i)
		).toBeInTheDocument();
	});
	it("should have both cards if support requests have different statuses", () => {
		setup();
		expect(screen.getAllByText(/verifique seu e-mail/i)).toHaveLength(1);
		expect(
			screen.getAllByText(/em busca de uma psicóloga para você/i)
		).toHaveLength(1);
	});

	test.each([
		{
			supportRequests: [
				{
					...defaultSupportRequests[0],
					status: "duplicated",
				},
				{
					...defaultSupportRequests[1],
					status: "duplicated",
				},
			],
			expected: "Você já recebeu o contato das voluntárias",
		},
		{
			supportRequests: [
				{
					...defaultSupportRequests[0],
					status: "waiting_for_match",
				},
				{
					...defaultSupportRequests[1],
					status: "waiting_for_match",
				},
			],
			expected: "Ainda não encontramos voluntárias disponíveis",
		},
		{
			supportRequests: [
				{
					...defaultSupportRequests[0],
					status: "duplicated",
				},
			],
			expected: "Você já recebeu o contato de uma advogada",
		},
		{
			supportRequests: [
				{
					...defaultSupportRequests[1],
					status: "waiting_for_match",
				},
			],
			expected: "Ainda não encontramos uma psicóloga disponível",
		},
		{
			supportRequests: defaultSupportRequests,
			expected: "Atualização sobre seus pedidos de acolhimento",
		},
	])(
		"should return $expected as title for test case %#",
		({ supportRequests, expected }) => {
			setup({
				supportRequests,
			});
			expect(
				screen.getByRole("heading", { name: expected, level: 1 })
			).toBeInTheDocument();
		}
	);

	it("should render footer", () => {
		setup();
		expect(
			screen.queryByText(
				/o contato da voluntária foi enviado para o seu e-mail./
			)
		).not.toBeInTheDocument();
		expect(
			screen.getByRole("link", { name: "atendimento@mapadoacolhimento.org" })
		).toBeInTheDocument();
	});
});
