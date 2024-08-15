import { render, screen, fireEvent } from "@testing-library/react";
import SafeExitButton from "../SafeExitButton";
import { vi } from "vitest";

describe("SafeExitButton", () => {
	it("should render the button with correct text and icon", () => {
		render(<SafeExitButton />);

		const button = screen.getByRole("button", { name: /sair desse site/i });
		expect(button).toBeInTheDocument();

		const icon = screen.getByAltText(/ícone de seta de retorno/i);
		expect(icon).toBeInTheDocument();
	});

	it("should redirect to Google when clicked", () => {
		const mockOpen = vi.spyOn(window, "open").mockImplementation(() => {});

		render(<SafeExitButton />);

		const button = screen.getByRole("button", { name: /sair desse site/i });
		fireEvent.click(button);

		expect(mockOpen).toHaveBeenCalledWith(
			"https://www.google.com",
			"_self",
			"noopener,noreferrer"
		);

		mockOpen.mockRestore();
	});
});
