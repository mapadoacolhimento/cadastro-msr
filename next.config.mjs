"use strict";

/** @type {import('next').NextConfig} */
const nrExternals = require("@newrelic/next/load-externals");

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
