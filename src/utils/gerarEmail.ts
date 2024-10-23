import crypto from "crypto";

export default function gerarEmail() {
	const domains = ["@teste.com", "@email.com", "@teste.com.br"];
	const name = "msr_" + crypto.randomBytes(4).toString("hex");
	const randomBytes = crypto.randomBytes(4);
	const email = name + domains[randomBytes.readUInt32BE(0) % domains.length];
	return email;
}
