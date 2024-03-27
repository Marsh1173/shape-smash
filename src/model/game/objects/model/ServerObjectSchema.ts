import { Id } from "../../../utils/Id";
import { GameObjectData } from "./GameObject";

export interface ServerObjectMessage {
  type: "ServerObjectMessage";
  msg: ServerObjectCreateMessage | ServerObjectDestroyMessage;
}

export interface ServerObjectCreateMessage {
  type: "ServerObjectCreateMessage";
  object_data: GameObjectData;
}

export interface ServerObjectDestroyMessage {
  type: "ServerObjectDestroyMessage";
  object_id: Id;
}
