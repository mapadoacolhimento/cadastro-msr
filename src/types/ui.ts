import { type FormikHelpers } from "formik";
import { type AnyObjectSchema } from "yup";
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

export enum Status {
	error,
	idle,
	loading,
}

export interface Values {
	email: string;
	firstName: string;
	confirmEmail: string;
	phone: string;
	dateOfBirth: string;
	color: string;
	hasDisability: string;
	acceptsOnlineSupport: string;
	supportType: string[];
	gender: string;
	genderViolence: string;
	violenceLocation: string;
	externalSupport: string;
	financialNeed: string;
	terms: boolean;
	zipcode: string;
	neighborhood: string;
	city: string;
	state: string;
	lat: number | null;
	lng: number | null;
}
