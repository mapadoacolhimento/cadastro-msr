import "@radix-ui/themes/styles.css";
import "@/theme/colors/purple.css";
import "@/theme/colors/yellow.css";
import "@/theme/colors/pink.css";
import "@/theme/colors/gray.css";
import "@/theme/index.css";

import type { PropsWithChildren } from "react";
import type { Metadata } from "next";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import newrelic from "newrelic";
import { nunitoSans, idealista } from "@/fonts";
import Providers from "./providers";
import BaseLayout from "@/components/BaseLayout";
import { GOOGLE_ANALYTICS_ID } from "@/constants";

export const metadata: Metadata = {
	title: "Quero ser acolhida - Mapa do Acolhimento",
	description:
		"Somos uma plataforma que conecta mulheres que sofreram violência a uma rede de psicólogas e advogadas dispostas a ajudá-las de forma voluntária. Clique aqui para acessar a nossa rede de apoio!",
};

export default async function RootLayout({
	children,
}: Readonly<PropsWithChildren>) {
	// @ts-expect-error
	if (newrelic.agent.collector.isConnected() === false) {
		await new Promise((resolve) => {
			// @ts-expect-error

			newrelic.agent.on("connected", resolve);
		});
	}

	const browserTimingHeader = newrelic.getBrowserTimingHeader({
		hasToRemoveScriptWrapper: true,
		// @ts-expect-error
		allowTransactionlessInjection: true,
	});

	return (
		<html
			lang="pt-BR"
			className={`${nunitoSans.className} ${idealista.variable}`}
		>
			<Script
				id="nr-browser-agent"
				dangerouslySetInnerHTML={{ __html: browserTimingHeader }}
				strategy="lazyOnload"
			/>
			<body>
				<Providers>
					<BaseLayout>{children}</BaseLayout>
				</Providers>
			</body>
			<GoogleAnalytics gaId={GOOGLE_ANALYTICS_ID} />
		</html>
	);
}
