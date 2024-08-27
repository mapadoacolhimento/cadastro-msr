import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: `${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 1,
		},
		{
			url: `${process.env.VERCEL_PROJECT_PRODUCTION_URL}/cadastro`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			url: `${process.env.VERCEL_PROJECT_PRODUCTION_URL}/cadastro-finalizado`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.5,
		},
		{
			url: `${process.env.VERCEL_PROJECT_PRODUCTION_URL}/fora-criterios`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.5,
		},
		{
			url: `${process.env.VERCEL_PROJECT_PRODUCTION_URL}/acolhimento-andamento`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.5,
		},
	];
}
