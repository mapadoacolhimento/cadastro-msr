import { Field } from "formik";
import * as Yup from "yup";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import MultiStepFormWrapper from "../MultiStepFormWrapper";
import Step from "../Step";
import { ErrorMessage } from "@/components";
import { sleep } from "@/utils";
import { type Values } from "@/types";

const img = {
	src: "https://picsum.photos/seed/picsum/200/300",
	alt: "test img",
};

const setup = () => {
	return render(
		<MultiStepFormWrapper
			initialValues={
				{
					email: "",
					acceptsOnlineSupport: "",
				} as Values
			}
			onSubmit={async (values: Values) =>
				sleep(300).then(() => console.log("Wizard submit", values))
			}
		>
			<Step
				onSubmit={() => sleep(300).then(() => console.log("Step1 onSubmit"))}
				validationSchema={Yup.object({
					email: Yup.string().email().required(),
				})}
				title={"Seus dados"}
				img={img}
			>
				<label htmlFor="email">
					E-mail
					<Field name="email" type="email" id="email" />
				</label>
				<ErrorMessage name="email" />
			</Step>
			<Step
				onSubmit={() => sleep(300).then(() => console.log("Step2 onSubmit"))}
				validationSchema={Yup.object({
					supportType: Yup.array()
						.of(Yup.string().oneOf(["psychological", "legal"]))
						.min(1, "Esse campo é obrigatório."),
				})}
				title={"Sobre o acolhimento"}
				img={img}
			>
				<fieldset>
					<label htmlFor="psicologico">
						<Field
							type="checkbox"
							name="supportType"
							value="psychological"
							id="psicologico"
						/>
						Acolhimento psicológico
					</label>
					<label htmlFor="juridico">
						<Field
							type="checkbox"
							name="supportType"
							value="legal"
							id="juridico"
						/>
						Acolhimento jurídico
					</label>
					<ErrorMessage name="supportType" />
				</fieldset>
			</Step>
		</MultiStepFormWrapper>
	);
};

describe("<MultiStepFormWrapper />", () => {
	test("go back btn should be disabled on first step", () => {
		setup();
		expect(
			screen.getByRole("button", {
				name: /Voltar para o passo anterior/i,
			})
		).toBeDisabled();
	});

	it("should not go to next step if field is invalid", async () => {
		setup();

		const btn = screen.getByRole("button", { name: /continuar/i });
		await userEvent.click(btn);

		expect(screen.getByRole("alert")).toBeInTheDocument();
		expect(
			screen.queryByRole("heading", {
				name: /sobre o acolhimento/i,
				level: 1,
			})
		).not.toBeInTheDocument();
		expect(
			screen.getByRole("heading", { name: /seus dados/i, level: 1 })
		).toBeInTheDocument();
	});

	test("go to next step if first step is valid", async () => {
		setup();

		const emailInput = screen.getByRole("textbox", {
			name: /E-mail/i,
		});
		await userEvent.type(emailInput, "test@email.com");

		const btn = screen.getByRole("button", { name: /continuar/i });
		await userEvent.click(btn);

		expect(
			await screen.findByRole("heading", {
				name: /sobre o acolhimento/i,
				level: 1,
			})
		).toBeInTheDocument();
		expect(
			screen.queryByRole("heading", { name: /seus dados/i, level: 1 })
		).not.toBeInTheDocument();
	});

	test("go back to previous step successfully", async () => {
		setup();

		const emailInput = screen.getByRole("textbox", {
			name: /E-mail/i,
		});
		await userEvent.type(emailInput, "test@email.com");

		const btn = screen.getByRole("button", { name: /continuar/i });
		await userEvent.click(btn);

		await screen.findByRole("heading", {
			name: /sobre o acolhimento/i,
			level: 1,
		});

		const goBackBtn = screen.getByRole("button", {
			name: /voltar para o passo anterior/i,
		});
		await userEvent.click(goBackBtn);

		expect(
			await screen.findByRole("heading", {
				name: /seus dados/i,
				level: 1,
			})
		).toBeInTheDocument();
		expect(emailInput).toHaveValue("test@email.com");
		expect(
			screen.queryByRole("heading", {
				name: /sobre o acolhimento/i,
				level: 1,
			})
		).not.toBeInTheDocument();
	});
});
