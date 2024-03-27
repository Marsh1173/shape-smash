import { ServerShapeletMessage } from "../../objects/shapelet/server/ServerShapeletSchema";
import { ClientGameData } from "../client/ClientGameSystem";
import { ServerObjectMessage } from "../../objects/model/ServerObjectSchema";

export interface GameDataMessage {
  type: "GameDataMessage";
  data: ClientGameData;
}

export interface ServerGameMessage {
  type: "ServerGameMessage";
  msg: ServerShapeletMessage | UserJoinMessage | UserLeaveMessage | ServerObjectMessage;
}

export interface UserJoinMessage {
  type: "UserJoinMessage";
}

export interface UserLeaveMessage {
  type: "UserLeaveMessage";
}
