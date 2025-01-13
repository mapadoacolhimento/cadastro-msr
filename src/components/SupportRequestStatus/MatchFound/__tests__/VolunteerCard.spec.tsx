import { expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToastContainer } from "react-toastify";

import VolunteerCard from "../VolunteerCard";
import type { SupportRequestData } from "@/types";

const defaultProps = {
	volunteer: {
		id: 1,
		firstName: "Joana",
		lastName: "Nascimento",
		email: "joana.nascimento@gmail.com",
		phone: "92988426606",
		registrationNumber: "11.1111/11",
		occupation: "psychologist",
		city: "ARACAJU",
		state: "SE",
	},
	supportType: "psychological",
} as SupportRequestData;

const setup = (props = defaultProps) => {
	return render(
		<>
			<VolunteerCard {...props} />
			<ToastContainer />
		</>
	);
};

describe("<VolunteerCard />", () => {
	it("should render volunteer name", () => {
		setup();
		expect(screen.getByText("Joana Nascimento")).toBeInTheDocument();
	});
	it("should render volunteer city and state", () => {
		setup();

		expect(screen.getByText("Aracaju")).toBeInTheDocument();
		expect(screen.getByText(/SE/i)).toBeInTheDocument();
	});
	it("should render a copy button", () => {
		setup();

		expect(
			screen.getByRole("button", { name: /copiar dados/i })
		).toBeInTheDocument();
	});
	it("should render volunteer email", () => {
		setup();

		expect(screen.getByText("joana.nascimento@gmail.com")).toBeInTheDocument();
	});
	it("should render volunteer phone", () => {
		setup();

		expect(screen.getByText("(92) 9 8842-6606")).toBeInTheDocument();
	});
	it("should render send whatsapp btn", () => {
		setup();

		const link = screen.getByRole("link", { name: /enviar whatsapp/i });
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute("href", "https://wa.me/5592988426606");
	});
	it("should render send email btn", () => {
		setup();

		const link = screen.getByRole("link", { name: /enviar e-mail/i });
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute("href", "mailto:joana.nascimento@gmail.com");
	});
	it("should render a toast feedback when clicking on copy btn", async () => {
		setup();

		const { click } = userEvent.setup();
		const copyBtn = screen.getByRole("button", { name: /copiar dados/i });
		await click(copyBtn);

		expect(await screen.findByRole("alert")).toHaveTextContent(
			"Informações copiadas com sucesso"
		);
	});

	describe("Psychologist", () => {
		it("should render CRP as registration type and registration number", () => {
			setup();

			expect(screen.getByText(/CRP/)).toBeInTheDocument();
			expect(screen.getByText(/11.1111\/11/)).toBeInTheDocument();
		});
		it("should render 'Psicóloga' as volunteer type", () => {
			setup();

			expect(screen.getByText(/Psicóloga/)).toBeInTheDocument();
		});
		it("should copy correct information when clicking on copy btn", async () => {
			setup();

			const { click } = userEvent.setup();
			const copyBtn = screen.getByRole("button", { name: /copiar dados/i });
			await click(copyBtn);
			const copiedText = await window.navigator.clipboard.readText();
			expect(copiedText).toEqual(
				"Psicóloga\nNome: Joana Nascimento\nE-mail: joana.nascimento@gmail.com\nWhatsApp: https://wa.me/5592988426606\nCRP: 11.1111/11"
			);
		});
	});
	describe("Lawyer", () => {
		it("should render OAB as registration type and registration number", () => {
			setup({
				...defaultProps,
				supportType: "legal",
				volunteer: {
					...defaultProps.volunteer,
					occupation: "lawyer",
				},
			} as SupportRequestData);
			expect(screen.getByText(/OAB/)).toBeInTheDocument();
			expect(screen.getByText(/11.1111\/11/)).toBeInTheDocument();
		});
		it("should render 'Advogada' as volunteer type", () => {
			setup({
				...defaultProps,
				supportType: "legal",
				volunteer: {
					...defaultProps.volunteer,
					occupation: "lawyer",
				},
			} as SupportRequestData);
			expect(screen.getByText(/Advogada/)).toBeInTheDocument();
		});
		it("should copy correct information when clicking on copy btn", async () => {
			setup({
				...defaultProps,
				supportType: "legal",
				volunteer: {
					...defaultProps.volunteer,
					occupation: "lawyer",
				},
			} as SupportRequestData);
			const { click } = userEvent.setup();

			const copyBtn = screen.getByRole("button", { name: /copiar dados/i });
			await click(copyBtn);
			const copiedText = await window.navigator.clipboard.readText();
			expect(copiedText).toEqual(
				"Advogada\nNome: Joana Nascimento\nE-mail: joana.nascimento@gmail.com\nWhatsApp: https://wa.me/5592988426606\nOAB: 11.1111/11"
			);
		});
	});
});
