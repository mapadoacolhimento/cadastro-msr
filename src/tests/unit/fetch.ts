export default function createFetchResponse(data: unknown, ok = true) {
	return {
		ok,
		json: () => new Promise((resolve) => setTimeout(() => resolve(data), 500)),
	};
}
