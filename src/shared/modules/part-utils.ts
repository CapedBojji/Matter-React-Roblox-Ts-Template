// IMPORTANT: This assumes the model is not rotated
export function getTopCenterOfPart(part: BasePart): Vector3 {
	const size = part.Size;
	const position = part.Position;
	return position.add(new Vector3(0, size.Y / 2, 0));
}

export function getTopCenterOfModel(model: Model): CFrame {
	const boundingBox = model.GetBoundingBox();
	const [position, size] = boundingBox;
	return position.add(new Vector3(0, size.Y / 2, 0));
}
