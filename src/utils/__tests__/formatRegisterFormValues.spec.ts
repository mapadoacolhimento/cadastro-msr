import { expect } from "vitest";
import formatRegisterFormValues from "@/utils/formatRegisterFormValues";
import { Values } from "@/types";

describe("formatRegisterFormValues", () => {
	it("should format register form values correctly", () => {
		const values = {
			hasDisability: "yes",
			acceptsOnlineSupport: "no",
			email: "JohnDoe@example.com",
			firstName: "john",
			neighborhood: "example neighborhood",
			dateOfBirth: "31/12/1995",
			zipcode: "12345-678",
			phone: "(11) 99456-7890",
			city: "example city",
		} as Values;

		const expected = {
			hasDisability: true,
			acceptsOnlineSupport: false,
			email: "johndoe@example.com",
			firstName: "John",
			neighborhood: "Example neighborhood",
			dateOfBirth: "1995-12-31T00:00:00.000Z",
			zipcode: "12345678",
			phone: "11994567890",
			city: "EXAMPLE CITY",
		};

		const result = formatRegisterFormValues(values);

		expect(JSON.parse(result)).toStrictEqual(expected);
	});
});
