const getVolunteerType = (supportType: string) =>
	supportType === "psychological" ? "psicóloga" : "advogada";

export default getVolunteerType;
