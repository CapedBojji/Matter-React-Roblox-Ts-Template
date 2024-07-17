import Iris from "@rbxts/iris";

import type Input from "shared/modules/iris/input";

export = async function (parent: GuiObject) {
	const input = (await import("shared/modules/iris/input")) as Input;
	input.SinkFrame.Parent = parent;

	Iris.Internal._utility.UserInputService = input;
	Iris.UpdateGlobalConfig({
		UseScreenGUIs: false,
	});
	Iris.Init(parent);
	Iris.Connect(() => {
		Iris.ShowDemoWindow();
	});
	return () => {
		Iris.Shutdown();
		for (const connection of input._connections) connection.Disconnect();
		input.SinkFrame.Destroy();
	};
};
