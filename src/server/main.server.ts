import { Cmdr } from "@rbxts/cmdr";
import { ReplicatedStorage, RunService } from "@rbxts/services";

import { GameEvent } from "config/enums/matter";
import { start } from "shared/start";
import Tree from "shared/third_party/tree";

// eslint-disable-next-line ts/no-non-null-assertion -- The parent is always defined
const parent = script.Parent!;

// Set up cmdr
Cmdr.RegisterDefaultCommands();
Cmdr.RegisterCommandsIn(Tree.Find(parent, "cmdr/commands") as Folder);
Cmdr.RegisterTypesIn(Tree.Find(parent, "cmdr/types") as Folder);
Cmdr.RegisterCommandsIn(Tree.Find(ReplicatedStorage, "TS/cmdr/commands") as Folder);
Cmdr.RegisterTypesIn(Tree.Find(ReplicatedStorage, "TS/cmdr/types") as Folder);

const events = {
	[GameEvent.Physics]: RunService.PreSimulation,
	[GameEvent.Render]: RunService.PreRender,
	[GameEvent.Update]: RunService.PostSimulation,
};

start(
	[
		Tree.Await(parent, "systems") as Folder,
		Tree.Await(ReplicatedStorage, "TS/systems") as Folder,
	],
	events,
);
