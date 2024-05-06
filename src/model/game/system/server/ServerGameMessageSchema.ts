import { ServerShapeletMessage } from "../../objects/objects/shapelet/server/ServerShapeletSchema";
import { ServerObjectMessage } from "../../objects/model/ServerObjectSchema";
import {
  ServerGameUserMessage,
  UserStateUpdateMessage,
} from "./user/ServerGameUserSchema";
import { GameData } from "../GameSystem";
import { Id } from "../../../utils/Id";

export interface GameDataMessage {
  type: "GameDataMessage";
  data: ClientGameData;
}

export interface ClientGameData extends GameData {
  user_id: Id;
  player_state: UserStateUpdateMessage;
}

export interface ServerGameMessage {
  type: "ServerGameMessage";
  msg: ServerShapeletMessage | ServerObjectMessage | ServerGameUserMessage;
}
