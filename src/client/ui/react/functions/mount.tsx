import type { Element, FunctionComponent } from "@rbxts/react";
import React, { StrictMode } from "@rbxts/react";
import { createPortal } from "@rbxts/react-roblox";

import { PLAYER_GUI } from "client/constants";
import { GameWorld } from "shared/start";

import type { RemProviderProps } from "../providers/rem-provider";
import { RemProvider } from "../providers/rem-provider";
import { UniqueKeyProvider } from "../providers/unique-key-provider";
import { WorldProvider } from "../providers/world-provider";
import { createUniqueKey } from "./create-unique-key";

interface MountProps extends RemProviderProps {
	/** The key for the UI component. */
	key: string;
}

/**
 * Mounts the UI component to the Roblox game client.
 *
 * @returns The root object representing the mounted UI component.
 */
export function mountReact(): LuaTuple<[Instance, FunctionComponent<MountProps>]> {
	const root = new Instance("Folder");
	const wrapper = function ({ baseRem, key, remOverride, children }: MountProps): Element {
		return (
			<StrictMode>
				<RemProvider key="rem-provider" baseRem={baseRem} remOverride={remOverride}>
					<UniqueKeyProvider generator={createUniqueKey()}>
						<WorldProvider world={GameWorld}>
							{createPortal(children, PLAYER_GUI, key)}
						</WorldProvider>
					</UniqueKeyProvider>
				</RemProvider>
			</StrictMode>
		);
	};

	return $tuple(root, wrapper);
}
