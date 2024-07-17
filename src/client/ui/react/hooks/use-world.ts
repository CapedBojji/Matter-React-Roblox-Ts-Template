import type { World } from "@rbxts/matter";
import { useContext } from "@rbxts/react";

import { worldContext } from "../providers/world-provider";

export function useWorld(): World {
	const world = useContext(worldContext);
	if (world === undefined) throw "No world provided.";

	return world;
}
