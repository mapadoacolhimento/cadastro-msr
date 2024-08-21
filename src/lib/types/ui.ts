import { type FormikHelpers } from "formik";
import { type AnyObjectSchema } from "yup";
import { Values } from "../../components/MultiStepForm";

export interface StepChildrenProps {
	onSubmit: (
		values: Values,
		bag: FormikHelpers<Values>
	) => Promise<{
		redirectTo: string;
	} | null | void>;
	validationSchema: AnyObjectSchema;
	title: string;
	img: {
		src: string;
		alt: string;
	};
}

export enum Status {
	error,
	idle,
	loading,
}
