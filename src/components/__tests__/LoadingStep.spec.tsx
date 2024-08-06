import { render, screen } from "@testing-library/react";
import LoadingStep from "../LoadingStep";

const setup = () => {
	return render(<LoadingStep />);
};

describe("<LoadingStep />", () => {
	it("should render headers and descriptions", () => {
		setup();

		const heading1 = screen.getByRole("heading", {
			name: "Agora é só esperar",
			level: 1,
		});
		expect(heading1).toBeInTheDocument();

		const description1 = screen.getByText(
			"Nesse momento estamos analisando seus dados e em breve buscaremos uma voluntária para te atender"
		);
		expect(description1).toBeInTheDocument();
	});
});
