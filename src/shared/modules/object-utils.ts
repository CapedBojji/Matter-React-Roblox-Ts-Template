import Object from "@rbxts/object-utils";

export function findFirstKeyWithValue<T>(object_: object, value: unknown): T | undefined {
	for (const [key, value_] of Object.entries(object_)) if (value_ === value) return key as T;
	return undefined;
}
