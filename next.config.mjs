/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "X-Frame-Options",
						value: "SAMEORIGIN",
					},
					{
						key: "Referrer-Policy",
						value: "same-origin",
					},
					{
						key: "Permissions-Policy",
						value: "microphone=(), geolocation=(), camera=()",
					},
				],
			},
		];
	},
};

export default nextConfig;
