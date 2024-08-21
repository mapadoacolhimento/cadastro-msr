export type ZendeskUser = {
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
		neighborhood: string;
		cor: string | null;
		whatsapp: string;
		date_of_birth: string | null;
		tipo_de_acolhimento: string;
	};
};

export type ZendeskTicket = {
	id?: number;
	requester_id?: number;
	submitter_id?: number;
	assignee_id?: number;
	status?: string;
	subject?: string;
	organization_id?: bigint;
	comment?: {
		body: string;
		public: boolean;
	};
	custom_fields?: Array<{ id: number; value: string | number }> | null;
};
