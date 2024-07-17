import type { World } from "@rbxts/matter";
import type { Element, PropsWithChildren, Provider } from "@rbxts/react";
import React, { createContext } from "@rbxts/react";

export const worldContext = createContext<World | undefined>(undefined);

export function WorldProvider({
	world,
	children,
}: PropsWithChildren<{ world: World }>): Element<Provider<World>> {
	return <worldContext.Provider value={world}>{children}</worldContext.Provider>;
}
