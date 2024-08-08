import * as Yup from "yup";
import { Box } from "@radix-ui/themes";

import Step from "../Step";
import TextInput from "../../TextInput";
import SelectInput from "../../SelectInput";
import {
	BRAZILIAN_STATES_OPTIONS,
	formatZipcode,
	normalizeCity,
	sleep,
} from "../../../lib";

const geolocationSchema = Yup.object({
	city: Yup.string().transform(normalizeCity).required("Insira sua cidade"),
	state: Yup.string().length(2).uppercase().required("Insira seu estado"),
	neighborhood: Yup.string().required("Insira seu bairro"),
	lat: Yup.number().max(90).min(-90).required(),
	lng: Yup.number().max(180).min(-180).required(),
	zipcode: Yup.string()
		.transform(formatZipcode)
		.required("Insira seu CEP")
		.length(8, "CEP inválido"),
});

const CITY_OPTIONS = [
	{
		value: "SAO PAULO",
		label: "SÃO PAULO",
	},
];

export default function Geolocation() {
	async function handleStateChange(optionValue: string) {
		console.log("State changed to", optionValue);
	}

	return (
		<Step
			onSubmit={() =>
				sleep(1).then(() => console.log("Step geolocation onSubmit"))
			}
			validationSchema={geolocationSchema}
			title={"Seu endereço"}
			img={{
				src: "/illustrations/woman-floating.svg",
				alt: "Ilustração com uma mulher flutuando.",
			}}
		>
			<Box pt={{ initial: "7", sm: "8" }} width={"100%"} maxWidth={"22rem"}>
				<TextInput
					mask="99999-999"
					name="zipcode"
					label="CEP"
					placeholder="Insira seu CEP"
				/>
			</Box>
			<TextInput
				name="neighborhood"
				label="Bairro"
				placeholder="Insira seu bairro"
			/>
			<SelectInput
				name="state"
				label="Estado"
				options={BRAZILIAN_STATES_OPTIONS}
				placeholder="Selecione seu estado"
				onChange={handleStateChange}
			/>
			<SelectInput
				name="city"
				label="Cidade"
				options={CITY_OPTIONS}
				placeholder="Selecione sua cidade"
			/>
		</Step>
	);
}
