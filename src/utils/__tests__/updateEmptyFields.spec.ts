import updateEmptyFields from "../updateEmptyFields";

const currentValues = {
	email: "msr@email.br",
	firstName: "Msr",
	confirmEmail: "msr@email.br",
	phone: "",
	dateOfBirth: "",
	color: "",
	hasDisability: "",
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
	hasDisability: "no",
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

describe("updateEmptyFields", () => {
	it("should return the new values ​​maintaining the values ​​of the gender, support type fields", () => {
		const result = updateEmptyFields(currentValues, loadValues);
		//console.log(result, newValues)
		expect(result).toStrictEqual(newValues);
	});
});
