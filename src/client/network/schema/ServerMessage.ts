import { Vector } from "@dimforge/rapier2d-compat";
import { ClientGameData } from "../../../model/game/system/ClientGameSystem";
import { Id } from "../../../model/utils/Id";
import { ShapeletAction } from "../../../model/game/objects/shapelet/ShapeletController";
import { ClientPlayerData } from "../../../model/game/objects/player/ClientPlayer";

export type ServerMessage = GameDataMessage | ServerGameMessage;

export interface GameDataMessage {
  type: "GameDataMessage";
  data: ClientGameData;
}

export interface ServerGameMessage {
  type: "ServerGameMessage";
  msg: UserMoveMessage | UserJoinMessage | UserLeaveMessage;
}

export interface UserMoveMessage {
  type: "UserMoveMessage";
  id: Id;
  active: boolean;
  action: ShapeletAction;
  pos: Vector;
  vel: Vector;
}

export interface UserJoinMessage {
  type: "UserJoinMessage";
  player_data: ClientPlayerData;
}

export interface UserLeaveMessage {
  type: "UserLeaveMessage";
  id: Id;
}
