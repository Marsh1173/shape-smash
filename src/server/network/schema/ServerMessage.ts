import { GameDataMessage, ServerGameMessage } from "../../../model/game/system/server/ServerGameMessageSchema";

export type ServerMessage = GameDataMessage | ServerGameMessage;
