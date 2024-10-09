"use strict";

/** @type {import('next').NextConfig} */
import nrExternals from "newrelic/load-externals.js";
import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin";

const nextConfig = {
	reactStrictMode: true,
	experimental: {
		serverComponentsExternalPackages: ["newrelic"],
	},
	webpack: (config, { isServer }) => {
		nrExternals(config);
		if (isServer) {
			config.plugins = [...config.plugins, new PrismaPlugin()]
		}
		return config;
	},
};

export default nextConfig;
