import { type PropsWithChildren } from "react";
import { type FormikHelpers } from "formik";
import { type AnyObjectSchema } from "yup";
import { type Values } from "./";

export interface StepChildrenProps {
	onSubmit?: (
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

export default function Step({
	children,
}: PropsWithChildren<StepChildrenProps>) {
	return children;
}
