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

import StepsController from "./StepsController";
import { Illustration } from "../";
import { type StepChildrenProps } from "./Step";
import { type Values } from "./";

interface MultiStepFormWrapperProps {
	initialValues: Values;
	onSubmit: (values: Values, bag: FormikHelpers<Values>) => Promise<void>;
}

export default function MultiStepFormWrapper({
	children,
	initialValues,
	onSubmit,
}: PropsWithChildren<MultiStepFormWrapperProps>) {
	const [stepIndex, setStepIndex] = useState(0);
	const [snapshot, setSnapshot] = useState(initialValues);
	const childrenSteps = Children.toArray(children);
	const router = useRouter();

	const step = childrenSteps[stepIndex] as ReactElement<StepChildrenProps>;
	const totalSteps = childrenSteps.length;
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
			if (step.props.onSubmit) {
				const submit = await step.props.onSubmit(values, bag);
				if (submit && submit.redirectTo) {
					return router.push(submit.redirectTo);
				}
			}

			if (isLastStep) {
				return onSubmit(values, bag);
			}

			await bag.setTouched({});
			nextStep(values);
		} catch (e) {
			console.log(
				`Something went wrong when submitting the form: ${JSON.stringify(e)}`
			);
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
					</Form>
				)}
			</Formik>
			<Illustration img={step.props.img} />
		</>
	);
}
