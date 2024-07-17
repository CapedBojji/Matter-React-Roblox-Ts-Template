import type { Entity, System, World } from "@rbxts/matter";

export type GameSystem = System<[World, Map<string, unknown>, Entity<[]>]>;
export type Middleware = (nextFunc: () => void, event: string) => () => void;
