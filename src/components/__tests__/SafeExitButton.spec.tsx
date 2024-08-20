import { render, screen, fireEvent } from "@testing-library/react";
import SafeExitButton from "../SafeExitButton";
import { vi } from "vitest";

vi.mock("next/image", () => ({
	__esModule: true,
	default: ({ alt, ...props }: { alt?: string; [key: string]: any }) => (
		<img alt={alt || ""} {...props} />
	),
}));

describe("SafeExitButton", () => {
	it("should render the button with correct text and icon", () => {
		render(<SafeExitButton />);

		const button = screen.getByRole("button", { name: /sair desse site/i });
		expect(button).toBeInTheDocument();

		const icon = screen.getByAltText(/ícone de seta de retorno/i);
		expect(icon).toBeInTheDocument();
	});

	it("should redirect to Google when clicked", () => {
		const originalLocation = window.location;

		const mockLocation = {
			replace: vi.fn(),
		};

		Object.defineProperty(window, "location", {
			writable: true,
			value: mockLocation,
		});

		render(<SafeExitButton />);

		const button = screen.getByRole("button", { name: /sair desse site/i });
		fireEvent.click(button);

		expect(mockLocation.replace).toHaveBeenCalledWith("https://www.google.com");

		window.location = originalLocation;
	});
});
