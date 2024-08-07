export interface Values {
	email: string;
	firstName: string;
	confirmEmail: string;
	phone: string;
	dateOfBirth: string;
	color: string;
	hasDisability: string;
	acceptsOnlineSupport: string;
	supportType: string[];
	genderIdentity: string;
	genderViolence: string;
	violenceLocation: string;
	externalSupport: string;
	financialNeed: string;
	terms: boolean;
}

export type User = {
	id?: bigint;
	name: string;
	role: string;
	organization_id: bigint;
	email: string;
	phone: string;
	user_fields: {
		condition: string;
		state: string;
		city: string;
		cep?: string;
		address?: string;
		cor: string;
		whatsapp: string;
		latitude: string;
		longitude: string;
	};
};
export type Ticket = {
	ticket: {
		status?: string;
		comment?: {
			body: string;
			public: boolean;
		};
	};
};

export type Tickets = {
	tickets: {
		id: number;
	}[];
};
