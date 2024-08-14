import { NextRequest } from "next/server";
import { POST } from "../zendesk/user/route";
import {
	ZENDESK_SUBDOMAIN,
	ZENDESK_API_TOKEN,
	ZENDESK_API_USER,
} from "../../lib";

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
	supportTypes: ["legal", "psychological"],
};

const mockPayloadUpdate = {
	...mockPayload,
	supportTypes: ["legal"],
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
		tipo_de_acolhimento: "psicológico_e_jurídico",
	},
};

const mockUserUpdate = {
	...mockUser,
	user_fields: {
		...mockUser.user_fields,
		tipo_de_acolhimento: "jurídico",
	},
};

const endpoint = `${ZENDESK_SUBDOMAIN}/api/v2/users/create_or_update`;
const authorization =
	"Basic " +
	Buffer.from(`${ZENDESK_API_USER}:${ZENDESK_API_TOKEN}`).toString("base64");

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

	it("should create new zendesk user with both support type ", async () => {
		fetch.mockResolvedValueOnce(
			Response.json({
				user: {
					id: 12345666 as unknown as bigint,
				},
			})
		);
		const request = new NextRequest(
			new Request("http://localhost:3000/zendesk/user", {
				method: "POST",
				body: JSON.stringify(mockPayload),
			})
		);
		const response = await POST(request);

		expect(fetch).toHaveBeenCalledWith(endpoint, {
			body: JSON.stringify({ user: mockUser }),
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: authorization,
			},
		});
		expect(response.status).toEqual(200);
		expect(await response.json()).toStrictEqual({ msrZendeskUserId: 12345666 });
	});

	it("should update zendesk user with support type legal", async () => {
		fetch.mockResolvedValueOnce(
			Response.json({
				data: {
					user: {
						id: 12345666 as unknown as bigint,
					},
				},
			})
		);
		const request = new NextRequest(
			new Request("http://localhost:3000/zendesk/user", {
				method: "POST",
				body: JSON.stringify(mockPayloadUpdate),
			})
		);
		const response = await POST(request);

		expect(fetch).toHaveBeenCalledWith(endpoint, {
			body: JSON.stringify({ user: mockUserUpdate }),
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: authorization,
			},
		});
		expect(response.status).toEqual(200);
		expect(await response.json()).toStrictEqual({ msrZendeskUserId: 12345666 });
	});

	it("should return a error when zendesk api does not create a user", async () => {
		fetch.mockRejectedValueOnce(new Error("Could not create a new user"));
		const request = new NextRequest(
			new Request("http://localhost:3000/zendesk/user", {
				method: "POST",
				body: JSON.stringify(mockPayload),
			})
		);
		const response = await POST(request);
		expect(response.status).toEqual(500);
		expect(await response.text()).toStrictEqual("Could not create a new user");
	});
});
