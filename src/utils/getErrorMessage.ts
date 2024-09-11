import { Prisma } from "@prisma/client";

type ErrorWithMessage = {
	message: string;
};

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
	return (
		typeof error === "object" &&
		error !== null &&
		"message" in error &&
		typeof (error as Record<string, unknown>)["message"] === "string"
	);
}

function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
	try {
		if (maybeError instanceof Prisma.PrismaClientKnownRequestError) {
			const target = maybeError.meta?.["target"] as string[];
			return new Error(
				`Prisma returned an error code (${
					maybeError.code
				}) on these fields, '${target.join(",")}', with this message: ${
					maybeError.message
				}`
			);
		}

		if (isErrorWithMessage(maybeError)) return maybeError;
		return new Error(JSON.stringify(maybeError, null, 2));
	} catch {
		// fallback in case there's an error stringifying the maybeError
		// like with circular references for example.
		return new Error(String(maybeError));
	}
}

export default function getErrorMessage(error: unknown) {
	return toErrorWithMessage(error).message;
}
