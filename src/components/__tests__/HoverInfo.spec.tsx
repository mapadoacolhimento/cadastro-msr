import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HoverInfo from "../HoverInfo";

test("shows and hides the description", async () => {
	render(<HoverInfo title="Hover test" description="Some info test" />);

	const descriptionElement = screen.queryByText("Some info test");
	expect(descriptionElement).toHaveClass("hidden");

	fireEvent.mouseEnter(screen.getByText("Hover test"));

	await waitFor(() => {
		const visibleDescription = screen.getByText("Some info test");
		expect(visibleDescription).toHaveClass("visible");
	});

	fireEvent.mouseLeave(screen.getByText("Hover test"));

	await waitFor(() => {
		const hiddenDescription = screen.queryByText("Some info test");

		expect(hiddenDescription).toHaveClass("hidden");
	});
});
