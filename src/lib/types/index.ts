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
	};
};

export const dicio: {
	360014379412: "status_acolhimento";
	360016631592: "nome_voluntaria";
	360016681971: "nome_msr";
	360017432652: "data_encaminhamento";
	360021665652: "status_inscricao";
	360021812712: "telefone";
	360021879791: "estado";
	360021879811: "cidade";
	360032229831: "atrelado_ao_ticket";
} = {
	360014379412: "status_acolhimento",
	360016631592: "nome_voluntaria",
	360016681971: "nome_msr",
	360017432652: "data_encaminhamento",
	360021665652: "status_inscricao",
	360021812712: "telefone",
	360021879791: "estado",
	360021879811: "cidade",
	360032229831: "atrelado_ao_ticket",
};

export type Ticket = {
	id?: number;
	requester_id?: number;
	submitter_id?: number;
	assignee_id?: number;
	status?: string;
	subject?: string;
	description?: string;
	organization_id?: number;
	tag?: string[];
	comment?: {
		body: string;
		public: boolean;
	};
	custom_fields?: Array<{ id: number; value: string | number }>;
};

export type TicketUpdate = {
	ticket: Ticket;
};

export type TicketsUpdate = {
	tickets: {
		id: number;
	}[];
};
