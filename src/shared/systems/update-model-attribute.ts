import { RunService } from "@rbxts/services";

import { Components } from "shared/components";
import type { GameSystem } from "types/matter";

const system: GameSystem = (world, _state) => {
	for (const [id, record] of world.queryChanged(Components.Model))
		if (record.new)
			record.new.model.SetAttribute(
				RunService.IsServer() ? "ServerEntityId" : "ClientEntityId",
				id,
			);
};

export = system;
