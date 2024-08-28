import {
	type PropsWithChildren,
	ReactElement,
	useState,
	Children,
} from "react";
import { useRouter } from "next/navigation";
import { type FormikHelpers, Form, Formik } from "formik";
import { Box, Flex, Heading, IconButton } from "@radix-ui/themes";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

import { StepsController, Illustration } from "@/components";
import { LoadingStep, ErrorStep } from "./Steps";
import {
	type HandleRequestResponse,
	Status,
	type StepChildrenProps,
	type Values,
} from "@/types";

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

			if (step.props.onSubmit) {
				const submit = await step.props.onSubmit(values, bag);
				if (submit && submit.redirectTo) {
					return router.push(submit.redirectTo);
				}
			}

			if (isLastStep) {
				setStatus(Status.loading);

				const data = await onSubmit(values);

				setStatus(Status.idle);
				const shouldRedirectToSuccessPage = Object.values(data).find(
					(support) => support !== "duplicated"
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
			console.error(error);
			setStatus(Status.error);
		}
	};

	return (
		<>
			<Formik
				initialValues={snapshot}
				onSubmit={handleSubmit}
				validationSchema={step.props.validationSchema}
			>
				{({ isSubmitting, values }) => (
					<Form>
						<Box px={"5"}>
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

						{status === Status.idle ? (
							<>
								<Box px={"5"}>
									<Box asChild pt={"4"}>
										<Heading
											as={"h1"}
											size={"8"}
											color={"purple"}
											highContrast
											align={"center"}
										>
											{step.props.title}
										</Heading>
									</Box>

									<Flex
										direction={"column"}
										align={"center"}
										justify={"center"}
										gapY={"4"}
									>
										{step}
									</Flex>
								</Box>
								<StepsController
									stepName={step.props.title}
									stepNumber={stepNumber}
									isButtonDisabled={isSubmitting}
									progress={progress}
									isLastStep={isLastStep}
								/>
							</>
						) : null}

						{status === Status.loading ? <LoadingStep /> : null}
						{status === Status.error ? (
							<ErrorStep message={"Ocorreu um erro durante a submissão"} />
						) : null}
					</Form>
				)}
			</Formik>
			<Illustration img={step.props.img} />
		</>
	);
}
