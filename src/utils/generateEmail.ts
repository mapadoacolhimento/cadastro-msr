export default function gerarEmail() {
	const dominios = ["@teste.com", "@email.com", "@teste.com.br"];
	const random = Math.random();
	const name = "msr_" + random.toString(36).substring(7);
	const email = name + dominios[Math.floor(Math.random() * dominios.length)];
	return email;
}
