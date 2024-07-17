import { component } from "@rbxts/matter";

import type { Theme } from "types/theme";

// eslint-disable-next-line ts/no-extraneous-class -- This is a placeholder class
export class Components {
	public static readonly GuiSettings = component<{ theme: Theme }>("GuiSettings");
	public static readonly Model = component<{ model: Model }>("Model");
}
