import { Id } from "../../../utils/Id";
import { ServerHealthComponentMessage } from "../components/health/server/ServerHealthComponentSchema";
import { GameObjectData } from "./GameObject";

export interface ServerObjectMessage {
  type: "ServerObjectMessage";
  msg: ServerObjectCreateMessage | ServerObjectDestroyMessage | ServerObjectComponentMessage;
}

export interface ServerObjectCreateMessage {
  type: "ServerObjectCreateMessage";
  object_data: GameObjectData;
}

export interface ServerObjectDestroyMessage {
  type: "ServerObjectDestroyMessage";
  object_id: Id;
}

export interface ServerObjectComponentMessage {
  type: "ServerObjectComponentMessage";
  object_id: Id;
  msg: ServerHealthComponentMessage;
}
