function getObjectWithoutFalsyValues(
	obj: Record<string, any>
): Record<string, any> {
	return Object.fromEntries(
		Object.entries(obj).filter(
			([_, value]) =>
				value !== null && value !== undefined && value !== "" && value !== false
		)
	);
}

export default getObjectWithoutFalsyValues;
