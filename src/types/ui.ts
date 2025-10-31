import { getSupportRequestData } from "@/lib";
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
	confirmPhone: string;
	dateOfBirth: string;
	color: string;
	hasDisability: string | null;
	acceptsOnlineSupport: string;
	supportType: string[];
	gender: string;
	genderViolence: string;
	violenceOccurredInBrazil: string;
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
	monthlyIncomeRange: number | null;
	employmentStatus: string;
	dependants: string;
	familyProvider: string;
	propertyOwnership: string;
	violenceType: string[];
	violenceTime: string;
	perpetratorGenderId: string;
	violencePerpetrator: string[];
	livesWithPerpetrator: string;
	violenceLocation: string;
}

export type SupportRequestData = Awaited<
	ReturnType<typeof getSupportRequestData>
>;
