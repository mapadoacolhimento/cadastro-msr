import { useState } from "react";
import * as Yup from "yup";
import { Box, Text } from "@radix-ui/themes";

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

type Status = "error" | "idle" | "loading";

export default function Geolocation() {
	const [cityOptions, setCityOptions] = useState([
		{
			value: "",
			label: "Selecione sua cidade",
		},
	]);
	const [status, setStatus] = useState<Status | null>(null);
	const [error, setError] = useState<string | null>(null);

	async function handleStateChange(state: string) {
		try {
			setStatus("loading");
			const response = await fetch(`/cities?state=${state}`, {
				method: "GET",
			});

			if (!response.ok) {
				throw new Error(response.statusText);
			}

			const cities = await response.json();
			setCityOptions((prevCities) => [...prevCities, ...cities]);
			setStatus("idle");
		} catch (e: unknown) {
			const error = e as Error;
			console.error("Error fetching cities", error.message);
			setError("Erro ao buscar cidades");
			setStatus("error");
		}
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
				options={cityOptions}
				placeholder="Selecione sua cidade"
				isLoading={status === "loading"}
			/>
			{error && status === "error" ? (
				<Text color={"red"} size={"2"}>
					{error}
				</Text>
			) : null}
		</Step>
	);
}
