import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
		},
		sitemap: `${process.env.VERCEL_PROJECT_PRODUCTION_URL}/sitemap.xml`,
	};
}
