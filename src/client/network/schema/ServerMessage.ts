import { Vector } from "@dimforge/rapier2d-compat";
import { ClientGameData } from "../../../model/game/system/client/ClientGameSystem";
import { Id } from "../../../model/utils/Id";
import { ShapeletAction } from "../../../model/game/objects/shapelet/ShapeletController";
import { ClientPlayerData } from "../../../model/game/system/client/ClientPlayer";
import { ServerShapeletMessage } from "../../../model/game/objects/shapelet/server/ServerShapeletSchema";

export type ServerMessage = GameDataMessage | ServerGameMessage;

export interface GameDataMessage {
  type: "GameDataMessage";
  data: ClientGameData;
}

export interface ServerGameMessage {
  type: "ServerGameMessage";
  msg: ServerShapeletMessage | UserJoinMessage | UserLeaveMessage;
}

export interface UserJoinMessage {
  type: "UserJoinMessage";
  player_data: ClientPlayerData;
}

export interface UserLeaveMessage {
  type: "UserLeaveMessage";
  id: Id;
}
