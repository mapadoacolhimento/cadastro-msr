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
		mockcreateOrUpdateUser.mockResolvedValue({
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

		expect(mockcreateOrUpdateUser).toHaveBeenCalled();
		expect(response.status).toEqual(200);
		expect(await response.json()).toStrictEqual({ msrZendeskUserId: 12345666 });
	});

	it("should update zendesk user with payload", async () => {
		mockcreateOrUpdateUser.mockResolvedValue({
			data: {
				user: {
					id: 12345666 as unknown as bigint,
				},
			},
		});
		const request = new NextRequest(
			new Request("http://localhost:3000/zendesk/user", {
				method: "POST",
				body: JSON.stringify(mockPayload),
			})
		);
		const response = await POST(request);

		expect(mockcreateOrUpdateUser).toHaveBeenCalled();
		expect(response.status).toEqual(200);
		expect(await response.json()).toStrictEqual({ msrZendeskUserId: 12345666 });
	});
});
