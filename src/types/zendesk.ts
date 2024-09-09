export type ZendeskUser = {
	id?: number;
	name: string;
	role: string;
	organization_id: number;
	email: string;
	phone: string;
	user_fields: {
		condition: string;
		state: string;
		city: string;
		cep: string;
		neighborhood: string;
		cor: string | null;
		whatsapp: string;
		date_of_birth: string;
		tipo_de_acolhimento: string;
	};
};

export type ZendeskTicket = {
	id: bigint;
	requester_id: ZendeskUser["id"];
	submitter_id: number;
	assignee_id: number;
	status: string;
	subject: string;
	organization_id: number;
	comment: {
		body: string;
		public: boolean;
	};
	custom_fields: Array<{ id: number; value: string | number }> | null;
};
