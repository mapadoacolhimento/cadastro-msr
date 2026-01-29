import { expect } from "vitest";
import { NextRequest } from "next/server";
import { mockReset } from "vitest-mock-extended";
import mockedMongodb from "@/tests/unit/mongodb";
import { POST } from "../db/upsert-msr-register-data/route";
import {
	monthlyIncomeOptions,
	monthlyIncomeRangeOptions,
	employmentStatusOptions,
	dependantsOptions,
	familyProviderOptions,
	propertyOwnershipOptions,
	violenceTypeOptions,
	violenceTimeOptions,
	perpetratorGenderOptions,
	livesWithPerpetratorOptions,
	violenceLocationOptions,
	legalActionsTakenOptions,
	legalActionDifficultyOptions,
	protectiveFactorsOptions,
	riskFactorsOptions,
	violencePerpetratorOptions,
} from "@/lib/constants";

const mockMsrIncompleteData = {
	gender: "cis_woman",
	dateOfBirth: new Date("1990-10-10").toISOString(),
	genderViolence: "yes",
	externalSupport: ["no"],
	financialNeed: "yes",
	monthlyIncomeRange: null,
	SupportType: ["legal"],
	email: "msr@email.br",
	confirmEmail: "msr@email.br",
	firstName: "Msr",
	phone: "71999999999",
	violenceOccurredInBrazil: "yes",
	violencePerpetrator: ["ex_partner"],
	perpetratorGender: "man",
};

const mockIncompleteMSRRegisterData = {
	id: "6703e81abb2c10af44a38338",
	...mockMsrIncompleteData,
};

const mockMsrData = {
	...mockMsrIncompleteData,
	color: "white",
	hasDisability: "no",
	acceptsOnlineSupport: "yes",
	terms: "yes",
	zipcode: "41950-150",
	neighborhood: "Rio Vermelho",
	city: "SALVADOR",
	state: "BA",
	lat: "-12.971",
	lng: "-38.511",
};

const mockMSRRegisterData = {
	id: "6703e81abb2c10af44a38338",
	...mockMsrData,
};

const mockMsrSocioeconomicData = {
	...mockMsrData,
	monthlyIncome: monthlyIncomeOptions[0].value,
	monthlyIncomeRange: monthlyIncomeRangeOptions[2].value,
	employmentStatus: employmentStatusOptions[0].value,
	dependants: dependantsOptions[1].value,
	familyProvider: familyProviderOptions[0].value,
	propertyOwnership: propertyOwnershipOptions[1].value,
};

const mockMSRRegisterDataWithSocioeconomic = {
	id: "6703e81abb2c10af44a38338",
	...mockMsrSocioeconomicData,
};

const mockMsrViolenceData = {
	...mockMsrSocioeconomicData,
	violenceType: [violenceTypeOptions[0].value],
	violenceTime: violenceTimeOptions[0].value,
	violenceOccurredInBrazil: "yes",
	violencePerpetrator: [violencePerpetratorOptions[0].value],
	perpetratorGender: perpetratorGenderOptions[0].value,
	livesWithPerpetrator: livesWithPerpetratorOptions[0].value,
	violenceLocation: [violenceLocationOptions[0].value],
	legalActionsTaken: [legalActionsTakenOptions[0].value],
	legalActionDifficulty: [legalActionDifficultyOptions[0].value],
	protectiveFactors: [protectiveFactorsOptions[0].value],
	riskFactors: [riskFactorsOptions[0].value],
};

const mockMSRRegisterDataWithViolence = {
	id: "6703e81abb2c10af44a38338",
	...mockMsrViolenceData,
};

describe("POST /upsert-msr-register-data", () => {
	beforeEach(() => {
		mockReset(mockedMongodb);
	});

	it("should create new msrRegisterFormData", async () => {
		mockedMongodb.msrRegisterData.upsert.mockResolvedValueOnce(
			mockIncompleteMSRRegisterData
		);
		const request = new NextRequest(
			new Request("http://localhost:3000/db/upsert-msr-register-data", {
				method: "POST",
				body: JSON.stringify(mockMsrIncompleteData),
			})
		);
		const response = await POST(request);
		expect(mockedMongodb.msrRegisterData.upsert).toHaveBeenCalledTimes(1);
		expect(response.status).toEqual(200);
		expect(await response.json()).toStrictEqual({
			id: mockIncompleteMSRRegisterData.id,
		});
	});

	it("should update new msrRegisterFormData", async () => {
		mockedMongodb.msrRegisterData.upsert.mockResolvedValueOnce(
			mockMSRRegisterData
		);
		const request = new NextRequest(
			new Request("http://localhost:3000/db/upsert-msr-register-data", {
				method: "POST",
				body: JSON.stringify(mockMsrData),
			})
		);
		const response = await POST(request);
		expect(mockedMongodb.msrRegisterData.upsert).toHaveBeenCalledTimes(1);
		expect(response.status).toEqual(200);
		expect(await response.json()).toStrictEqual({
			id: mockMSRRegisterData.id,
		});
	});

	it("returns error when dont have a valid payload", async () => {
		const request = new NextRequest(
			new Request("http://localhost:3000/db/upsert-msr-register-data", {
				method: "POST",
				body: JSON.stringify({}),
			})
		);
		const response = await POST(request);
		expect(response.status).toEqual(400);
		expect(await response.text()).toEqual(
			"Validation error: violencePerpetrator is a required field"
		);
	});

	it("should create msrRegisterFormData with complete socioeconomic data", async () => {
		mockedMongodb.msrRegisterData.upsert.mockResolvedValueOnce(
			mockMSRRegisterDataWithSocioeconomic
		);

		const request = new NextRequest(
			new Request("http://localhost:3000/db/upsert-msr-register-data", {
				method: "POST",
				body: JSON.stringify(mockMsrSocioeconomicData),
			})
		);

		const response = await POST(request);

		expect(mockedMongodb.msrRegisterData.upsert).toHaveBeenCalledTimes(1);
		expect(mockedMongodb.msrRegisterData.upsert).toHaveBeenCalledWith(
			expect.objectContaining({
				update: expect.objectContaining({
					monthlyIncome: monthlyIncomeOptions[0].value,
					monthlyIncomeRange: monthlyIncomeRangeOptions[2].value,
					employmentStatus: employmentStatusOptions[0].value,
					dependants: dependantsOptions[1].value,
					familyProvider: familyProviderOptions[0].value,
					propertyOwnership: propertyOwnershipOptions[1].value,
				}),
			})
		);
		expect(response.status).toEqual(200);
		expect(await response.json()).toStrictEqual({
			id: mockMSRRegisterDataWithSocioeconomic.id,
		});
	});

	it("should accept all valid monthlyIncomeRange values", async () => {
		for (const option of monthlyIncomeRangeOptions) {
			mockReset(mockedMongodb);

			const testData = {
				...mockMsrSocioeconomicData,
				monthlyIncomeRange: option.value,
			};

			const expectedData = {
				id: "6703e81abb2c10af44a38338",
				...testData,
			};

			mockedMongodb.msrRegisterData.upsert.mockResolvedValueOnce(expectedData);

			const request = new NextRequest(
				new Request("http://localhost:3000/db/upsert-msr-register-data", {
					method: "POST",
					body: JSON.stringify(testData),
				})
			);

			const response = await POST(request);

			expect(response.status).toEqual(200);
			expect(mockedMongodb.msrRegisterData.upsert).toHaveBeenCalledWith(
				expect.objectContaining({
					update: expect.objectContaining({
						monthlyIncomeRange: option.value,
					}),
				})
			);
		}
	});

	it("should accept all valid employmentStatus values", async () => {
		for (const option of employmentStatusOptions) {
			mockReset(mockedMongodb);

			const testData = {
				...mockMsrSocioeconomicData,
				employmentStatus: option.value,
			};

			const expectedData = {
				id: "6703e81abb2c10af44a38338",
				...testData,
			};

			mockedMongodb.msrRegisterData.upsert.mockResolvedValueOnce(expectedData);

			const request = new NextRequest(
				new Request("http://localhost:3000/db/upsert-msr-register-data", {
					method: "POST",
					body: JSON.stringify(testData),
				})
			);

			const response = await POST(request);

			expect(response.status).toEqual(200);
			expect(mockedMongodb.msrRegisterData.upsert).toHaveBeenCalledWith(
				expect.objectContaining({
					update: expect.objectContaining({
						employmentStatus: option.value,
					}),
				})
			);
		}
	});

	it("should accept all valid monthlyIncome values", async () => {
		for (const option of monthlyIncomeOptions) {
			mockReset(mockedMongodb);

			const testData = {
				...mockMsrSocioeconomicData,
				monthlyIncome: option.value,
			};

			const expectedData = {
				id: "6703e81abb2c10af44a38338",
				...testData,
			};

			mockedMongodb.msrRegisterData.upsert.mockResolvedValueOnce(expectedData);

			const request = new NextRequest(
				new Request("http://localhost:3000/db/upsert-msr-register-data", {
					method: "POST",
					body: JSON.stringify(testData),
				})
			);

			const response = await POST(request);

			expect(response.status).toEqual(200);
			expect(mockedMongodb.msrRegisterData.upsert).toHaveBeenCalledWith(
				expect.objectContaining({
					update: expect.objectContaining({
						monthlyIncome: option.value,
					}),
				})
			);
		}
	});

	it("should accept yes/no options for dependants, familyProvider, and propertyOwnership", async () => {
		const combinations = [
			{
				dependants: dependantsOptions[0].value,
				familyProvider: familyProviderOptions[0].value,
				propertyOwnership: propertyOwnershipOptions[0].value,
			},
			{
				dependants: dependantsOptions[1].value,
				familyProvider: familyProviderOptions[1].value,
				propertyOwnership: propertyOwnershipOptions[1].value,
			},
			{
				dependants: dependantsOptions[0].value,
				familyProvider: familyProviderOptions[1].value,
				propertyOwnership: propertyOwnershipOptions[0].value,
			},
		];

		for (const combo of combinations) {
			mockReset(mockedMongodb);

			const testData = {
				...mockMsrSocioeconomicData,
				...combo,
			};

			const expectedData = {
				id: "6703e81abb2c10af44a38338",
				...testData,
			};

			mockedMongodb.msrRegisterData.upsert.mockResolvedValueOnce(expectedData);

			const request = new NextRequest(
				new Request("http://localhost:3000/db/upsert-msr-register-data", {
					method: "POST",
					body: JSON.stringify(testData),
				})
			);

			const response = await POST(request);

			expect(response.status).toEqual(200);
			expect(mockedMongodb.msrRegisterData.upsert).toHaveBeenCalledWith(
				expect.objectContaining({
					update: expect.objectContaining(combo),
				})
			);
		}
	});

	it("should accept all valid violenceType values", async () => {
		for (const option of violenceTypeOptions) {
			mockReset(mockedMongodb);

			const testData = {
				...mockMsrViolenceData,
				violenceType: [option.value],
			};

			const expectedData = {
				id: "6703e81abb2c10af44a38338",
				...testData,
			};

			mockedMongodb.msrRegisterData.upsert.mockResolvedValueOnce(expectedData);

			const request = new NextRequest(
				new Request("http://localhost:3000/db/upsert-msr-register-data", {
					method: "POST",
					body: JSON.stringify(testData),
				})
			);

			const response = await POST(request);

			expect(response.status).toEqual(200);
			expect(mockedMongodb.msrRegisterData.upsert).toHaveBeenCalledWith(
				expect.objectContaining({
					update: expect.objectContaining({
						violenceType: [option.value],
					}),
				})
			);
		}
	});

	it("should accept all valid violenceTime values", async () => {
		for (const option of violenceTimeOptions) {
			mockReset(mockedMongodb);

			const testData = {
				...mockMsrViolenceData,
				violenceTime: option.value,
			};

			const expectedData = {
				id: "6703e81abb2c10af44a38338",
				...testData,
			};

			mockedMongodb.msrRegisterData.upsert.mockResolvedValueOnce(expectedData);

			const request = new NextRequest(
				new Request("http://localhost:3000/db/upsert-msr-register-data", {
					method: "POST",
					body: JSON.stringify(testData),
				})
			);

			const response = await POST(request);

			expect(response.status).toEqual(200);
			expect(mockedMongodb.msrRegisterData.upsert).toHaveBeenCalledWith(
				expect.objectContaining({
					update: expect.objectContaining({
						violenceTime: option.value,
					}),
				})
			);
		}
	});

	it("should accept all valid perpetratorGender values", async () => {
		for (const option of perpetratorGenderOptions) {
			mockReset(mockedMongodb);

			const testData = {
				...mockMsrViolenceData,
				perpetratorGender: option.value,
			};

			const expectedData = {
				id: "6703e81abb2c10af44a38338",
				...testData,
			};

			mockedMongodb.msrRegisterData.upsert.mockResolvedValueOnce(expectedData);

			const request = new NextRequest(
				new Request("http://localhost:3000/db/upsert-msr-register-data", {
					method: "POST",
					body: JSON.stringify(testData),
				})
			);

			const response = await POST(request);

			expect(response.status).toEqual(200);
			expect(mockedMongodb.msrRegisterData.upsert).toHaveBeenCalledWith(
				expect.objectContaining({
					update: expect.objectContaining({
						perpetratorGender: option.value,
					}),
				})
			);
		}
	});

	it("should accept all valid livesWithPerpetrator values", async () => {
		for (const option of livesWithPerpetratorOptions) {
			mockReset(mockedMongodb);

			const testData = {
				...mockMsrViolenceData,
				livesWithPerpetrator: option.value,
			};

			const expectedData = {
				id: "6703e81abb2c10af44a38338",
				...testData,
			};

			mockedMongodb.msrRegisterData.upsert.mockResolvedValueOnce(expectedData);

			const request = new NextRequest(
				new Request("http://localhost:3000/db/upsert-msr-register-data", {
					method: "POST",
					body: JSON.stringify(testData),
				})
			);

			const response = await POST(request);

			expect(response.status).toEqual(200);
			expect(mockedMongodb.msrRegisterData.upsert).toHaveBeenCalledWith(
				expect.objectContaining({
					update: expect.objectContaining({
						livesWithPerpetrator: option.value,
					}),
				})
			);
		}
	});

	it("should accept all valid violenceLocation values", async () => {
		for (const option of violenceLocationOptions) {
			mockReset(mockedMongodb);

			const testData = {
				...mockMsrViolenceData,
				violenceLocation: [option.value],
			};

			const expectedData = {
				id: "6703e81abb2c10af44a38338",
				...testData,
			};

			mockedMongodb.msrRegisterData.upsert.mockResolvedValueOnce(expectedData);

			const request = new NextRequest(
				new Request("http://localhost:3000/db/upsert-msr-register-data", {
					method: "POST",
					body: JSON.stringify(testData),
				})
			);

			const response = await POST(request);

			expect(response.status).toEqual(200);
			expect(mockedMongodb.msrRegisterData.upsert).toHaveBeenCalledWith(
				expect.objectContaining({
					update: expect.objectContaining({
						violenceLocation: [option.value],
					}),
				})
			);
		}
	});

	it("should accept all valid legalActionsTaken values", async () => {
		for (const option of legalActionsTakenOptions) {
			mockReset(mockedMongodb);

			const testData = {
				...mockMsrViolenceData,
				legalActionsTaken: [option.value],
			};

			const expectedData = {
				id: "6703e81abb2c10af44a38338",
				...testData,
			};

			mockedMongodb.msrRegisterData.upsert.mockResolvedValueOnce(expectedData);

			const request = new NextRequest(
				new Request("http://localhost:3000/db/upsert-msr-register-data", {
					method: "POST",
					body: JSON.stringify(testData),
				})
			);

			const response = await POST(request);

			expect(response.status).toEqual(200);
			expect(mockedMongodb.msrRegisterData.upsert).toHaveBeenCalledWith(
				expect.objectContaining({
					update: expect.objectContaining({
						legalActionsTaken: [option.value],
					}),
				})
			);
		}
	});

	it("should accept all valid legalActionDifficulty values", async () => {
		for (const option of legalActionDifficultyOptions) {
			mockReset(mockedMongodb);

			const testData = {
				...mockMsrViolenceData,
				legalActionDifficulty: [option.value],
			};

			const expectedData = {
				id: "6703e81abb2c10af44a38338",
				...testData,
			};

			mockedMongodb.msrRegisterData.upsert.mockResolvedValueOnce(expectedData);

			const request = new NextRequest(
				new Request("http://localhost:3000/db/upsert-msr-register-data", {
					method: "POST",
					body: JSON.stringify(testData),
				})
			);

			const response = await POST(request);

			expect(response.status).toEqual(200);
			expect(mockedMongodb.msrRegisterData.upsert).toHaveBeenCalledWith(
				expect.objectContaining({
					update: expect.objectContaining({
						legalActionDifficulty: [option.value],
					}),
				})
			);
		}
	});

	it("should accept all valid protectiveFactors values", async () => {
		for (const option of protectiveFactorsOptions) {
			mockReset(mockedMongodb);

			const testData = {
				...mockMsrViolenceData,
				protectiveFactors: [option.value],
			};

			const expectedData = {
				id: "6703e81abb2c10af44a38338",
				...testData,
			};

			mockedMongodb.msrRegisterData.upsert.mockResolvedValueOnce(expectedData);

			const request = new NextRequest(
				new Request("http://localhost:3000/db/upsert-msr-register-data", {
					method: "POST",
					body: JSON.stringify(testData),
				})
			);

			const response = await POST(request);

			expect(response.status).toEqual(200);
			expect(mockedMongodb.msrRegisterData.upsert).toHaveBeenCalledWith(
				expect.objectContaining({
					update: expect.objectContaining({
						protectiveFactors: [option.value],
					}),
				})
			);
		}
	});

	it("should accept all valid riskFactors values", async () => {
		for (const option of riskFactorsOptions) {
			mockReset(mockedMongodb);

			const testData = {
				...mockMsrViolenceData,
				riskFactors: [option.value],
			};

			const expectedData = {
				id: "6703e81abb2c10af44a38338",
				...testData,
			};

			mockedMongodb.msrRegisterData.upsert.mockResolvedValueOnce(expectedData);

			const request = new NextRequest(
				new Request("http://localhost:3000/db/upsert-msr-register-data", {
					method: "POST",
					body: JSON.stringify(testData),
				})
			);

			const response = await POST(request);

			expect(response.status).toEqual(200);
			expect(mockedMongodb.msrRegisterData.upsert).toHaveBeenCalledWith(
				expect.objectContaining({
					update: expect.objectContaining({
						riskFactors: [option.value],
					}),
				})
			);
		}
	});

	it("should create msrRegisterFormData with complete violence history data", async () => {
		mockedMongodb.msrRegisterData.upsert.mockResolvedValueOnce(
			mockMSRRegisterDataWithViolence
		);

		const request = new NextRequest(
			new Request("http://localhost:3000/db/upsert-msr-register-data", {
				method: "POST",
				body: JSON.stringify(mockMsrViolenceData),
			})
		);

		const response = await POST(request);

		expect(mockedMongodb.msrRegisterData.upsert).toHaveBeenCalledTimes(1);
		expect(mockedMongodb.msrRegisterData.upsert).toHaveBeenCalledWith(
			expect.objectContaining({
				update: expect.objectContaining({
					violenceType: mockMsrViolenceData.violenceType,
					violenceTime: mockMsrViolenceData.violenceTime,
					violenceOccurredInBrazil:
						mockMsrViolenceData.violenceOccurredInBrazil,
					perpetratorGender: mockMsrViolenceData.perpetratorGender,
					livesWithPerpetrator: mockMsrViolenceData.livesWithPerpetrator,
					violenceLocation: mockMsrViolenceData.violenceLocation,
					legalActionsTaken: mockMsrViolenceData.legalActionsTaken,
					legalActionDifficulty: mockMsrViolenceData.legalActionDifficulty,
					protectiveFactors: mockMsrViolenceData.protectiveFactors,
					riskFactors: mockMsrViolenceData.riskFactors,
				}),
			})
		);
		expect(response.status).toEqual(200);
		expect(await response.json()).toStrictEqual({
			id: mockMSRRegisterDataWithViolence.id,
		});
	});
});
