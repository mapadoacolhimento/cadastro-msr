import { formatPhoneNumber } from "../../src/utils";

export default function generateTestPhone() {
	// gera um DDD entre 11 e 99
	const ddd = Math.floor(Math.random() * 89 + 11);

	// garante celular (9xxxx-xxxx)
	const prefix = 9;
	const number1 = Math.floor(1000 + Math.random() * 9000); // 4 dígitos
	const number2 = Math.floor(1000 + Math.random() * 9000); // 4 dígitos

	// retorna cru (sem máscara) para o input aplicar a máscara
	return formatPhoneNumber(`${ddd}${prefix}${number1}${number2}`);
}
