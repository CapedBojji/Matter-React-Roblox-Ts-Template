import { Players } from "@rbxts/services";

export const { LocalPlayer } = Players;

export const USER_ID = tostring(LocalPlayer.UserId);
export const USER_NAME = LocalPlayer.Name;

export const PLAYER_GUI = LocalPlayer.WaitForChild("PlayerGui") as PlayerGui;
