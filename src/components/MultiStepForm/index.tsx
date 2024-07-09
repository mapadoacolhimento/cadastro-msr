import MultiStepFormWrapper from "./MultiStepFormWrapper";
import {
	BasicRegisterInformation,
	DiversityInformation,
	AcceptsOnlineSupport,
	SupportType,
} from "./Steps";
import { sleep } from "../../utils";

export interface Values {
	email: string;
	name: string;
	confirmEmail: string;
	phone: string;
	dateOfBirth: string;
	color: string;
	disabilityStatus: string;
	acceptsOnlineSupport: string;
	supportType: string[];
}

export default function MultiStepForm() {
	return (
		<MultiStepFormWrapper
			initialValues={{
				email: "",
				name: "",
				confirmEmail: "",
				phone: "",
				dateOfBirth: "",
				color: "",
				disabilityStatus: "",
				acceptsOnlineSupport: "",
				supportType: [],
			}}
			onSubmit={async (values: Values) =>
				sleep(300).then(() => console.log("Wizard submit", values))
			}
		>
			{BasicRegisterInformation()}
			{DiversityInformation()}
			{AcceptsOnlineSupport()}
			{SupportType()}
		</MultiStepFormWrapper>
	);
}
