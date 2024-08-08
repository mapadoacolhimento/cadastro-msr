import { NextRequest } from "next/server";
import { POST } from "../zendesk/user/route";
import * as createOrUpdateUser from "../../lib/zendesk/createOrUpdateUser";

const mockcreateOrUpdateUser = vi.spyOn(createOrUpdateUser, "default");
const mockPayload = {
	email: "lua@email.com",
	phone: "71999999999",
	firstName: "Lua",
	city: "SALVADOR",
	state: "BA",
	neighborhood: "Federação",
	color: "black",
	zipcode: "40210245",
	dateOfBirth: new Date("1990-03-14"),
	supportTypes: ["legal"],
};

const mockPayloadUpdate = {
	email: "sol@email.com",
	phone: "19999999999",
	firstName: "Sol",
	city: "CAMPINAS",
	state: "SP",
	neighborhood: "Vila Santal Isabel",
	description: "-",
	color: "white",
	zipcode: "13084609",
	dateOfBirth: new Date("1999-04-14"),
	supportTypes: ["legal", "psychological"],
};

const mockUser = {
	name: mockPayload.firstName,
	role: "end-user",
	organization_id: 360273031591 as unknown as bigint,
	email: mockPayload.email,
	phone: mockPayload.phone,
	user_fields: {
		condition: "inscrita",
		state: mockPayload.state,
		city: mockPayload.city,
		cep: mockPayload.zipcode,
		neighborhood: mockPayload.neighborhood,
		cor: "preta",
		whatsapp: mockPayload.phone,
		date_of_birth: mockPayload.dateOfBirth.toISOString(),
		tipo_de_acolhimento: "jurídico",
	},
};

const mockUserUpdate = {
	name: mockPayloadUpdate.firstName,
	role: "end-user",
	organization_id: 360273031591 as unknown as bigint,
	email: mockPayloadUpdate.email,
	phone: mockPayloadUpdate.phone,
	user_fields: {
		condition: "inscrita",
		state: mockPayloadUpdate.state,
		city: mockPayloadUpdate.city,
		cep: mockPayloadUpdate.zipcode,
		neighborhood: mockPayloadUpdate.neighborhood,
		cor: "branca",
		whatsapp: mockPayloadUpdate.phone,
		date_of_birth: mockPayloadUpdate.dateOfBirth.toISOString(),
		tipo_de_acolhimento: "psicológico_e_jurídico",
	},
};

describe("POST /zendesk/user", () => {
	it("returns error when dont have a valid payload", async () => {
		const request = new NextRequest(
			new Request("http://localhost:3000/zendesk/user", {
				method: "POST",
				body: JSON.stringify({}),
			})
		);
		const response = await POST(request);
		expect(response.status).toEqual(400);
		expect(await response.text()).toEqual(
			"Validation error: supportTypes is a required field"
		);
	});

	it("should create new zendesk user with payload", async () => {
		mockcreateOrUpdateUser.mockResolvedValueOnce({
			user: {
				id: 12345666 as unknown as bigint,
			},
		});
		const request = new NextRequest(
			new Request("http://localhost:3000/zendesk/user", {
				method: "POST",
				body: JSON.stringify(mockPayload),
			})
		);
		const response = await POST(request);

		expect(mockcreateOrUpdateUser).toHaveBeenCalledWith(mockUser);
		expect(response.status).toEqual(200);
		expect(await response.json()).toStrictEqual({ msrZendeskUserId: 12345666 });
	});

	it("should update zendesk user with payload", async () => {
		mockcreateOrUpdateUser.mockResolvedValueOnce({
			data: {
				user: {
					id: 12345667 as unknown as bigint,
				},
			},
		});
		const request = new NextRequest(
			new Request("http://localhost:3000/zendesk/user", {
				method: "POST",
				body: JSON.stringify(mockPayloadUpdate),
			})
		);
		const response = await POST(request);

		expect(mockcreateOrUpdateUser).toHaveBeenCalledWith(mockUserUpdate);
		expect(response.status).toEqual(200);
		expect(await response.json()).toStrictEqual({ msrZendeskUserId: 12345667 });
	});
});
