import { MSRPiiSec, SupportRequests } from "@prisma/client";
import {
	db,
	validateAndUpsertZendeskTicket,
	ZENDESK_DUPLICATED_TICKET_STATUS,
	getZendeskTicket,
} from "./";
import { ZendeskTicket } from "@/types";

export function emailDuplicated(firstName: MSRPiiSec["firstName"]) {
	return `Olá${", " + firstName}!

Nossa equipe identificou que você solicitou ajuda em nosso site mais de uma vez. No momento do seu primeiro cadastro, nós enviamos uma resposta por email sobre o seu atendimento. Por isso, queremos saber, como podemos te ajudar?

Se você não recebeu o encaminhamento necessário e ainda precisa de apoio, não se preocupe! Por favor, nos escreva relatando o ocorrido para que a nossa equipe saiba como te auxiliar para que seja acolhida.

Aguardamos o seu contato,

Estamos juntas!

Um abraço,
Equipe do Mapa do Acolhimento`;
}

const handleDuplicatedSupportRequest = async (
	supportRequest: Pick<
		SupportRequests,
		"supportRequestId" | "zendeskTicketId" | "supportType"
	>,
	msrFirstName: MSRPiiSec["firstName"]
) => {
	const supportRequestUpdated = await db.supportRequests.update({
		where: {
			supportRequestId: supportRequest.supportRequestId,
		},
		data: {
			status: "duplicated",
		},
		select: {
			supportRequestId: true,
		},
	});

	await db.supportRequestStatusHistory.create({
		data: {
			supportRequestId: supportRequest.supportRequestId,
			status: "duplicated",
		},
	});

	const ticket: ZendeskTicket = await getZendeskTicket(
		supportRequest.zendeskTicketId
	);

	if (ticket?.status === "closed") {
		//create ticket
		const newTicket = await validateAndUpsertZendeskTicket({
			ticketId: null,
			status: "open",
			statusAcolhimento: ZENDESK_DUPLICATED_TICKET_STATUS,
			supportType: supportRequest.supportType,
			msrName: msrFirstName,
			comment: {
				html_body: emailDuplicated(msrFirstName),
				public: true,
			},
			subject: ticket.subject,
			msrZendeskUserId: ticket.requester_id,
		});

		if (newTicket?.ticketId) {
			await db.supportRequests.update({
				where: {
					supportRequestId: supportRequest.supportRequestId,
				},
				data: {
					zendeskTicketId: newTicket.ticketId,
				},
				select: {
					supportRequestId: true,
				},
			});
		}
	} else {
		//update ticket
		await validateAndUpsertZendeskTicket({
			ticketId: supportRequest.zendeskTicketId as never,
			status: "open",
			statusAcolhimento: ZENDESK_DUPLICATED_TICKET_STATUS,
			supportType: supportRequest.supportType,
			comment: {
				html_body: emailDuplicated(msrFirstName),
				public: true,
			},
		});
	}

	return supportRequestUpdated;
};

export default handleDuplicatedSupportRequest;
