import {
	type PropsWithChildren,
	ReactElement,
	useState,
	Children,
} from "react";
import { useRouter } from "next/navigation";
import { type FormikHelpers, Form, Formik } from "formik";
import { Box, Flex, IconButton } from "@radix-ui/themes";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

import { StepsController, Illustration, MainTitle } from "@/components";
import { TransitoryStep } from "./Steps";
import {
	type HandleRequestResponse,
	Status,
	type StepChildrenProps,
	type Values,
} from "@/types";
import { logger } from "@/lib";

interface MultiStepFormWrapperProps {
	initialValues: Values;
	onSubmit: (values: Values) => Promise<HandleRequestResponse>;
}

export default function MultiStepFormWrapper({
	children,
	initialValues,
	onSubmit,
}: PropsWithChildren<MultiStepFormWrapperProps>) {
	const [stepIndex, setStepIndex] = useState(0);
	const [snapshot, setSnapshot] = useState(initialValues);
	const [status, setStatus] = useState<Status | null>(Status.idle);
	const childrenSteps = Children.toArray(children);
	const router = useRouter();

	const step = childrenSteps[stepIndex] as ReactElement<StepChildrenProps>;
	const totalSteps = Children.count(children);
	const isLastStep = stepIndex === totalSteps - 1;
	const stepNumber = Math.min(stepIndex + 1, totalSteps);
	const progress = (100 * stepNumber) / totalSteps;

	const nextStep = (values: Values) => {
		setSnapshot(values);
		setStepIndex(Math.min(stepIndex + 1, totalSteps - 1));
	};

	const previousStep = (values: Values) => {
		setSnapshot(values);
		setStepIndex(Math.max(stepIndex - 1, 0));
	};

	const handleSubmit = async (values: Values, bag: FormikHelpers<Values>) => {
		try {
			setStatus(Status.idle);

			if (values.email) {
				await fetch("/db/upsert-msr-register-data", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(values),
				});
			}

			if (step.props.onSubmit) {
				const submit = await step.props.onSubmit(values, bag);
				if (submit && submit.redirectTo) {
					return router.push(submit.redirectTo);
				}
			}

			if (isLastStep) {
				setStatus(Status.loading);

				const data = await onSubmit(values);

				const shouldRedirectToSuccessPage = Object.values(data).find(
					(support) => support?.status !== "duplicated"
				);
				if (!shouldRedirectToSuccessPage) {
					return router.push("/acolhimento-andamento");
				}

				return router.push("/cadastro-finalizado");
			}

			await bag.setTouched({});
			setStatus(Status.idle);
			nextStep(values);
		} catch (error: any) {
			logger.error(error);
			window.newrelic.noticeError(
				Error("Something went wrong when submitting the form")
			);
			setStatus(Status.error);
		}
	};

	if (status === Status.loading) {
		return <TransitoryStep.Loading />;
	}

	if (status === Status.error) {
		return (
			<TransitoryStep.Error
				errorMsg={"Ocorreu um erro durante o envio do formulário"}
			/>
		);
	}

	return status === Status.idle ? (
		<>
			<Formik
				initialValues={snapshot}
				onSubmit={handleSubmit}
				validationSchema={step.props.validationSchema}
			>
				{({ isSubmitting, values }) => (
					<Form style={{ width: "100%" }}>
						<Box asChild position={"absolute"} left={"6"}>
							<IconButton
								onClick={() => previousStep(values)}
								variant="ghost"
								disabled={stepIndex === 0}
								type={"button"}
							>
								<ChevronLeftIcon width="24" height="24" />
								<VisuallyHidden.Root>
									Voltar para o passo anterior
								</VisuallyHidden.Root>
							</IconButton>
						</Box>

						<>
							<MainTitle pt={"5"}>{step.props.title}</MainTitle>

							<Flex
								direction={"column"}
								align={"center"}
								justify={"center"}
								gapY={"4"}
							>
								{step}
							</Flex>
							<StepsController
								stepName={step.props.title}
								stepNumber={stepNumber}
								isButtonDisabled={isSubmitting}
								progress={progress}
								isLastStep={isLastStep}
							/>
						</>
					</Form>
				)}
			</Formik>
			<Illustration
				img={step.props.img}
				align={step.props.img.align}
				bottom={step.props.img.bottom}
			/>
		</>
	) : null;
}
