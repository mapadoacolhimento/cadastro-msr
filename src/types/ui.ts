import { Volunteers } from "@prisma/client";
import { Responsive } from "@radix-ui/themes/props";
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
		align?: Responsive<"center" | "start" | "end" | "baseline" | "stretch">;
		bottom?: string;
		hideMobile?: boolean;
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
	externalSupport: string[];
	financialNeed: string;
	terms: boolean;
	zipcode: string;
	neighborhood: string;
	city: string;
	state: string;
	lat: number | null;
	lng: number | null;
	monthlyIncome: string;
	monthlyIncomeRange: number;
	employmentStatus: string;
	dependants: string;
	familyProvider: string;
	propertyOwnership: string;
	violenceType: string[];
}

export type VolunteerMatch = Pick<
	Volunteers,
	| "firstName"
	| "lastName"
	| "occupation"
	| "city"
	| "state"
	| "email"
	| "phone"
	| "registrationNumber"
	| "id"
>;
