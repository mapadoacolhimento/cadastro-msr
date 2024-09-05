import { useState } from "react";
import * as Yup from "yup";
import { Box, Text } from "@radix-ui/themes";
import { type FormikHelpers, useFormikContext } from "formik";
import { MSRs, SupportRequests } from "@prisma/client";

import Step from "../Step";
import { TextInput, SelectInput } from "@/components";
import { BRAZILIAN_STATES_OPTIONS } from "@/constants";
import { Status, type Values } from "@/types";
import { formatZipcode, normalizeCity } from "@/utils";

const geolocationSchema = Yup.object({
	city: Yup.string().transform(normalizeCity).required("Insira sua cidade"),
	state: Yup.string().length(2).uppercase().required("Insira seu estado"),
	neighborhood: Yup.string().required("Insira seu bairro"),
	lat: Yup.number().max(90).min(-90).required().nullable(),
	lng: Yup.number().max(180).min(-180).required().nullable(),
	zipcode: Yup.string()
		.transform(formatZipcode)
		.required("Insira seu CEP")
		.length(8, "CEP inválido"),
});

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
			setFieldValue("city", "", false);
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
			`/geolocation?zipcode=${formatZipcode(zipcode)}`,
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
			<Box pt={"3"}>
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
				<Text color={"red"} size={"2"} role={"alert"}>
					{error}
				</Text>
			) : null}
		</>
	);
}

export default function Geolocation() {
	async function handleGeolocationSubmit(
		values: Values,
		{ setFieldValue }: FormikHelpers<Values>
	) {
		if (values.lat && values.lng) return;

		const response = await fetch(
			`/geolocation?state=${values.state}&city=${values.city}&neighborhood=${values.neighborhood}`,
			{
				method: "GET",
			}
		);

		if (!response.ok) {
			setFieldValue("lat", null, false);
			setFieldValue("lng", null, false);
			return null;
		}

		const geolocation = (await response.json()) as GeolocationResponseData;

		setFieldValue("lat", geolocation.lat, false);
		setFieldValue("lng", geolocation.lng, false);
	}

	return (
		<Step
			onSubmit={handleGeolocationSubmit}
			validationSchema={geolocationSchema}
			title={"Seu endereço"}
			img={{
				src: "/illustrations/woman-floating.webp",
				alt: "Ilustração com uma mulher flutuando.",
			}}
		>
			<GeolocationFields />
		</Step>
	);
}
