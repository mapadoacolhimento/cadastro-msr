import { render, screen, fireEvent } from "@testing-library/react";
import HoverInfo from "../HoverInfo";

describe("<HoverInfo />", async () => {
	const text = "Some info test";

	it("should hide description on idle state", () => {
		render(<HoverInfo title="Hover test" description={text} />);
		expect(screen.getByText(text)).not.toBeVisible();
	});

	it("should show description when hovering", () => {
		render(<HoverInfo title="Hover test" description={text} />);
		fireEvent.mouseEnter(screen.getByText("Hover test"));
		expect(screen.getByText("Some info test")).toBeVisible();
	});

	it("should hide description when not hovering", async () => {
		render(<HoverInfo title="Hover test" description={text} />);
		fireEvent.mouseEnter(screen.getByText("Hover test"));
		const infoTextElement = screen.getByText("Some info test");
		expect(infoTextElement).toBeVisible();

		fireEvent.mouseLeave(screen.getByText("Hover test"));
		expect(infoTextElement).not.toBeVisible();
	});
});
