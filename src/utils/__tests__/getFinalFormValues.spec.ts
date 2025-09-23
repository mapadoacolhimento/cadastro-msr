import getFinalFormValues from "../getFinalFormValues";

const currentValues = {
	email: "msr@email.br",
	firstName: "Msr",
	confirmEmail: "msr@email.br",
	phone: "",
	dateOfBirth: "",
	color: "",
	acceptsOnlineSupport: "yes",
	supportType: ["legal", "psychological"],
	gender: "trans_woman",
	genderViolence: "",
	violenceLocation: "yes",
	externalSupport: "no",
	financialNeed: "yes",
	terms: false,
	city: "",
	state: "",
	neighborhood: "",
	lat: null,
	lng: null,
	zipcode: "",
};

const loadValues = {
	gender: "cis_woman",
	dateOfBirth: new Date("1990-10-10").toISOString(),
	genderViolence: "yes",
	violenceLocation: "yes",
	externalSupport: "no",
	financialNeed: "yes",
	supportType: ["legal"],
	email: "msr@email.br",
	confirmEmail: "msr@email.br",
	firstName: "Msr Antgo",
	phone: "71999999999",
	color: "white",
	acceptsOnlineSupport: "yes",
	terms: false,
	zipcode: "41950-150",
	neighborhood: "Rio Vermelho",
	city: "SALVADOR",
	state: "BA",
	lat: -12.971,
	lng: -38.511,
};

const newValues = {
	...loadValues,
	gender: currentValues.gender,
	supportType: currentValues.supportType,
	firstName: currentValues.firstName,
};

describe("getFinalFormValues", () => {
	it("should return the new values ​​maintaining the values ​​of the gender, support type fields", () => {
		const result = getFinalFormValues(currentValues, loadValues);
		expect(result).toStrictEqual(newValues);
	});
	it("should not overwrite non-empty fields in currentValues with empty fields from loadValues", () => {
		const current = {
			firstName: "Joana",
			dateOfBirth: new Date("1990-10-10").toISOString(),
			email: "joana@example.com",
		};
		const load = {
			firstName: "",
			dateOfBirth: null,
			email: "",
		};
		const expected = {
			firstName: "Joana",
			dateOfBirth: new Date("1990-10-10").toISOString(),
			email: "joana@example.com",
		};
		const result = getFinalFormValues(current, load);
		expect(result).toStrictEqual(expected);
	});

	it("should overwrite empty fields in currentValues with non-empty fields from loadValues", () => {
		const current = {
			firstName: "",
			phone: null,
			color: "",
		};
		const load = {
			firstName: "Msr Antgo",
			phone: "71999999999",
			color: "white",
		};
		const expected = {
			firstName: "Msr Antgo",
			phone: "71999999999",
			color: "white",
		};
		const result = getFinalFormValues(current, load);
		expect(result).toStrictEqual(expected);
	});

	it("should handle arrays correctly", () => {
		const current = {
			supportType: [],
		};
		const load = {
			supportType: ["legal", "psychological"],
		};
		const expected = {
			supportType: ["legal", "psychological"],
		};
		const result = getFinalFormValues(current, load);
		expect(result).toStrictEqual(expected);
	});
});
