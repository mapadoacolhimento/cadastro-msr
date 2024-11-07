function getObjectWithoutFalsyValues(
	obj: Record<string, any>
): Record<string, any> {
	return Object.fromEntries(
		Object.entries(obj).filter(([_, value]) => Boolean(value))
	);
}

export default getObjectWithoutFalsyValues;
