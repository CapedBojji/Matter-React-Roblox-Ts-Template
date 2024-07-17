import { Components } from "shared/components";
import { ContextEntity } from "shared/start";
import type { Theme } from "types/theme";

import { useWorld } from "./use-world";

export function useTheme(): Theme | undefined {
	const world = useWorld();
	return world.get(ContextEntity, Components.GuiSettings)?.theme;
}
