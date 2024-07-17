import type { InstanceTree } from "@rbxts/validate-tree";
import { validateTree } from "@rbxts/validate-tree";

const characterTree: InstanceTree = {
	$className: "Model",
	RootPart: {
		$className: "Part",
	},
};
export function validateCharacter(character: Model, tree: InstanceTree = characterTree): boolean {
	return validateTree(character, tree);
}

export function vector3TopDown(vector: Vector3): Vector2 {
	return new Vector2(vector.X, vector.Z);
}
