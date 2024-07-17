import { CmdrClient } from "@rbxts/cmdr";
import Iris from "@rbxts/iris";
import { Signal } from "@rbxts/lemon-signal";
import type { Context } from "@rbxts/rewire";
import { ReplicatedStorage, RunService } from "@rbxts/services";

import matterReact, { reloadGui } from "client/functions/matter-react";
import { createUniqueKey, mountReact } from "client/ui/react/functions";
import { reactConfig } from "client/ui/react/react-config";
import { GameEvent } from "config/enums/matter";
import { start } from "shared/start";
import Tree from "shared/third_party/tree";

const events = {
	[GameEvent.Physics]: RunService.PreSimulation,
	[GameEvent.Render]: RunService.PreRender,
	[GameEvent.Update]: RunService.PostSimulation,
};
const uniqueGenerator = createUniqueKey();
const [root, wrapper] = mountReact();
const middleware = matterReact(root, wrapper, {
	key: uniqueGenerator("Root"),
});
const reactRootFolder = Tree.Await(ReplicatedStorage, "Client/ui/react") as Folder;
const reactReloadSignal = new Signal<[ModuleScript, Context]>();

CmdrClient.SetActivationKeys([Enum.KeyCode.Home]);
reactConfig();
start(
	[
		Tree.Await(ReplicatedStorage, "Client/systems") as Folder,
		Tree.Await(ReplicatedStorage, "TS/systems") as Folder,
	],
	events,
	[middleware],
	[
		{
			folder: reactRootFolder,
			onLoadedSignal: reactReloadSignal,
			onUnloadedSignal: reactReloadSignal,
		},
	],
);

// Start iris
Iris.Init();
// mountIris({ components: [], key: Enum.KeyCode.PageDown });

// Connect the signal to reload the React GUI
reactReloadSignal.Connect(() => {
	reloadGui();
});
