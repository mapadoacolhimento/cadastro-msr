"use strict";

/** @type {import('next').NextConfig} */
import nrExternals from "newrelic/load-externals.js";

const nextConfig = {
	reactStrictMode: true,
	experimental: {
		serverComponentsExternalPackages: ["newrelic"],
	},
	webpack: (config) => {
		nrExternals(config);
		return config;
	},
};

export default nextConfig;
