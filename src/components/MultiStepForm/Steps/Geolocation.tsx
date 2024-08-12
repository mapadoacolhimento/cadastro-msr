import { useState } from "react";
import * as Yup from "yup";
import { Box, Text } from "@radix-ui/themes";
import { useFormikContext } from "formik";
import { MSRs, SupportRequests } from "@prisma/client";

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

enum Status {
	error,
	idle,
	loading,
}

type CityOption = {
	value: string;
	label: string;
};

type GeolocationResponseData = Pick<MSRs, "city" | "state" | "neighborhood"> &
	Pick<SupportRequests, "lat" | "lng">;

const defaultCityOptions: CityOption[] = [
	{
		value: "",
		label: "Selecione sua cidade",
	},
];

function GeolocationFields() {
	const [cityOptions, setCityOptions] =
		useState<CityOption[]>(defaultCityOptions);
	const [status, setStatus] = useState<Status | null>(Status.idle);
	const [error, setError] = useState<string | null>(null);
	const { setFieldValue } = useFormikContext();

	async function handleStateChange(state: string) {
		try {
			setStatus(Status.loading);
			setCityOptions([
				{
					value: "",
					label: "Carregando cidades...",
				},
			]);
			const response = await fetch(`/cities?state=${state}`, {
				method: "GET",
			});

			if (!response.ok) {
				throw new Error(response.statusText);
			}

			const cities = await response.json();
			setCityOptions([...defaultCityOptions, ...cities]);
			setStatus(Status.idle);
		} catch (e) {
			setCityOptions(defaultCityOptions);
			setError("Erro ao buscar cidades");
			setStatus(Status.error);
		}
	}

	async function autofillGeolocation(zipcode: string) {
		setStatus(Status.loading);

		const response = await fetch(
			`/geolocation?zipcode=${zipcode.replace("-", "")}`,
			{
				method: "GET",
			}
		);

		if (!response.ok) {
			setStatus(Status.idle);
			return;
		}

		const geolocation = (await response.json()) as GeolocationResponseData;
		setStatus(Status.idle);

		for (const [key, value] of Object.entries(geolocation)) {
			if (!value) return;

			if (key === "city") {
				const city = normalizeCity(value.toString());
				setFieldValue(key, city);
				setCityOptions([
					{
						value: city,
						label: value.toString(),
					},
				]);
			} else {
				setFieldValue(key, value);
			}
		}
	}

	return (
		<>
			<Box pt={{ initial: "7", sm: "8" }} width={"100%"} maxWidth={"22rem"}>
				<TextInput
					mask="99999-999"
					name="zipcode"
					label="CEP"
					placeholder="Insira seu CEP"
					onBlur={autofillGeolocation}
					isLoading={status === Status.loading}
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
				placeholder={"Selecione sua cidade"}
				isLoading={status === Status.loading}
			/>
			{error && status === Status.error ? (
				<Text
					color={"red"}
					size={"2"}
					role={"alert"}
					as={"p"}
					style={{ paddingTop: "var(--space-1)", backgroundColor: "white" }}
				>
					{error}
				</Text>
			) : null}
		</>
	);
}

export default function Geolocation() {
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
			<GeolocationFields />
		</Step>
	);
}
