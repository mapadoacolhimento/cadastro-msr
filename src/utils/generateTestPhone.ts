import crypto from "crypto";
import { formatPhoneNumber } from "../../src/utils";

export default function generateTestPhone() {
	const randomBytes = crypto.randomBytes(6);
	// gera DDD entre 11 e 99
	const ddd = 11 + (randomBytes[0] % 89);
	// garante celular (9xxxx-xxxx)
	const prefix = 9;
	// gera dois blocos de 4 dígitos cada
	const number1 = (1000 + (randomBytes.readUInt16BE(1) % 9000))
		.toString()
		.padStart(4, "0");
	const number2 = (1000 + (randomBytes.readUInt16BE(3) % 9000))
		.toString()
		.padStart(4, "0");

	return formatPhoneNumber(`${ddd}${prefix}${number1}${number2}`);
}
