import "@radix-ui/themes/styles.css";
import type { PropsWithChildren } from "react";
import type { Metadata } from "next";
import { nunitoSans, idealista } from "@/fonts";
import Providers from "./providers";
import BaseLayout from "@/components/BaseLayout";

export const metadata: Metadata = {
	title: "Quero ser acolhida - Mapa do Acolhimento",
	description:
		"Somos uma plataforma que conecta mulheres que sofreram violência a uma rede de psicólogas e advogadas dispostas a ajudá-las de forma voluntária. Clique aqui para acessar a nossa rede de apoio!",
};

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<html
			lang="pt-BR"
			className={`${nunitoSans.className} ${idealista.variable}`}
		>
			<body>
				<Providers>
					<BaseLayout>{children}</BaseLayout>
				</Providers>
			</body>
		</html>
	);
}
