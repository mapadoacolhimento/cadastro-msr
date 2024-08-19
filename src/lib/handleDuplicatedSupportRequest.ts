import { SupportType } from "@prisma/client";
import { BASE_URL, db } from "./";

export function emailDuplicated(firstName: string) {
	return `Olá, ${firstName}!

Nossa equipe identificou que você solicitou ajuda em nosso site mais de uma vez. No momento do seu primeiro cadastro, nós enviamos uma resposta por email sobre o seu atendimento. Por isso, queremos saber, como podemos te ajudar?

Se você não recebeu o encaminhamento necessário e ainda precisa de apoio, não se preocupe! Por favor, nos escreva relatando o ocorrido para que a nossa equipe saiba como te auxiliar para que seja acolhida.

Aguardamos o seu contato,

Estamos juntas!

Um abraço,
Equipe do Mapa do Acolhimento`;
}

type DuplicatedRequest = {
	firstName: string;
	supportRequestId: number;
	ticketId: number;
	supportType: SupportType;
};

const handleDuplicatedSupportRequest = async (
	supportRequest: DuplicatedRequest
) => {
	await db.supportRequests.update({
		where: {
			supportRequestId: supportRequest.supportRequestId,
		},
		data: {
			status: "duplicated",
		},
	});

	await db.supportRequestStatusHistory.create({
		data: {
			supportRequestId: supportRequest.supportRequestId,
			status: "duplicated",
		},
	});

	const resTicket = await fetch(`${BASE_URL}/zendesk/ticket`, {
		body: JSON.stringify({
			ticketId: supportRequest.ticketId,
			status: "open",
			statusAcolhimento: "solicitação_repetida",
			supportType: supportRequest.supportType,
			comment: {
				body: emailDuplicated(supportRequest.firstName),
				public: true,
			},
		}),
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!resTicket.ok) {
		throw new Error(resTicket.statusText);
	}
};

export default handleDuplicatedSupportRequest;
