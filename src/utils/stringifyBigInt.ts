export default function stringfyBigInt(obj: Record<string, unknown>) {
	try {
		return Object.keys(obj).reduce((previousValue, currentKey) => {
			let currentObjValue = obj[currentKey];

			if (typeof currentObjValue === "bigint") {
				currentObjValue = currentObjValue.toString();
			}

			return {
				...previousValue,
				[currentKey]: currentObjValue,
			};
		}, {});
	} catch {
		return obj;
	}
}
