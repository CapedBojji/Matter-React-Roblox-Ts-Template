import { runCLI } from "@rbxts/jest";
import { ReplicatedStorage } from "@rbxts/services";

import { $print } from "rbxts-transform-debug";

const [status, err] = runCLI(
	// eslint-disable-next-line ts/no-non-null-assertion -- we know this will be defined
	ReplicatedStorage.FindFirstChild("Tests")!,
	{
		ci: false,
		expand: true,
		json: true,
		verbose: true,
	},
	// eslint-disable-next-line ts/no-non-null-assertion -- we know this will be defined
	[ReplicatedStorage.FindFirstChild("Tests")!],
).awaitStatus();

if (status === "Rejected") $print("Error running tests", err);
if (status === "Resolved") $print("Tests passed");

while (true) wait(1);
