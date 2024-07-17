import Iris, { State } from "@rbxts/iris";
import { UserInputService } from "@rbxts/services";

import type Input from "shared/modules/iris/input";

export interface MountProps<T> {
	component: (props?: T, input?: Input) => void;
	key: Enum.KeyCode;
	props?: T;
}

export function mountIris<T>(props: MountProps<T>): void {
	const toggle = State(false);
	UserInputService.InputBegan.Connect(input => {
		if (input.UserInputType !== Enum.UserInputType.Keyboard) return;
		if (input.KeyCode !== props.key) return;
		toggle.set(!toggle.get());
	});
	Iris.Connect(() => {
		if (!toggle.get()) return;
		props.component(props.props);
	});
}
