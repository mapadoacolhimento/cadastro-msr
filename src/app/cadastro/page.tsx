import MultiStepForm from "@/components/MultiStepForm";
import { db, logger } from "@/lib";
import { getErrorMessage } from "@/utils";

async function getFeatureFlags() {
	try {
		const flags = await db.featureFlag.findMany();
		return flags;
	} catch (e) {
		const error = e as Record<string, unknown>;

		if (error["name"] === "ValidationError") {
			const errorMsg = `Validation error: ${getErrorMessage(error)}`;

			logger.error(`[feature-flag] - 400: ${errorMsg}`);

			return [];
		}

		const errorMsg = getErrorMessage(error);
		logger.error(`[feature-flag] - 500: ${errorMsg}`);
		return [];
	}
}

export default async function Page() {
	const flags = await getFeatureFlags();

	return <MultiStepForm featureFlags={flags} />;
}
