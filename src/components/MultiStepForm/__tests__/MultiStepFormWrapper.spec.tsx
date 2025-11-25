import { Field } from "formik";
import * as Yup from "yup";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import MultiStepFormWrapper from "../MultiStepFormWrapper";
import Step from "../Step";
import { ErrorMessage } from "@/components";
import { sleep } from "@/utils";
import { type Values } from "@/types";
import exp from "constants";

const img = {
	src: "https://picsum.photos/seed/picsum/200/300",
	alt: "test img",
};

const setup = (skipSteps?: number) => {
	return render(
		<MultiStepFormWrapper
			initialValues={
				{
					email: "",
					acceptsOnlineSupport: "",
					monthlyIncome: "",
					monthlyIncomeRange: null,
					terms: false,
				} as Values
			}
			onSubmit={async (values: Values) => {
				if (skipSteps) return { skipSteps };
				sleep(300).then(() => console.log("Wizard submit", values));
			}}
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
			<Step
				onSubmit={() => {
					if (skipSteps) return { skipSteps: 2 };
					sleep(300).then(() => console.log("Step3 onSubmit"));
				}}
				validationSchema={Yup.object({
					monthlyIncome: Yup.string().oneOf(["no", "clt", "pj"]).required(),
				})}
				title={"Qual sua forma de renda mensal?"}
				img={img}
			>
				{" "}
				<fieldset>
					<label htmlFor="no">
						<Field name="monthlyIncome" type="radio" id="no" value="no" />
						Nao tenho renda
					</label>

					<label htmlFor="clt">
						<Field name="monthlyIncome" type="radio" id="clt" value="clt" />
						Sou CLT
					</label>

					<label htmlFor="pj">
						Sou PJ
						<Field name="monthlyIncome" type="radio" id="pj" value="pj" />
					</label>
				</fieldset>
				<ErrorMessage name="monthlyIncome" />
			</Step>
			<Step
				onSubmit={() => sleep(300).then(() => console.log("Step4 onSubmit"))}
				validationSchema={Yup.object({
					monthlyIncomeRange: Yup.number().required(),
				})}
				title={"Qual a faixa da sua renda mensal?"}
				img={img}
			>
				<fieldset>
					<label htmlFor="range1">
						<Field
							name="monthlyIncomeRange"
							type="radio"
							id="range1"
							value="1"
						/>
						1 a 3 salários mínimos
					</label>

					<label htmlFor="range2">
						<Field
							name="monthlyIncomeRange"
							type="radio"
							id="range2"
							value="2"
						/>
						4 a 6 salários mínimos
					</label>

					<label htmlFor="range3">
						Mais de 6 salários mínimos
						<Field
							name="monthlyIncomeRange"
							type="radio"
							id="range3"
							value="3"
						/>
					</label>
				</fieldset>
				<ErrorMessage name="monthlyIncomeRange" />
			</Step>
			<Step
				onSubmit={() => sleep(300).then(() => console.log("Step5 onSubmit"))}
				validationSchema={Yup.object({
					terms: Yup.boolean()
						.oneOf([true], "Você deve aceitar os termos para continuar.")
						.required("Você deve aceitar os termos para continuar."),
				})}
				title={"Termos e condições"}
				img={img}
			>
				<label htmlFor="terms">
					<Field type="checkbox" name="terms" id="terms" />
					Eu aceito os termos e condições
				</label>
				<ErrorMessage name="terms" />
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

	test("should skip steps when skipSteps is provided", async () => {
		setup(1);

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
		const supportCheckbox = screen.getByRole("checkbox", {
			name: /Acolhimento psicológico/i,
		});
		await userEvent.click(supportCheckbox);
		await userEvent.click(btn);

		expect(
			await screen.findByRole("heading", {
				name: /Qual sua forma de renda mensal\?/i,
				level: 1,
			})
		).toBeInTheDocument();

		const no = await screen.findByRole("radio", {
			name: /Nao tenho renda/i,
		});
		expect(no).toBeInTheDocument();
		await userEvent.click(no);
		const btn2 = screen.getByRole("button", { name: /continuar/i });
		expect(btn2).toBeInTheDocument();
		await userEvent.click(btn2);

		expect(
			screen.getByRole("heading", {
				name: /Termos e condições/i,
				level: 1,
			})
		).toBeInTheDocument();

		const goBackBtn = screen.getByRole("button", {
			name: /voltar para o passo anterior/i,
		});
		await userEvent.click(goBackBtn);

		expect(
			await screen.findByRole("heading", {
				name: /Qual sua forma de renda mensal\?/i,
				level: 1,
			})
		).toBeInTheDocument();
	});

	test("when go back should skip the step that was skiped before", async () => {
		setup(1);

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
		const supportCheckbox = screen.getByRole("checkbox", {
			name: /Acolhimento psicológico/i,
		});
		await userEvent.click(supportCheckbox);
		await userEvent.click(btn);

		expect(
			await screen.findByRole("heading", {
				name: /Qual sua forma de renda mensal\?/i,
				level: 1,
			})
		).toBeInTheDocument();

		const no = await screen.findByRole("radio", {
			name: /Nao tenho renda/i,
		});
		expect(no).toBeInTheDocument();
		await userEvent.click(no);
		const btn2 = screen.getByRole("button", { name: /continuar/i });
		expect(btn2).toBeInTheDocument();
		await userEvent.click(btn2);

		expect(
			screen.getByRole("heading", {
				name: /Termos e condições/i,
				level: 1,
			})
		).toBeInTheDocument();

		const goBackBtn = screen.getByRole("button", {
			name: /voltar para o passo anterior/i,
		});
		await userEvent.click(goBackBtn);

		expect(
			await screen.findByRole("heading", {
				name: /Qual sua forma de renda mensal\?/i,
				level: 1,
			})
		).toBeInTheDocument();
	});

	test("should not skip steps when skipSteps is not  provided", async () => {
		setup(0);

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
		const supportCheckbox = screen.getByRole("checkbox", {
			name: /Acolhimento psicológico/i,
		});
		await userEvent.click(supportCheckbox);
		await userEvent.click(btn);

		expect(
			await screen.findByRole("heading", {
				name: /Qual sua forma de renda mensal\?/i,
				level: 1,
			})
		).toBeInTheDocument();

		const no = await screen.findByRole("radio", {
			name: /Nao tenho renda/i,
		});

		await userEvent.click(no);
		const btn2 = screen.getByRole("button", { name: /continuar/i });
		await userEvent.click(btn2);

		expect(
			screen.getByRole("heading", {
				name: /Qual a faixa da sua renda mensal\?/i,
				level: 1,
			})
		).toBeInTheDocument();
	});
});
