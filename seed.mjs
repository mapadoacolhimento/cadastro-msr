import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	const city = await prisma.cities.create({
		data: {
			city_value: "SAO PAULO",
			city_label: "SÃO PAULO",
			state: "SP",
			ibge_code: 123,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		},
	});

	const featureFlags = await prisma.featureFlag.createMany({
		data: [
			{
				featureName: "TRIAGE_ECONOMIC_QUESTIONS",
				featureEnabled: true,
			},
		],
	});

	console.log({
		city,
		featureFlags,
	});
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})

	.catch(async (e) => {
		console.error(e);

		await prisma.$disconnect();

		process.exit(1);
	});
